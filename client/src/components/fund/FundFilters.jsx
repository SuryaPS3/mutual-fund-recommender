import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

const FundFilters = ({ onSearch, onFilterChange, categories }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('return_1y');

  const handleSearch = () => {
    onSearch({ search, category, sortBy });
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search funds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
        
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            onFilterChange({ search, category: e.target.value, sortBy });
          }}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category} ({cat.count})
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            onFilterChange({ search, category, sortBy: e.target.value });
          }}
          className="input-field"
        >
          <option value="return_1y">Sort by 1Y Return</option>
          <option value="expense_ratio">Sort by Expense Ratio</option>
          <option value="aum">Sort by AUM</option>
        </select>

        <button onClick={handleSearch} className="btn-primary">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FundFilters;