import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddData from './pages/AddData';
import Dashboard from './pages/Dashboard';
import CrudData from './pages/CrudData';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/add-data" element={<PrivateRoute><AddData /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/crud-data" element={<PrivateRoute><CrudData /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
