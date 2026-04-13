import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API = 'http://localhost:3000';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
    searchQuery: '',
    selectedGenre: 'All',
    loading: false,
    error: null,
  }),

  getters: {
    filteredMovies: (state) => {
      return state.movies.filter(movie => {
        const matchesSearch = movie.title
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());
        const matchesGenre =
          state.selectedGenre === 'All' ||
          movie.genres.includes(state.selectedGenre);
        return matchesSearch && matchesGenre;
      });
    },
    genres: (state) => {
      const allGenres = state.movies.flatMap(m => m.genres);
      return ['All', ...new Set(allGenres)];
    },
    moviesByGenre: (state) => {
      const genres = state.genres.filter(g => g !== 'All');
      const grouped = {};
      genres.forEach(genre => {
        const moviesInGenre = state.filteredMovies.filter(m =>
          m.genres.includes(genre)
        );
        if (moviesInGenre.length > 0) grouped[genre] = moviesInGenre;
      });
      return grouped;
    },
  },

  actions: {
    //  helper

    adminHeaders() {
      return {
        'Content-Type': 'application/json',
        role: 'admin',          // backend reads this header
      };
    },

    // read operations (all users)

    async fetchMovies(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        // Build query string from params object
        // e.g. fetchMovies({ genre: 'Action', rating: 'desc' })
        const query = new URLSearchParams(params).toString();
        const url = query ? `${API}/films?${query}` : `${API}/films`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load films');
        this.movies = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchMovie(id) {
      const res = await fetch(`${API}/films/${id}`);
      if (!res.ok) return null;
      return await res.json();
    },

    // create operation (admin)

    async addMovie(movie) {
      this.error = null;
      try {
        const res = await fetch(`${API}/films`, {
          method: 'POST',
          headers: this.adminHeaders(),
          body: JSON.stringify(movie),
        });
        const data = await res.json();
        if (!res.ok) {
          this.error = data.message || 'Failed to add film';
          return false;
        }
        this.movies.push(data);
        return true;
      } catch (err) {
        this.error = 'Server error while adding film';
        return false;
      }
    },

    //update operation (admin)

    async updateMovie(updatedMovie) {
      this.error = null;
      try {
        const res = await fetch(`${API}/films/${updatedMovie.id}`, {
          method: 'PUT',
          headers: this.adminHeaders(),
          body: JSON.stringify(updatedMovie),
        });
        const data = await res.json();
        if (!res.ok) {
          this.error = data.message || 'Failed to update film';
          return false;
        }
        const index = this.movies.findIndex(m => m.id === updatedMovie.id);
        if (index !== -1) this.movies[index] = data;
        return true;
      } catch (err) {
        this.error = 'Server error while updating film';
        return false;
      }
    },

    //  DELETE (admin) 

    async deleteMovie(id) {
      this.error = null;
      try {
        const res = await fetch(`${API}/films/${id}`, {
          method: 'DELETE',
          headers: this.adminHeaders(),
        });
        if (!res.ok) {
          const data = await res.json();
          this.error = data.message || 'Failed to delete film';
          return false;
        }
        this.movies = this.movies.filter(m => m.id !== id);
        return true;
      } catch (err) {
        this.error = 'Server error while deleting film';
        return false;
      }
    },

    //  Local filters (no network call)

    setSearchQuery(query) {
      this.searchQuery = query;
    },
    setGenre(genre) {
      this.selectedGenre = genre;
    },
  },
});