import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { getConversations, getChatHistory, markAsRead, connectWebSocket, sendChatMessage, ChatMessagePayload } from '../api/chat';
import axiosInstance from '../api/axios';
import { Client } from '@stomp/stompjs';
import { Send, MessageSquare, Search, ArrowLeft } from 'lucide-react';

interface Conversation {
  email: string;
  name: string;
  profilePictureUrl: string;
  role: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}

interface Message {
  id?: number;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const formatTime = (ts: string) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const Avatar = ({ src, name, size = 40, colorClass = 'avatar-green' }: { src?: string; name: string; size?: number; colorClass?: string }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div
      className={`avatar ${colorClass}`}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        fontSize: size * 0.4, padding: src ? 0 : undefined, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
      }}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </div>
  );
};

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = localStorage.getItem('email') || '';

  const colorClasses = ['avatar-green', 'avatar-blue', 'avatar-amber', 'avatar-red'];
  const getColor = (email: string) => colorClasses[email.charCodeAt(0) % colorClasses.length];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Open conversation from URL param (on mount or when param changes)
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam) {
      openConversation(userParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Connect WebSocket
  useEffect(() => {
    const client = connectWebSocket(
      (msg: ChatMessagePayload) => {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg as Message];
        });
        // Update conversations list unread count
        fetchConversations();
      },
      (err) => {
        console.error('WS error', err);
        setWsConnected(false);
      }
    );
    stompClient.current = client;

    const checkConnected = setInterval(() => {
      if (client.connected) {
        setWsConnected(true);
        clearInterval(checkConnected);
      }
    }, 500);

    return () => {
      client.deactivate();
      clearInterval(checkConnected);
    };
  }, []);

  // Fetch profile for an email not yet in the conversations list
  const fetchProfileForEmail = async (email: string): Promise<Conversation> => {
    // 1. Try to find in connections list (which has name + profile pic)
    try {
      const r = await axiosInstance.get('/connections');
      const myEmail = localStorage.getItem('email') || '';
      const conn = (r.data as any[]).find((c: any) => {
        const other = c.senderEmail === myEmail ? c.receiverEmail : c.senderEmail;
        return other === email;
      });
      if (conn) {
        return {
          email,
          name: conn.otherUserName || email,
          profilePictureUrl: conn.otherUserProfilePic || '',
          role: conn.otherUserRole || '',
          unreadCount: 0,
        };
      }
    } catch {}

    // 2. Try existing chat conversations list
    try {
      const r = await axiosInstance.get('/chat/conversations');
      const found = (r.data as Conversation[]).find((c) => c.email === email);
      if (found) return found;
    } catch {}

    // 3. Fallback: minimal object with email as name
    return { email, name: email, profilePictureUrl: '', role: '', unreadCount: 0 };
  };

  const openConversation = async (email: string) => {
    setActiveEmail(email);
    setMobileView('chat');
    setSearchParams({ user: email });
    setLoadingMsgs(true);

    // Find in conversations list or fetch profile
    let convo = conversations.find(c => c.email === email) || null;
    if (!convo) convo = await fetchProfileForEmail(email);
    setActiveConvo(convo);

    try {
      const history = await getChatHistory(email);
      setMessages(history);
      await markAsRead(email);
      // Clear unread badge for this convo
      setConversations(prev => prev.map(c => c.email === email ? { ...c, unreadCount: 0 } : c));
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !activeEmail || !stompClient.current) return;
    sendChatMessage(stompClient.current, activeEmail, input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', transition: 'background 0.3s ease' }}>
      <Header />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1.25rem 1rem 2rem' }}>
        <div
          className="card"
          style={{
            display: 'flex',
            height: 'calc(100vh - 110px)',
            overflow: 'hidden',
            border: '1px solid var(--border-default)',
          }}
        >
          {/* ── Sidebar: Conversation List ── */}
          <div
            style={{
              width: 320,
              flexShrink: 0,
              borderRight: '1px solid var(--border-default)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)',
            }}
            className={mobileView === 'chat' ? 'hidden lg:flex' : 'flex'}
          >
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <MessageSquare style={{ width: 18, height: 18, color: 'var(--brand)' }} />
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Messages</h2>
                <div style={{
                  marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
                  background: wsConnected ? '#22c55e' : '#ef4444',
                }} title={wsConnected ? 'Connected' : 'Connecting...'} />
              </div>
              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--bg-badge)', borderRadius: '8px', padding: '0.4rem 0.75rem',
              }}>
                <Search style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search messages…"
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    fontSize: '0.825rem', color: 'var(--text-primary)', width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConvos ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Loading…
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                  <MessageSquare style={{ width: 36, height: 36, color: 'var(--border-strong)', margin: '0 auto 0.75rem', display: 'block' }} />
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {searchQuery ? 'No matching conversations' : 'No messages yet'}
                  </p>
                  <p style={{ margin: '0.375rem 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Connect with people and start chatting!
                  </p>
                </div>
              ) : (
                filtered.map(c => {
                  const isActive = c.email === activeEmail;
                  return (
                    <button
                      key={c.email}
                      onClick={() => openConversation(c.email)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.875rem 1rem', background: isActive ? 'var(--brand-dim)' : 'transparent',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        borderBottom: '1px solid var(--border-default)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-badge)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ position: 'relative' }}>
                        <Avatar src={c.profilePictureUrl} name={c.name} colorClass={getColor(c.email)} />
                        {c.unreadCount > 0 && (
                          <span style={{
                            position: 'absolute', top: -3, right: -3,
                            background: 'var(--brand)', color: '#fff',
                            borderRadius: '999px', fontSize: '0.6rem', fontWeight: 700,
                            minWidth: 16, height: 16, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', padding: '0 3px',
                          }}>{c.unreadCount > 99 ? '99+' : c.unreadCount}</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                          <span style={{
                            fontWeight: c.unreadCount > 0 ? 700 : 600,
                            fontSize: '0.875rem', color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px',
                          }}>{c.name}</span>
                          {c.lastMessageTime && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                              {formatTime(c.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {c.lastMessage && (
                            <p style={{
                              margin: 0, fontSize: '0.775rem',
                              color: c.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                              fontWeight: c.unreadCount > 0 ? 600 : 400,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {c.lastMessageSender === currentUser ? 'You: ' : ''}{c.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-card)' }}
            className={mobileView === 'list' ? 'hidden lg:flex' : 'flex'}
          >
            {activeConvo ? (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-default)',
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  background: 'var(--bg-card)',
                }}>
                  <button
                    onClick={() => setMobileView('list')}
                    className="lg:hidden"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '0.25rem' }}
                  >
                    <ArrowLeft style={{ width: 18, height: 18 }} />
                  </button>
                  <Avatar src={activeConvo.profilePictureUrl} name={activeConvo.name} size={40} colorClass={getColor(activeConvo.email)} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{activeConvo.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConvo.role} · {activeConvo.email}</p>
                  </div>
                  <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem',
                    fontSize: '0.75rem', color: wsConnected ? '#22c55e' : 'var(--text-muted)',
                    fontWeight: 600,
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: wsConnected ? '#22c55e' : '#ef4444' }} />
                    {wsConnected ? 'Live' : 'Connecting…'}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {loadingMsgs ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Loading messages…
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
                      <MessageSquare style={{ width: 40, height: 40, color: 'var(--border-strong)' }} />
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                        No messages yet. Say hi! 👋
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => {
                        const isOwn = msg.senderEmail === currentUser;
                        const showDate = i === 0 || new Date(messages[i - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
                        return (
                          <React.Fragment key={msg.id ?? i}>
                            {showDate && (
                              <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                                <span style={{
                                  fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600,
                                  background: 'var(--bg-badge)', padding: '0.2rem 0.75rem', borderRadius: '999px',
                                }}>
                                  {new Date(msg.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem' }}>
                              {!isOwn && (
                                <Avatar src={activeConvo?.profilePictureUrl} name={activeConvo?.name || ''} size={28} colorClass={getColor(activeConvo?.email || '')} />
                              )}
                              <div style={{ maxWidth: '65%' }}>
                                <div style={{
                                  padding: '0.5rem 0.875rem',
                                  borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                  background: isOwn ? 'var(--brand)' : 'var(--bg-badge)',
                                  color: isOwn ? '#fff' : 'var(--text-primary)',
                                  fontSize: '0.875rem', lineHeight: 1.5, wordBreak: 'break-word',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                }}>
                                  {msg.content}
                                </div>
                                <p style={{
                                  margin: '0.2rem 0 0',
                                  fontSize: '0.68rem', color: 'var(--text-muted)',
                                  textAlign: isOwn ? 'right' : 'left',
                                }}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {isOwn && (
                                    <span style={{ marginLeft: '0.25rem', color: msg.read ? 'var(--brand)' : 'var(--text-muted)' }}>
                                      {msg.read ? ' ✓✓' : ' ✓'}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div style={{
                  padding: '0.875rem 1.25rem',
                  borderTop: '1px solid var(--border-default)',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-end',
                  background: 'var(--bg-card)',
                }}>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message… (Enter to send)"
                    rows={1}
                    style={{
                      flex: 1, resize: 'none', border: '1.5px solid var(--border-default)',
                      borderRadius: '12px', padding: '0.625rem 0.875rem',
                      fontSize: '0.875rem', color: 'var(--text-primary)', background: 'var(--bg-badge)',
                      outline: 'none', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
                      maxHeight: '120px', overflowY: 'auto', transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || !wsConnected}
                    style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: input.trim() && wsConnected ? 'var(--brand)' : 'var(--bg-badge)',
                      border: 'none', cursor: input.trim() && wsConnected ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', color: input.trim() && wsConnected ? '#fff' : 'var(--text-muted)',
                      transform: input.trim() && wsConnected ? 'scale(1)' : 'scale(0.95)',
                    }}
                  >
                    <Send style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </>
            ) : (
              /* Empty state */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', padding: '2rem' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: 'var(--brand-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MessageSquare style={{ width: 36, height: 36, color: 'var(--brand)' }} />
                </div>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Your Messages
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', maxWidth: 300 }}>
                  Select a conversation from the left, or go to <strong>My Network</strong> and click the message icon on a connected user.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
