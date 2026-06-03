import client from './client';

export const aiApi = {
  // RAG Chat
  chat: (question: string, poemId?: number) =>
    client.post('/ai/chat', { question, poemId }),

  // TTS
  getVoices: () => client.get('/ai/tts/voices'),
  generateTts: (poemId: number, options?: { voice?: string; speed?: number; style?: string }) =>
    client.post(`/ai/tts/${poemId}`, options),
  ttsStreamUrl: (poemId: number, voice?: string) =>
    `/api/ai/tts/${poemId}/stream?voice=${voice || 'shimmer'}`,

  // Lecture
  generateLecture: (poemId: number) => client.post(`/ai/lecture/${poemId}`),

  // Video
  getVideoTemplates: () => client.get('/ai/video/templates'),
  generateVideo: (poemId: number, template?: string) =>
    client.post(`/ai/video/${poemId}/generate`, { template }),
  getVideoStatus: (taskId: string) =>
    client.get(`/ai/video/status`, { params: { taskId } }),

  // Recommendations
  getRecommendations: (poemId?: number) =>
    client.get('/ai/recommendations', { params: { poemId } }),

  // Couplet
  generateCouplet: (firstLine: string) =>
    client.post('/ai/couplet', { firstLine }),

  // Continue poem
  continuePoem: (lines: string, style?: string) =>
    client.post('/ai/continue', { lines, style }),
};
