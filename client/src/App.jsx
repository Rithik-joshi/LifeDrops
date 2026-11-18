import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Donors from './pages/Donors';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import Dashboard from './pages/Dashboard';
import DonorProfile from './pages/DonorProfile';
import MyRequests from './pages/MyRequests';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/donors" element={<Donors />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/requests/:id" element={<RequestDetail />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/donor" element={<DonorProfile />} />
      <Route path="/dashboard/requests" element={<MyRequests />} />
      <Route path="/dashboard/profile" element={<Profile />} />
    </Route>

    <Route
      path="/admin"
      element={
        <ProtectedRoute adminOnly>
          <Admin />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
