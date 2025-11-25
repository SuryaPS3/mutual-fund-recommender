import FundCard from './FundCard';
import Loader from '../common/Loader';

const FundList = ({ funds, loading }) => {
  if (loading) {
    return <Loader text="Loading funds..." />;
  }

  if (!funds || funds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No funds found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {funds.map((fund) => (
        <FundCard key={fund.fund_id} fund={fund} />
      ))}
    </div>
  );
};

export default FundList;