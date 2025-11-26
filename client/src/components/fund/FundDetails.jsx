import Card from '../common/Card';
import Badge from '../common/Badge';
import PerformanceChart from '../charts/PerformanceChart';

const FundDetails = ({ fund }) => {
  const performanceData = [
    { period: '1M', return: fund.return_1m || 0 },
    { period: '3M', return: fund.return_3m || 0 },
    { period: '6M', return: fund.return_6m || 0 },
    { period: '1Y', return: fund.return_1y || 0 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-3xl font-bold mb-4">{fund.scheme_name}</h1>
        <p className="text-xl text-gray-600 mb-6">{fund.fund_house}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-gray-500">Category</div>
            <div className="text-lg font-semibold">{fund.category}</div>
          </div>
          {fund.expense_ratio && (
            <div>
              <div className="text-sm text-gray-500">Expense Ratio</div>
              <div className="text-lg font-semibold">{fund.expense_ratio}%</div>
            </div>
          )}
          {fund.aum && (
            <div>
              <div className="text-sm text-gray-500">AUM</div>
              <div className="text-lg font-semibold">₹{fund.aum} Cr</div>
            </div>
          )}
          {fund.risk_rating && (
            <div>
              <div className="text-sm text-gray-500">Risk Rating</div>
              <div className="text-lg font-semibold">{fund.risk_rating}</div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Performance</h2>
        <PerformanceChart data={performanceData} />
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Returns</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fund.return_1m !== undefined && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">1 Month</div>
              <div className={`text-xl font-bold ${fund.return_1m > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fund.return_1m.toFixed(2)}%
              </div>
            </div>
          )}
          {fund.return_3m !== undefined && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">3 Months</div>
              <div className={`text-xl font-bold ${fund.return_3m > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fund.return_3m.toFixed(2)}%
              </div>
            </div>
          )}
          {fund.return_6m !== undefined && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">6 Months</div>
              <div className={`text-xl font-bold ${fund.return_6m > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fund.return_6m.toFixed(2)}%
              </div>
            </div>
          )}
          {fund.return_1y !== undefined && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">1 Year</div>
              <div className={`text-xl font-bold ${fund.return_1y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fund.return_1y.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FundDetails;