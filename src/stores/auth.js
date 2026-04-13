import { defineStore } from 'pinia';

const API = 'http://localhost:3000';

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
    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          this.error = data.message || 'Login failed';
          this.loading = false;
          return false;
        }

        // data = { role: "admin", username: "admin" }
        this.user = { username: data.username, role: data.role };
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.loading = false;
        return true;

      } catch (err) {
        this.error = 'Cannot reach server. Is the backend running?';
        this.loading = false;
        return false;
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('currentUser');
    }
  }
});