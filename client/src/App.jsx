import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import ProtectedRoute from './components/ProtectedRoute';
import './styles/Footer.css';

// All API calls use this address. Set VITE_API_URL when you deploy.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={user ? <Cover /> : <Login />} />
          <Route path="/trips" element={<BrowseTrips />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />

          <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/request-trip" element={<ProtectedRoute><RequestTrip /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/create-trip" element={<ProtectedRoute adminOnly><AdminTripForm /></ProtectedRoute>} />
          <Route path="/admin/edit-trip/:tripId" element={<ProtectedRoute adminOnly><AdminTripForm /></ProtectedRoute>} />
          <Route path="/admin/trips/:tripId/members" element={<ProtectedRoute adminOnly><AdminTripMembers /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;