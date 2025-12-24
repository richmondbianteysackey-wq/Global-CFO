import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Building2, Send, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function Messages() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.company_id) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await api.getMessages(user.company_id);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.sendMessage({
        company_id: user.company_id,
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages();
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-primary">Global CFO LLC</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(user?.role === 'client' ? '/dashboard' : '/admin')} className="h-10 px-4 rounded-sm">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} data-testid="logout-btn" className="h-10 px-4 rounded-sm">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl tracking-tight font-bold text-primary mb-8">Messages</h1>

        <Card className="border border-slate-200 shadow-none rounded-md">
          <CardHeader>
            <CardTitle>Communication Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center py-8 text-slate-600">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center py-8 text-slate-600">No messages yet. Start a conversation!</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-sm ${
                      msg.sender_id === user.id
                        ? 'bg-accent/10 ml-12'
                        : 'bg-slate-100 mr-12'
                    }`}
                    data-testid={`message-${msg.id}`}
                  >
                    <p className="text-sm text-slate-900">{msg.message}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                data-testid="message-input"
                className="h-11 rounded-sm flex-1"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                data-testid="send-message-btn"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-none font-bold uppercase tracking-wide"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Messages;
