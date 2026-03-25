import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getPendingRequests, getMyConnections, acceptConnectionRequest } from '../api/connections';
import { UserCheck, UserPlus, Users } from 'lucide-react';

const Connections = () => {
  const [pending, setPending] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pend, conn] = await Promise.all([
        getPendingRequests(),
        getMyConnections()
      ]);
      setPending(pend);
      setConnections(conn.filter(c => c.status === 'ACCEPTED'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (id) => {
    try {
      await acceptConnectionRequest(id);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Failed to accept request");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[800px] mx-auto pt-6 px-4 pb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2"><Users className="w-6 h-6"/> My Network</h1>
        <p className="text-gray-500 text-sm mb-6">Manage your connections and pending requests</p>

        {loading ? (
          <div className="card p-8 text-center text-gray-400">Loading network…</div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Pending Requests */}
            {pending.length > 0 && (
              <div className="card p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Invitations ({pending.length})</h2>
                <div className="flex flex-col gap-3">
                  {pending.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {req.senderEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{req.senderEmail}</p>
                          <p className="text-xs text-gray-500">Sent a connection request</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="btn-outline px-3 py-1.5 text-sm">Ignore</button>
                         <button onClick={() => handleAccept(req.id)} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1"><UserCheck className="w-4 h-4"/> Accept</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Connections */}
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">My Connections ({connections.length})</h2>
              {connections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>You don't have any connections yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {connections.map(c => {
                    const currentUser = localStorage.getItem('email'); // Ideally from context, assuming sender or receiver
                    const otherUser = c.senderEmail === currentUser ? c.receiverEmail : c.senderEmail;
                    return (
                      <div key={c.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          {otherUser.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{otherUser}</p>
                          <p className="text-xs text-gray-500">Connected</p>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 px-2">
                           Message
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default Connections;
