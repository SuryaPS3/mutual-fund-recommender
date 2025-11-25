import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FundCard = ({ fund }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/funds/${fund.fund_id}`)}
    >
      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{fund.scheme_name}</h3>
      <p className="text-gray-600 mb-3">{fund.fund_house}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="primary">{fund.category}</Badge>
        {fund.expense_ratio && (
          <Badge variant="default">Expense: {fund.expense_ratio}%</Badge>
        )}
      </div>

      {fund.return_1y !== undefined && (
        <div className="flex items-center gap-2">
          {fund.return_1y > 0 ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
          <span className={`text-lg font-semibold ${fund.return_1y > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fund.return_1y.toFixed(2)}% (1Y)
          </span>
        </div>
      )}
    </div>
  );
};

export default FundCard;