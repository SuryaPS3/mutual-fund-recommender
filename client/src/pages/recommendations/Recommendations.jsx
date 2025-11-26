import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recommendationService from '../../services/recommendationService';
import RecommendationList from '../../components/recommendation/RecommendationList';
import { TrendingUp } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && recommendations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Recommendations Yet</h2>
        <p className="text-gray-600 mb-6">
          Complete your investment profile to get personalized recommendations
        </p>
        <Link to="/profile">
          <button className="btn-primary">Complete Profile</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Your Personalized Recommendations</h1>
      <p className="text-gray-600 mb-8">
        Top {recommendations.length} mutual funds matched to your investment profile
      </p>
      <RecommendationList recommendations={recommendations} loading={loading} />
    </div>
  );
};

export default Recommendations;