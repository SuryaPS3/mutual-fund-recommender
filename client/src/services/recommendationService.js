import api from './api';

class RecommendationService {
  async getRecommendations() {
    const response = await api.post('/recommendations');
    return response.data;
  }

  async getHistory() {
    const response = await api.get('/recommendations/history');
    return response.data;
  }

  async getRecommendationById(recommendationId) {
    const response = await api.get(`/recommendations/${recommendationId}`);
    return response.data;
  }
}

export default new RecommendationService();