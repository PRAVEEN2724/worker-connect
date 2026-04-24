import { useState, useEffect, useRef } from 'react';
import { messageApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import './Messaging.css';

export default function Messaging() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    messageApi.getPartners()
      .then(r => setPartners(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    messageApi.getConversation(selected.id)
      .then(r => { setMessages(r.data); setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selected]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selected) return;
    try {
      const res = await messageApi.send(selected.id, newMsg.trim());
      setMessages(prev => [...prev, res.data]);
      setNewMsg('');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch { toast.error('Failed to send'); }
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <h2>Messages</h2>
        <p className="text-muted">Chat with workers and helpers</p>
      </div>
      <div className="msg-layout">
        <div className="msg-partners">
          {partners.length === 0
            ? <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: 13 }}>No conversations yet</div>
            : partners.map(p => (
              <div key={p.id} className={`msg-partner-item ${selected?.id === p.id ? 'active' : ''}`}
                onClick={() => setSelected(p)}>
                <div className="avatar-placeholder avatar-sm" style={{ fontSize: 13 }}>
                  {p.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{p.role}</div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="msg-chat">
          {!selected
            ? <div className="empty-state"><div className="empty-state-icon">💬</div><p className="text-muted">Select a conversation</p></div>
            : <>
              <div className="msg-chat-header">
                <div className="avatar-placeholder avatar-sm" style={{ fontSize: 13 }}>
                  {selected.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{selected.role}</div>
                </div>
              </div>
              <div className="msg-messages">
                {loading && <div className="flex justify-center" style={{ padding: 24 }}><div className="spinner" /></div>}
                {messages.map(m => (
                  <div key={m.id} className={`msg-bubble ${m.sender?.id === selected.id ? 'incoming' : 'outgoing'}`}>
                    <div className="msg-text">{m.content}</div>
                    <div className="msg-time">{new Date(m.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="msg-input-row">
                <input type="text" className="form-input" placeholder="Type a message..."
                  value={newMsg} onChange={e => setNewMsg(e.target.value)} />
                <button type="submit" className="btn btn-primary" disabled={!newMsg.trim()}>
                  <Send size={16} />
                </button>
              </form>
            </>
          }
        </div>
      </div>
    </div>
  );
}
