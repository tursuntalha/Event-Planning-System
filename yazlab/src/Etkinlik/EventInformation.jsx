import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// OpenRouteService için API anahtarınız
const ORS_API_KEY = 'YOUR_OPENROUTESERVICE_API_KEY';

const EventInformation = () => {
  const { name } = useParams();
  const [event, setEvent] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [directions, setDirections] = useState(null);
  const location = useLocation();
  const email = location.state?.email; // Email'i location state'inden alıyoruz.

  const [userLocation, setUserLocation] = useState(null);
  const [isJoined, setIsJoined] = useState(false); // Katılım durumu

  useEffect(() => {
    if (!name) {
      console.error("Etkinlik ismi URL'den alınamadı");
      return;
    }

    axios.get(`http://localhost:3001/events/${name}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => {
        console.error("Etkinlik bilgileri alınırken hata oluştu:", error);
      });

    // Kullanıcının konumunu alıyoruz
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, [name]);

  useEffect(() => {
    if (userLocation && event) {
      // OpenRouteService API'si ile yön tarifi alıyoruz
      const routeRequest = {
        coordinates: [
          [userLocation.lng, userLocation.lat], // Kullanıcı konumu
          event.location.match(/Lat: ([\d.-]+), Lng: ([\d.-]+)/) ? [parseFloat(event.location.match(/Lat: ([\d.-]+), Lng: ([\d.-]+)/)[2]), parseFloat(event.location.match(/Lat: ([\d.-]+), Lng: ([\d.-]+)/)[1])] : [41.0082, 28.9784] // Varsayılan İstanbul koordinatları
        ],
        profile: 'driving-car',
        format: 'geojson'
      };

      axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        routeRequest,
        {
          headers: {
            'Authorization': `Bearer ${ORS_API_KEY}`
          }
        }
      )
      .then(response => {
        setDirections(response.data.routes[0].geometry.coordinates);
      })
      .catch(error => {
        console.error("Yön tarifi alınırken hata oluştu:", error);
      });
    }
  }, [userLocation, event]);

  const handleJoinEvent = () => {
    if (!userLocation) {
      alert("Konumunuz alınamadı. Lütfen tekrar deneyin.");
      return;
    }
  
    // Eğer etkinlik aktif değilse, kullanıcıya uyarı göster
    if (!event.isActive) {
      alert("Bu etkinlik henüz aktif değil.");
      return;
    }
  
    axios.put('http://localhost:3001/eventinformation/join/', {
      email: email,
      eventName: event.name
    })
    .then(response => {
      console.log("Etkinliğe katılım başarılı:", response.data);
      alert(response.data.message);  // Başarı mesajı
      setIsJoined(true);  // Katılım durumu güncelleniyor
    })
    .catch(error => {
      console.error("Etkinliğe katılma hatası:", error);
  
      // Eğer error.response varsa ve error.response.data.message varsa
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Etkinliğe katılma hatası: ${error.response.data.message}`);
      } else {
        alert("Bilinmeyen bir hata oluştu");
      }
  
      // Eğer kullanıcı zaten katıldıysa, isJoined state'ini true yap
      if (error.response?.data?.message === "Bu etkinlikte zaten katıldınız") {
        setIsJoined(true);
      }
    });
  };

  if (!event) {
    return <div>Etkinlik bilgisi yükleniyor...</div>;
  }

  // Harita koordinatlarını çıkartıyoruz
  const locationMatch = event.location.match(/Lat: ([\d.-]+), Lng: ([\d.-]+)/);
  const coordinates = locationMatch
    ? [parseFloat(locationMatch[1]), parseFloat(locationMatch[2])]
    : [41.0082, 28.9784]; // Varsayılan olarak İstanbul koordinatları

  return (
    <div className="container-fluid" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <div className="row justify-content-center" style={{ height: '100%' }}>
        <div className="col-12 col-md-8" style={{ zIndex: 10 }}>
          <div className="card shadow-lg border-light" style={{ backgroundColor: 'rgba(0, 52, 89, 0.7)', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '30px', position: 'relative', zIndex: 10 }}>
            <h2 className="card-title text-center mb-4">{event.name}</h2>
            <div className="mb-3">
              <h5 className="font-weight-bold">Açıklama:</h5>
              <p>{event.description}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Tarih:</h5>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Yer:</h5>
              <p>{event.location}</p>
            </div>
            <div className="mb-3">
              <h5 className="font-weight-bold">Tür:</h5>
              <p>{event.type}</p>
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={() => setShowMap(prev => !prev)} style={{ padding: '10px 20px', fontSize: '16px' }}>
                {showMap ? 'Haritayı Gizle' : 'Haritayı Göster ve Yol Tarifi Al'}
              </button>
              <button className="btn btn-primary" onClick={handleJoinEvent} disabled={isJoined} style={{ padding: '10px 20px', fontSize: '16px' }}>
                {isJoined ? 'Katıldınız' : 'Etkinliğe Katıl'}
              </button>
            </div>
          </div>
        </div>

        {/* Harita Bileşeni */}
        <div className="col-12 col-md-8" style={{ marginBottom: '30px' }}>
          {showMap && (
            <div style={{ height: '60vh', marginTop: '20px', overflow: 'hidden' }}>
              <MapContainer center={coordinates} zoom={13} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={coordinates}>
                  <Popup>
                    {event.name} <br /> {event.location}
                  </Popup>
                </Marker>
                {directions && (
                  <Polyline positions={directions.map(coord => [coord[1], coord[0]])} color="blue" />
                )}
              </MapContainer>
            </div>
          )}
        </div>

        {/* Google Maps yönlendirme butonu */}
        {userLocation && (
  <div className="col-12 d-flex justify-content-center mb-4">
    <a
      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${coordinates[0]},${coordinates[1]}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-danger"
      style={{ padding: '10px 20px', fontSize: '16px' }}
    >
      Mevcut Konumumu Google Maps'te Gör
    </a>
  </div>
)}


        {/* Sohbet Butonu */}
        <div className="col-12 text-center">
          <Link 
            to="/sohbet" 
            className="card text-center text-white text-decoration-none" 
            style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', border: 'none', padding: '15px 30px', fontSize: '18px', display: 'inline-block' }}
            state={{ email, eventName: event.name }} // Etkinlik ismi de iletiliyor
          >
            Sohbete Katıl
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventInformation;
