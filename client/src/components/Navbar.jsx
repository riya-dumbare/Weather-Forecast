import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌦️</span>
        <span className="text-xl font-bold">WeatherApp</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-blue-200 text-sm">
          👋 Hello, {user?.name || 'User'}!
        </span>
        <button
          onClick={handleLogout}
          className="bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;