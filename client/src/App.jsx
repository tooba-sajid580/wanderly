import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Cover from './pages/Cover';
import BrowseTrips from './pages/BrowseTrips';
import TripDetail from './pages/TripDetail';
import MyTrips from './pages/MyTrips';
import RequestTrip from './pages/RequestTrip';
import AdminDashboard from './pages/AdminDashboard';
import AdminTripForm from './pages/AdminTripForm';
import AdminTripMembers from './pages/AdminTripMembers';
import AdminRequests from './pages/AdminRequests';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Cover />} />
        <Route path="/trips" element={<BrowseTrips />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/request-trip" element={<RequestTrip />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-trip" element={<AdminTripForm />} />
        <Route path="/admin/trips/:tripId/members" element={<AdminTripMembers />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;