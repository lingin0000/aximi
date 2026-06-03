/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主题色 - 使用 CSS 变量
        't-bg': 'var(--bg)',
        't-card': 'var(--bg-card)',
        't-header': 'var(--bg-header)',
        't-input': 'var(--bg-input)',
        't-hover': 'var(--bg-hover)',
        't-tag': 'var(--bg-tag)',
        't-text': 'var(--text-primary)',
        't-text2': 'var(--text-secondary)',
        't-muted': 'var(--text-muted)',
        't-on-header': 'var(--text-on-header)',
        't-accent': 'var(--accent)',
        't-accent-light': 'var(--accent-light)',
        't-glow': 'var(--accent-glow)',
        't-border': 'var(--border)',
        // 保留原有色（作为 fallback）
        ink: {
          DEFAULT: '#2C5F2D',
          light: '#3D7A3E',
          dark: '#1E4620',
        },
        cream: {
          DEFAULT: '#FDF8F0',
          dark: '#F5EDE0',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C84A',
          dark: '#B8962E',
        },
      },
      fontFamily: {
        song: ['"SimSun"', '"Songti SC"', 'serif'],
        kai: ['"KaiTi"', '"Kaiti SC"', 'serif'],
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        poem: ['var(--font-poem)'],
      },
      borderRadius: {
        theme: 'var(--radius)',
      },
      boxShadow: {
        theme: 'var(--shadow)',
        card: 'var(--card-style)',
      },
    },
  },
  plugins: [],
}
