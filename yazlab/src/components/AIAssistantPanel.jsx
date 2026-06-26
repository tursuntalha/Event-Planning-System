import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AIAssistantPanel() {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Merhaba! Etkinlik planlamanızda size nasıl yardımcı olabilirim?\n\nÖrneğin:\n- "React workshop için açıklama oluştur"\n- "Takvim çakışması kontrol et"\n- "Toplantı için en uygun zamanı bul"'}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response || 'Yanıt alınamadı.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      <div className="bg-gray-800 rounded-lg flex flex-col" style={{ height: '600px' }}>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-700 ml-12' : 'bg-gray-700 mr-12'}`}>
              <pre className="text-sm whitespace-pre-wrap font-sans">{msg.text}</pre>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-sm">Düşünüyor...</div>}
        </div>
        <div className="p-3 border-t border-gray-600 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Mesajınızı yazın..." className="flex-1 bg-gray-700 p-2 rounded" />
          <button onClick={sendMessage} disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Gönder</button>
        </div>
      </div>
    </div>
  );
}
