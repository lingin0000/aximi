/**
 * 数据库种子脚本
 * 将 banju-web 中的 80 首诗词导入 PostgreSQL 数据库
 *
 * Usage: npm run seed
 */
import * as fs from 'fs';
import * as path from 'path';

// We'll use a minimal approach - read the JSON and use pg directly
const { Client } = require('pg');
const { getPinyinInitials } = require('../utils/pinyin');

interface PoemData {
  id?: number;
  title: string;
  author: string;
  dynasty: string;
  content: string;
  translation: string;
  appreciation: string;
  tags: string[];
  form: string;
}

async function seed() {
  // Load poems from banju-web
  const poemsPath = path.resolve(
    __dirname,
    '../../banju-web/src/data/poems.json',
  );
  if (!fs.existsSync(poemsPath)) {
    console.error('❌ poems.json not found at', poemsPath);
    process.exit(1);
  }

  const poems: PoemData[] = JSON.parse(fs.readFileSync(poemsPath, 'utf-8'));
  console.log(`📖 Loaded ${poems.length} poems from poems.json`);

  // Pre-compute pinyin initials
  for (const poem of poems) {
    const contentWithoutNewlines = poem.content.replace(/\n/g, '');
    (poem as any).pinyinInitials = getPinyinInitials(contentWithoutNewlines);
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'banju',
    password: process.env.DB_PASSWORD || 'banju_secret',
    database: process.env.DB_DATABASE || 'banju',
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL');

    // Check if poems table exists and has data
    const { rows: existing } = await client.query(
      'SELECT COUNT(*) as count FROM poems',
    );
    const count = parseInt(existing[0].count, 10);

    if (count > 0) {
      console.log(`⚠️  Poems table already has ${count} records. Skipping seed.`);
      await client.end();
      return;
    }

    // Insert poems
    let inserted = 0;
    for (const poem of poems) {
      await client.query(
        `INSERT INTO poems (title, author, dynasty, content, translation, appreciation, tags, form, pinyin_initials, popularity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          poem.title,
          poem.author,
          poem.dynasty,
          poem.content,
          poem.translation || '',
          poem.appreciation || '',
          poem.tags || [],
          poem.form || '',
          (poem as any).pinyinInitials || '',
          Math.floor(Math.random() * 100),
        ],
      );
      inserted++;
    }

    console.log(`✅ Successfully inserted ${inserted} poems`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('❌ Seed failed:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure PostgreSQL is running:');
      console.log('   docker-compose up -d');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
