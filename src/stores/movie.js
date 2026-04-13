import { defineStore } from 'pinia';
import moviesData from '../data/movies.json';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: moviesData,
    searchQuery: '',
    selectedGenre: 'All',
    loading: false,
  }),
  getters: {
    filteredMovies: (state) => {
      return state.movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesGenre = state.selectedGenre === 'All' || movie.genres.includes(state.selectedGenre);
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
        const moviesInGenre = state.filteredMovies.filter(m => m.genres.includes(genre));
        if (moviesInGenre.length > 0) {
          grouped[genre] = moviesInGenre;
        }
      });
      
      return grouped;
    }
  },
  actions: {
    addMovie(movie) {
      const newMovie = {
        ...movie,
        id: Math.max(...this.movies.map(m => m.id), 0) + 1,
      };
      this.movies.push(newMovie);
    },
    updateMovie(updatedMovie) {
      const index = this.movies.findIndex(m => m.id === updatedMovie.id);
      if (index !== -1) {
        this.movies[index] = updatedMovie;
      }
    },
    deleteMovie(id) {
      this.movies = this.movies.filter(m => m.id !== id);
    },
    setSearchQuery(query) {
      this.searchQuery = query;
    },
    setGenre(genre) {
      this.selectedGenre = genre;
    }
  }
});
