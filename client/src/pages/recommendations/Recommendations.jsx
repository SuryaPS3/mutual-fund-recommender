import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recommendationService from '../../services/recommendationService';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { TrendingUp, ArrowRight } from 'lucide-react';

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

  if (loading) {
    return <Loader text="Loading your personalized recommendations..." />;
  }

  if (recommendations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Recommendations Yet</h2>
        <p className="text-gray-600 mb-6">
          Complete your investment profile to get personalized recommendations
        </p>
        <Link to="/profile">
          <button className="btn-primary">
            Complete Profile
          </button>
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

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <Card key={rec.fund_id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                  <h3 className="text-xl font-semibold">{rec.fund?.scheme_name}</h3>
                </div>

                <p className="text-gray-600 mb-3">{rec.fund?.fund_house}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {rec.fund?.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Match: {(rec.score * 100).toFixed(0)}%
                  </span>
                  {rec.fund?.expense_ratio && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      Expense: {rec.fund.expense_ratio}%
                    </span>
                  )}
                </div>

                <p className="text-gray-700 italic">{rec.reason}</p>

                <Link to={`/funds/${rec.fund_id}`}>
                  <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              <div className="text-right ml-4">
                <div className="text-sm text-gray-500">Match Score</div>
                <div className="text-3xl font-bold text-blue-600">
                  {(rec.score * 100).toFixed(0)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;