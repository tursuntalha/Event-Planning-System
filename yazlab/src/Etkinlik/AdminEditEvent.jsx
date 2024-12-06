import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditEvent = () => {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    isActive: true,
    location: '',
    type: '',
    createdBy: '',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { eventName } = location.state || {};

  useEffect(() => {
    if (!eventName) {
      console.error('Etkinlik ismi alınamadı');
      return;
    }

    axios
      .get(`http://localhost:3001/events/${eventName}`)
      .then((response) => {
        const eventData = response.data;
        const formattedDate = formatDate(eventData.date);
        setEvent({ ...eventData, date: formattedDate });
      })
      .catch((error) => {
        console.error('Etkinlik bilgileri alınırken hata oluştu:', error);
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
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEvent = {
      name: event.name,
      date: event.date,
      isActive: event.isActive,
      location: event.location,
      type: event.type,
      createdBy: event.createdBy,
    };

    axios
      .put(`http://localhost:3001/adminevents/${eventName}`, updatedEvent)
      .then(() => {
        navigate('/adminprofil');
      })
      .catch((error) => {
        console.error('Etkinlik güncellenirken hata oluştu:', error);
        navigate('/adminprofil');
      });
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Etkinlik Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Etkinlik İsmi</label>
            <input
              type="text"
              name="name"
              value={event.name}
              onChange={handleChange}
              className="form-control"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Tarih</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              className="form-control"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Yer</label>
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              className="form-control"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Tür</label>
            <input
              type="text"
              name="type"
              value={event.type}
              onChange={handleChange}
              className="form-control"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Kurucu (Email)</label>
            <input
              type="text"
              name="createdBy"
              value={event.createdBy}
              onChange={handleChange}
              className="form-control"
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Durum</label>
            <select
              className="form-control"
              name="isActive"
              value={event.isActive}
              onChange={handleChange}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '15px',
              }}
            >
              <option value={true}>Aktif</option>
              <option value={false}>Pasif</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              marginTop: '10px',
            }}
          >
            Güncelle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditEvent;
