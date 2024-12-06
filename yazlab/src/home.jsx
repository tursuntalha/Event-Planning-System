import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { MdGroups } from "react-icons/md"; // Sohbet kısmı kaldırılacak
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import axios from 'axios';
import { useLocation } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Debug için email bilgisini kontrol edelim
  console.log("Home'dan gönderilen email:", email);

  const handleLogoutClick = () => {
    axios
      .post("http://localhost:3001/logout", { email })
      .then(() => {
        navigate("/");
      })
      .catch(err => console.log(err));
  };

  return (
    <div 
      className="min-vh-100 bg-cover" 
      style={{ 
        backgroundImage: 'url(https://i.pinimg.com/originals/ef/37/81/ef37815019ae52354c7c5772f4e886d6.png)', 
        backgroundPosition: 'center', 
        backgroundSize: 'cover'
      }}
    >
      <header className="bg-transparent p-4 shadow-md text-center">
        <h1 className="text-3xl font-bold text-white">PLANLAMA</h1>
      </header>

      <div className="container py-5">
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {/* Etkinlikler Card */}
          <div className="col">
            <Link to="/etkinlik" className="card text-center text-white text-decoration-none" style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', border: 'none' }} state={{ email }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <BsFillChatSquareTextFill className="fs-1 mb-4" />
                <h5 className="card-title">Etkinlikler</h5>
              </div>
            </Link>
          </div>

          {/* Profil Card */}
          <div className="col">
            <Link to="/profil" className="card text-center text-white text-decoration-none" style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', border: 'none' }} state={{ email }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <IoMdSettings className="fs-1 mb-4" />
                <h5 className="card-title">Profil</h5>
              </div>
            </Link>
          </div>

          {/* Admin Card (Sadece hilmiy@gmail.com için gösterilecek) */}
          {email === 'hilmiy@gmail.com' && (
  <div className="col">
    <Link 
      to="/adminprofil" 
      className="card text-center text-white text-decoration-none" 
      style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', border: 'none' }} 
      state={{ email }}  // email bilgisini state olarak gönderiyoruz
    >
      <div className="card-body d-flex flex-column justify-content-center align-items-center">
        <MdGroups className="fs-1 mb-4" />
        <h5 className="card-title">Admin Profili</h5>
      </div>
    </Link>
  </div>
)}

        </div>

        {/* Logout Button */}
        <div 
          className="card text-center p-2 mt-5 cursor-pointer text-decoration-none" 
          onClick={handleLogoutClick} 
          style={{ backgroundColor: 'rgba(0, 52, 89, 0.6)', width: 'auto', margin: '0 auto' }}
        >
          <div 
            className="card-body d-flex flex-column justify-content-center align-items-center p-3" 
            style={{ 
              width: 'auto', 
              cursor: 'pointer', 
              transform: 'scale(0.9)' 
            }}
          >
            <h5 className="card-title text-white" style={{ fontSize: '1.5rem' }}>Logout</h5>
            <IoLogOutOutline className="fs-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
