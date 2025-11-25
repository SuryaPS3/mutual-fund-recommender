import api from './api';

class UserService {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.put('/profile', profileData);
    return response.data;
  }

  async createProfile(profileData) {
    const response = await api.post('/profile', profileData);
    return response.data;
  }

  async getWatchlist() {
    const response = await api.get('/watchlist');
    return response.data;
  }

  async addToWatchlist(fundId) {
    const response = await api.post('/watchlist', { fund_id: fundId });
    return response.data;
  }

  async removeFromWatchlist(fundId) {
    const response = await api.delete(`/watchlist/${fundId}`);
    return response.data;
  }
}

export default new UserService();