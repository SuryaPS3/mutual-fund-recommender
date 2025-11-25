import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import Card from '../common/Card';

const RecommendationCard = ({ recommendation, rank }) => {
  const { fund, score, reason } = recommendation;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-blue-600">#{rank}</span>
            <h3 className="text-xl font-semibold">{fund?.scheme_name}</h3>
          </div>

          <p className="text-gray-600 mb-3">{fund?.fund_house}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="primary">{fund?.category}</Badge>
            <Badge variant="success">Match: {(score * 100).toFixed(0)}%</Badge>
            {fund?.expense_ratio && (
              <Badge variant="default">Expense: {fund.expense_ratio}%</Badge>
            )}
          </div>

          <p className="text-gray-700 italic">{reason}</p>

          <Link to={`/funds/${recommendation.fund_id}`}>
            <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View Details <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="text-right ml-4">
          <div className="text-sm text-gray-500">Match Score</div>
          <div className="text-3xl font-bold text-blue-600">
            {(score * 100).toFixed(0)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard;