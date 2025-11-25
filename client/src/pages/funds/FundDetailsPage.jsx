import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import fundService from '../../services/fundService';
import FundDetails from '../../components/fund/FundDetails';
import Loader from '../../components/common/Loader';
import { ArrowLeft } from 'lucide-react';

const FundDetailsPage = () => {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFundDetails();
  }, [id]);

  const fetchFundDetails = async () => {
    try {
      const data = await fundService.getFundById(id);
      setFund(data);
    } catch (error) {
      console.error('Error fetching fund details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading fund details..." />;
  }

  if (!fund) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Fund Not Found</h2>
        <Link to="/funds" className="text-blue-600 hover:text-blue-700">
          ← Back to Funds
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/funds" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Funds
      </Link>
      <FundDetails fund={fund} />
    </div>
  );
};

export default FundDetailsPage;