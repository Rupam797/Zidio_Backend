import axiosInstance from './axios';
import { Client } from '@stomp/stompjs';

// ── REST API ──

export const getConversations = async () => {
  const r = await axiosInstance.get('/chat/conversations');
  return r.data;
};

export const getChatHistory = async (email: string) => {
  const r = await axiosInstance.get(`/chat/history/${encodeURIComponent(email)}`);
  return r.data;
};

export const markAsRead = async (email: string) => {
  await axiosInstance.put(`/chat/read/${encodeURIComponent(email)}`);
};

// ── WebSocket ──

export interface ChatMessagePayload {
  id?: number;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const WS_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')
  .replace('/api', '');

/**
 * Dynamically load SockJS from CDN if not already available on window.
 */
const loadSockJS = (): Promise<void> => {
  return new Promise((resolve) => {
    if ((window as any).SockJS) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1.6.1/dist/sockjs.min.js';
    script.onload = () => resolve();
    script.onerror = () => resolve(); // fallback even if CDN fails
    document.head.appendChild(script);
  });
};

/**
 * Create and activate a STOMP client over SockJS.
 * Returns the client instance so you can subscribe and send messages.
 */
export const connectWebSocket = (
  onMessage: (msg: ChatMessagePayload) => void,
  onError?: (err: any) => void,
): Client => {
  const token = localStorage.getItem('token') || '';

  const client = new Client({
    webSocketFactory: () => {
      const SockJSClass = (window as any).SockJS;
      if (SockJSClass) {
        return new SockJSClass(`${WS_BASE}/ws`);
      }
      // If SockJS isn't available, use plain WebSocket (may not work with SockJS endpoint)
      return new WebSocket(`${WS_BASE.replace('http', 'ws')}/ws/websocket`);
    },
    connectHeaders: {
      Authorization: `Bearer ${token}`,
      token: token,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      // Subscribe to personal message queue
      client.subscribe('/user/queue/messages', (frame) => {
        try {
          const msg = JSON.parse(frame.body) as ChatMessagePayload;
          onMessage(msg);
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      });

      // Subscribe to error queue
      client.subscribe('/user/queue/errors', (frame) => {
        try {
          const err = JSON.parse(frame.body);
          console.error('Chat error:', err);
          if (onError) onError(err);
        } catch (e) {
          console.error('Failed to parse error:', e);
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      if (onError) onError(frame);
    },
  });

  // Load SockJS then activate STOMP
  loadSockJS().then(() => client.activate());
  return client;
};

/**
 * Send a chat message via the STOMP client.
 */
export const sendChatMessage = (client: Client, receiverEmail: string, content: string) => {
  if (client && client.connected) {
    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ receiverEmail, content }),
    });
  }
};
