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
      {recommendations.map((rec) => (
        <RecommendationCard key={rec._id || rec.rank} recommendation={rec} rank={rec.rank} />
      ))}
    </div>
  );
};

export default RecommendationList;