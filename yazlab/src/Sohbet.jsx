import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';

const Sohbet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log("Email:", email);
  
    if (email) {
      setUserName(email);
    } else {
      setUserName('Anonim');
    }
  
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
  
    // Backend'den gelen mesajları dinliyoruz
    newSocket.on('receiveMessage', (newMessage) => {
      console.log("Gelen Mesaj (Backend'den):", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);  // Yeni gelen mesajı ekliyoruz
    });
  
    // Kullanıcı bağlandığında geçmiş mesajları alıyoruz
    newSocket.on('previousMessages', (historyMessages) => {
      setMessages(historyMessages); // Geçmiş mesajları ekrana yazdırıyoruz
    });

    // Kullanıcı aktif olduğunda backend'e bildiriyoruz
    if (userName) {
      newSocket.emit('userActive', userName);
    }

    return () => {
      newSocket.off('receiveMessage'); // Event'i temizliyoruz
      newSocket.off('previousMessages');
    };
  }, [email, userName]);
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    const data = { text: message, sender: userName || 'Anonim', timestamp: new Date().toISOString() };
    console.log("Gönderilen Mesaj (Frontend):", data);

    // Sadece mesajı backend'e gönderiyoruz, ekranda beklememize gerek yok
    socket.emit('sendMessage', data);  

    setMessage('');  // Mesaj kutusunu temizliyoruz
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div>
      <div className="d-flex justify-content-start p-3">
        <button
          onClick={() => navigate('/home', { state: { email } })}
          className="btn btn-light"
          style={{ borderRadius: '25px' }}
        >
          Home
        </button>
      </div>

      <div className="container-fluid" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)', backgroundSize: 'cover', height: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 p-4 bg-opacity-60 rounded-3" style={{ backgroundColor: 'rgba(0, 52, 89, 0.7)' }}>
            <h1 className="text-center text-white mb-4">Sohbetlerim</h1>

            <div className="messages-container p-4 rounded-3 mb-3" style={{ height: 'calc(100vh - 200px)', overflowY: 'auto', opacity: 0.85, backgroundColor: 'rgba(0, 52, 89, 0.1)' }}>
              {messages.length === 0 ? (
                <div className="text-center text-white">Henüz mesaj yok.</div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`d-flex mb-2 ${msg.sender === userName ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-3 rounded-3 text-white ${msg.sender === userName ? 'bg-success' : 'bg-primary'}`}>
                      <strong>{msg.sender}: </strong> {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="d-flex fixed-bottom p-3" style={{ bottom: '0', left: '0', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderTop: '1px solid #ccc' }}>
              <input
                className="form-control me-2"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                style={{ borderRadius: '25px' }}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} style={{ borderRadius: '25px' }}>Gönder</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sohbet;
