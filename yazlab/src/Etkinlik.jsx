import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Etkinliklerim = () => {
  const navigate = useNavigate();
  const [createdEvents, setCreatedEvents] = useState([]); // Oluşturduğum etkinlikler
  const [suggestedEvents, setSuggestedEvents] = useState([]); // Önerilen etkinlikler
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    // Oluşturduğum etkinlikleri API'den al
    axios.get("http://localhost:3001/createdevent", { params: { email } })
      .then(response => {
        setCreatedEvents(response.data);
      })
      .catch(error => {
        console.error("Etkinlikler alınırken bir hata oluştu:", error);
      });

    // Önerilen etkinlikleri API'den al (email'i query parametre olarak gönderiyoruz)
    if (email) {
      axios.get("http://localhost:3001/suggested-events", { params: { email } })
        .then(response => {
          setSuggestedEvents(response.data);
        })
        .catch(error => {
          console.error("Önerilen etkinlikler alınırken bir hata oluştu:", error);
        });
    }
  }, [email]);

  const handleEventClick = (eventName) => {
    navigate(`/events/${eventName}`, { state: { email } });  // Yönlendirmede email'i gönderiyoruz
  };

  const handleDelete = (eventName) => {
    axios.delete(`http://localhost:3001/events/${eventName}`)
      .then(response => {
        alert("Etkinlik başarıyla silindi!");
        setCreatedEvents(createdEvents.filter(event => event.name !== eventName)); // Silinen etkinliği listeden çıkar
      })
      .catch(error => {
        console.error("Etkinlik silinirken hata oluştu:", error);
        alert("Etkinlik silinirken bir hata oluştu.");
      });
  };

  const handleEdit = (eventName) => {
    navigate(`/EditEvent`, { state: { eventName, email } }); // Email ile yönlendirme yapıyoruz
  };

  // Header Bileşeni
  const Header = () => {
    return (
      <div className="header bg-dark text-white py-3">
        <div className="container d-flex justify-content-between">
          <button onClick={() => navigate('/home', { state: { email } })} className="btn btn-light">Home</button>
          <button onClick={() => navigate('/profil', { state: { email } })} className="btn btn-light">Profil</button>
      
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header /> {/* Header'ı buraya ekliyoruz */}
      <div className="container-fluid min-vh-100 d-flex" style={{
        backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>
        <div className="row w-100">
          {/* Sol Kolon: Oluşturduğum Etkinlikler */}
          <div className="col-12 col-md-6 p-4">
            <h3>Oluşturduğum Etkinlikler</h3>
            <div className="row">
              {createdEvents.map((event) => (
                <div key={event._id} className="col-12 mb-4">
                  <div
                    className="card border-light shadow-lg p-4 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', color: 'white', cursor: 'pointer', transition: 'transform 0.3s ease-in-out', height: '200px' }}
                    onClick={() => handleEventClick(event.name)}
                  >
                    <div>
                      <h4 className="card-title" style={{ fontSize: '1.5rem' }}>
                        {event.name}
                      </h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-warning mr-2" onClick={() => handleEdit(event.name)}>Düzenle</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(event.name)}>Sil</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/create-event', { state: { email } })}>Oluştur</button>
            </div>
          </div>

          {/* Sağ Kolon: Önerilen Etkinlikler */}
          <div className="col-12 col-md-6 p-4">
            <h3>Önerilen Etkinlikler</h3>
            <div className="row">
              {suggestedEvents.map((event) => (
                <div key={event._id} className="col-12 mb-4">
                  <div
                    className="card border-light shadow-lg p-4 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', color: 'white', cursor: 'pointer', transition: 'transform 0.3s ease-in-out', height: '200px' }}
                    onClick={() => handleEventClick(event.name)}
                  >
                    <div>
                      <h4 className="card-title" style={{ fontSize: '1.5rem' }}>
                        {event.name}
                      </h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etkinliklerim;
