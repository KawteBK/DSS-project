import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  actions: {
    async login(email, password, name) {
      this.loading = true;
      this.error = null;
      
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (email && password && name) {
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
        this.user = { email, name, role };
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        return true;
      }
      
      this.error = 'All fields are required';
      this.loading = false;
      return false;
    },
    logout() {
      this.user = null;
      localStorage.removeItem('currentUser');
    }
  }
});
