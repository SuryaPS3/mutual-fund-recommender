import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null; // Don't show navbar on login/register pages
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-lg">
                MF
              </div>
              <span className="text-xl font-semibold text-gray-800">FundWise</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/funds"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/funds') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Explore Funds</span>
            </Link>
            
            <Link
              to="/recommendations"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/recommendations') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Recommendations</span>
            </Link>
            
            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/profile') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

            <div className="border-l pl-6 ml-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{user?.full_name || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;