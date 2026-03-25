import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getMyNotifications, markAllRead } from '../api/notifications';
import { Bell, Heart, MessageSquare, UserPlus, Briefcase } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(notifications.map(n => ({...n, read: true})));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_LIKE': return <Heart className="w-5 h-5 text-red-500" />;
      case 'COMMENT': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED': return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'JOB_APPLICATION': return <Briefcase className="w-5 h-5 text-indigo-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[700px] mx-auto pt-6 px-4 pb-12">
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
            {notifications.some(n => !n.read) && (
              <button onClick={handleMarkAllRead} className="text-sm text-zidio-green hover:underline font-semibold">
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading notifications…</div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map(note => (
                <div key={note.id} className={`flex gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!note.read ? 'bg-emerald-50/50' : ''}`}>
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(note.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{note.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                  {!note.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-zidio-green flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
