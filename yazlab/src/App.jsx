import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Signup';
import Login from './login';
import Home from './home';
import Profil from './Profil';
import AdminProfil from './AdminProfil';
import Etkinlik from './Etkinlik';
import CreateEvent from './Etkinlik/CreateEvent';
import EventInformation from './Etkinlik/EventInformation';
import ForgotPassword from './ForgotPassword ';
import EditEvent from './Etkinlik/EditEvent';
import AdminEditEvent from './Etkinlik/AdminEditEvent';
import CalendarView from './components/CalendarView';
import AIAssistantPanel from './components/AIAssistantPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/adminprofil" element={<AdminProfil />} />
        <Route path="/etkinlik" element={<Etkinlik />} />
        <Route path="/sohbet" element={<div>Sohbet</div>} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:name" element={<EventInformation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/EditEvent" element={<EditEvent />} />
        <Route path="/admin/edit-event/:eventname" element={<AdminEditEvent />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/ai-assistant" element={<AIAssistantPanel />} />
        <Route path="*" element={<div className="text-center p-10">404 - Sayfa Bulunamadı</div>} />
      </Routes>
    </Router>
  );
}

export default App;
