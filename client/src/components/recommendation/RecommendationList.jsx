import RecommendationCard from './RecommendationCard';
import Loader from '../common/Loader';

const RecommendationList = ({ recommendations, loading }) => {
  if (loading) {
    return <Loader text="Loading recommendations..." />;
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <RecommendationCard key={rec.fund_id} recommendation={rec} rank={index + 1} />
      ))}
    </div>
  );
};

export default RecommendationList;