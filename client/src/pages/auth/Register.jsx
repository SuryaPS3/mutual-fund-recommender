import { Link } from 'react-router-dom';
import { TrendingUp, Target, BarChart3, User } from 'lucide-react';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <User className="w-12 h-12 text-blue-600" />,
      title: 'Complete Your Profile',
      description: 'Answer a few questions about your investment goals and risk tolerance',
      link: '/profile',
      linkText: 'Set Up Profile',
      color: 'bg-blue-50',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      title: 'Get Recommendations',
      description: 'Receive personalized mutual fund recommendations based on your profile',
      link: '/recommendations',
      linkText: 'View Recommendations',
      color: 'bg-green-50',
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-600" />,
      title: 'Explore Funds',
      description: 'Browse through thousands of mutual funds with detailed analytics',
      link: '/funds',
      linkText: 'Explore Funds',
      color: 'bg-purple-50',
    },
    {
      icon: <Target className="w-12 h-12 text-orange-600" />,
      title: 'Compare Funds',
      description: 'Compare multiple funds side-by-side to make informed decisions',
      link: '/funds',
      linkText: 'Compare Now',
      color: 'bg-orange-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name || 'Investor'}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Let's help you find the perfect mutual funds for your investment goals
        </p>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Start Your Investment Journey</h2>
            <p className="text-blue-100 mb-4">
              Get AI-powered recommendations tailored to your financial goals
            </p>
            <Link to="/profile">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="w-32 h-32 text-blue-400 opacity-50" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <Link to={feature.link}>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                {feature.linkText} →
              </button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">10,000+</div>
          <div className="text-gray-600 mt-2">Mutual Funds</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">AI-Powered</div>
          <div className="text-gray-600 mt-2">Recommendations</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600">Real-time</div>
          <div className="text-gray-600 mt-2">NAV Updates</div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;