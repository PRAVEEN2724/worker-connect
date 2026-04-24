import { useState } from 'react';
import { messageApi } from '../lib/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SendMessageModal({ receiver, onClose, rolePath }) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setSending(true);
    try {
      await messageApi.send(receiver.id, content.trim());
      toast.success('Message sent!');
      onClose();
      // Optionally redirect to the messages tab so they can continue chatting
      if (rolePath) {
        navigate(`/${rolePath}/messages`);
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <h3 style={{ marginBottom: 4 }}>Message {receiver.name}</h3>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 20 }}>
          Send a direct message to start a conversation.
        </p>
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <textarea 
              className="form-textarea" 
              placeholder="Type your message here..." 
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)} 
            />
          </div>
          <div className="flex gap-3" style={{ marginTop: 4 }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'} <Send size={14} style={{marginLeft: 6}} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
