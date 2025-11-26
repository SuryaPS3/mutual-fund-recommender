import { useState, useEffect } from 'react';
import fundService from '../../services/fundService';
import FundList from '../../components/fund/FundList';
import FundFilters from '../../components/fund/FundFilters';

const FundExplorer = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchFunds();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await fundService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFunds = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await fundService.getAllFunds(filters);
      setFunds(data.funds || []);
    } catch (error) {
      console.error('Error fetching funds:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Mutual Funds</h1>
      <FundFilters 
        onSearch={fetchFunds} 
        onFilterChange={fetchFunds} 
        categories={categories} 
      />
      <FundList funds={funds} loading={loading} />
    </div>
  );
};

export default FundExplorer;