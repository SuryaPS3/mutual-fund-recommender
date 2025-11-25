import api from './api';

class FundService {
  async getAllFunds(params = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'return_1y',
      order = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page,
      limit,
      sortBy,
      order
    });

    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const response = await api.get(`/funds?${queryParams}`);
    return response.data;
  }

  async getFundById(fundId) {
    const response = await api.get(`/funds/${fundId}`);
    return response.data;
  }

  async getNAVHistory(fundId, days = 365) {
    const response = await api.get(`/funds/${fundId}/nav-history?days=${days}`);
    return response.data;
  }

  async getFundPerformance(fundId) {
    const response = await api.get(`/funds/${fundId}/performance`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get('/funds/categories');
    return response.data;
  }

  async compareFunds(fundIds) {
    const response = await api.post('/funds/compare', { fund_ids: fundIds });
    return response.data;
  }

  async searchFunds(query) {
    const response = await api.get(`/funds?search=${encodeURIComponent(query)}&limit=10`);
    return response.data;
  }
}

export default new FundService();