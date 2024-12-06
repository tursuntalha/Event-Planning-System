import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    location: '',
    type: '',
    createdBy: ''
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { eventName, email } = location.state || {};

  useEffect(() => {
    if (!eventName) {
      console.error("Etkinlik ismi alınamadı");
      return;
    }

    axios.get(`http://localhost:3001/events/${eventName}`)
      .then(response => {
        const eventData = response.data;
        const formattedDate = formatDate(eventData.date);
        setEvent({ ...eventData, date: formattedDate });
      })
      .catch(error => {
        console.error("Etkinlik bilgileri alınırken hata oluştu:", error);
      });
  }, [eventName]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEvent = {
      newName: event.name,
      date: event.date,
      location: event.location,
      type: event.type,
      createdBy: event.createdBy
    };

    axios.put(`http://localhost:3001/editevents/${eventName}`, updatedEvent)
      .then(response => {
        alert("Etkinlik başarıyla güncellendi!");
        navigate('/etkinlik', { state: { email } });
      })
      .catch(error => {
        console.error("Etkinlik güncellenirken hata oluştu:", error);
        alert("Etkinlik güncellenirken bir hata oluştu.");
      });
  };

  return (
    <div style={{ backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)', backgroundSize: 'cover', minHeight: '100vh' }}>
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center mb-5" style={{ color: '#333' }}>Etkinlik Düzenle</h1>

        {/* Home Button */}
        <div className="d-flex justify-content-center p-3 w-100 mb-4">
          <button
            onClick={() => navigate('/home', { state: { email } })}
            className="btn btn-light"
            style={{
              borderRadius: '30px',
              padding: '10px 25px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
          >
            Home
          </button>
        </div>

        <div className="card shadow-lg p-4" style={{
          width: '60%',
          borderRadius: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}>
          <h2 className="text-center mb-4" style={{ color: '#444', fontWeight: 'bold' }}>Etkinlik Bilgilerini Düzenle</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Etkinlik İsmi</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={event.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tarih</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={event.date}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Yer</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={event.location}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tür</label>
              <input
                type="text"
                className="form-control"
                name="type"
                value={event.type}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Kurucu (Email)</label>
              <input
                type="text"
                className="form-control"
                name="createdBy"
                value={event.createdBy}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Güncelle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
