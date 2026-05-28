// src/services/chatService.js
// Handles communication with the AI Chat backend endpoint via Axios

import axios from 'axios';

const chatApi = axios.create({
  baseURL: '/api/chat',
  headers: { 'Content-Type': 'application/json' },
  // LLM calls can take several seconds – use a generous timeout
  timeout: 60_000,
});

/**
 * Sends a user message to the AI backend and returns the reply string.
 *
 * @param {string} message  The user's raw input text
 * @returns {Promise<string>} The AI's reply text
 * @throws {Error} On network failure or non-2xx response
 */
export const sendChatMessage = async (message) => {
  const { data } = await chatApi.post('/ask', { message });
  return data.reply;
};

/**
 * Streams the user message to the AI chat endpoint and calls callbacks on chunks.
 *
 * @param {string} message The user's query
 * @param {function} onChunk Callback when a chunk of text arrives
 * @param {function} onDone Callback when streaming completes
 * @param {function} onError Callback on failure
 */
export const streamChat = async (message, onChunk, onDone, onError) => {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data:')) {
          let content = line.slice(5);
          if (content.endsWith('\r')) {
            content = content.slice(0, -1);
          }
          if (content) {
            onChunk(content);
          }
        }
      }
    }

    if (buffer) {
      if (buffer.startsWith('data:')) {
        let content = buffer.slice(5);
        if (content.endsWith('\r')) {
          content = content.slice(0, -1);
        }
        if (content) {
          onChunk(content);
        }
      }
    }

    onDone();
  } catch (err) {
    if (onError) {
      onError(err);
    }
  }
};

