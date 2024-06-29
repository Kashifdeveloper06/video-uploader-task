import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserVideos from './pages/UserVideos';
import AllUsers from './pages/AllUsers';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Profile />} />
              <Route path="/user/:id" element={<UserVideos />} />
              <Route path="/listing" element={<AllUsers />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;