import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState(""); // Konum adı (örn. "İzmit")
  const [type, setType] = useState("");
  const [coordinates, setCoordinates] = useState(null); // Koordinatlar (latitude, longitude)
  const [email, setEmail] = useState(""); // Kurucunun emaili

  const navigate = useNavigate(); // Yönlendirme işlemi için useNavigate hook'u

  const LocationMarker = () => {
    const map = useMapEvents({
      click(event) {
        // Tıklanan koordinatları alıyoruz
        const { lat, lng } = event.latlng;
        setCoordinates({ latitude: lat, longitude: lng });
        setLocation(`Lat: ${lat}, Lng: ${lng}`); // Konum bilgisini string olarak göster
      },
    });

    return coordinates ? (
      <Marker position={[coordinates.latitude, coordinates.longitude]}>
        <Popup>Seçilen Konum: {location}</Popup>
      </Marker>
    ) : null; // Eğer koordinat varsa marker'ı göster
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coordinates) {
      alert("Lütfen harita üzerinde bir konum seçin.");
      return;
    }

    const newEvent = {
      name,
      date,
      location,
      coordinates, // Koordinatları kaydediyoruz
      type,
      createdBy: email, // Kurucunun emailini gönderiyoruz
    };

    axios
      .post("http://localhost:3001/create-event", newEvent)
      .then((response) => {
        alert("Etkinlik başarıyla oluşturuldu!");
        navigate("/etkinlik", { state: { email } }); // Yönlendirme işlemi
      })
      .catch((error) => {
        console.error("Etkinlik oluşturulurken hata oluştu", error);
        alert("Etkinlik oluşturulurken bir hata oluştu.");
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="p-4 rounded shadow bg-light"
        style={{
          width: "70%",
          backgroundColor: "rgba(255, 255, 255, 0.85)", // Şeffaflık için
        }}
      >
        <h2 className="text-center mb-4">Yeni Etkinlik Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Etkinlik İsmi</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Etkinlik Tarihi</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Etkinlik Konumu</label>
            <div style={{ height: "400px" }}>
              <MapContainer
                center={[41.0082, 28.9784]} // Başlangıç noktası
                zoom={12}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <input
              type="text"
              className="form-control mt-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Konum Adı (örn. İzmit)"
              disabled // Konum harita üzerinden alınacak, kullanıcı giremez
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Etkinlik Türü</label>
            <input
              type="text"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Kurucu Emaili</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Oluştur
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
