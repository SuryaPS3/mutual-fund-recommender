import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

const RiskProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    risk_profile: '',
    investment_horizon: 12,
    budget_type: 'SIP',
    budget_amount: 5000,
    expense_ratio_limit: 2.0,
    dividend_preference: false,
    investment_goal: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await userService.createProfile(formData);
      toast.success('Profile created successfully!');
      navigate('/recommendations');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Build Your Investment Profile</h1>
      <p className="text-gray-600 mb-8">
        Answer a few questions to get personalized fund recommendations
      </p>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Investment Goal</h3>
          <select
            value={formData.investment_goal}
            onChange={(e) => handleChange('investment_goal', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select your goal</option>
            <option value="retirement">Retirement Planning</option>
            <option value="wealth">Wealth Creation</option>
            <option value="education">Child's Education</option>
            <option value="emergency">Emergency Fund</option>
          </select>
        </Card>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Risk Tolerance</h3>
          <p className="text-sm text-gray-600 mb-3">
            How would you react to a 20% drop in your portfolio?
          </p>
          <div className="space-y-2">
            {[
              { value: 'Conservative', label: 'I would sell immediately - Preserve capital' },
              { value: 'Balanced', label: 'I would hold and monitor - Balanced approach' },
              { value: 'Aggressive', label: 'I would invest more - Maximize returns' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="risk_profile"
                  value={option.value}
                  checked={formData.risk_profile === option.value}
                  onChange={(e) => handleChange('risk_profile', e.target.value)}
                  className="mr-3"
                  required
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Investment Horizon (months)</label>
            <input
              type="number"
              value={formData.investment_horizon}
              onChange={(e) => handleChange('investment_horizon', parseInt(e.target.value))}
              min="6"
              max="360"
              className="input-field"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.investment_horizon} months ({(formData.investment_horizon / 12).toFixed(1)} years)
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Investment Type</label>
            <select
              value={formData.budget_type}
              onChange={(e) => handleChange('budget_type', e.target.value)}
              className="input-field"
            >
              <option value="SIP">Monthly SIP</option>
              <option value="Lumpsum">One-time Lumpsum</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.budget_amount}
              onChange={(e) => handleChange('budget_amount', parseInt(e.target.value))}
              min="500"
              step="500"
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Maximum Expense Ratio (%)
            </label>
            <input
              type="number"
              value={formData.expense_ratio_limit}
              onChange={(e) => handleChange('expense_ratio_limit', parseFloat(e.target.value))}
              min="0.5"
              max="3"
              step="0.1"
              className="input-field"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dividend"
              checked={formData.dividend_preference}
              onChange={(e) => handleChange('dividend_preference', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="dividend" className="text-sm">
              Prefer dividend-paying funds
            </label>
          </div>
        </Card>

        <Button type="submit" variant="primary" className="w-full">
          Save Profile & Get Recommendations
        </Button>
      </form>
    </div>
  );
};

export default RiskProfile;