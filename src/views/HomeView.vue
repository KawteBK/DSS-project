<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useMovieStore } from '../stores/movie';
import { useAuthStore } from '../stores/auth';
import { Loader2, Plus } from 'lucide-vue-next';
import MovieCard from '../components/MovieCard.vue';
import MovieModal from '../components/MovieModal.vue';
import AddMovieModal from '../components/AddMovieModal.vue';

const movieStore = useMovieStore();
const authStore = useAuthStore();

const selectedMovie = ref(null);
const showModal = ref(false);

const editingMovie = ref(null);
const showAddModal = ref(false);

// Infinite Scroll logic
const ITEMS_PER_ROW = 6;
const INITIAL_ROWS = 3;
const visibleCount = ref(ITEMS_PER_ROW * INITIAL_ROWS);
const loadMoreTrigger = ref(null);
const isLoadingMore = ref(false);

const displayedMovies = computed(() => {
  return movieStore.filteredMovies.slice(0, visibleCount.value);
});

const hasMore = computed(() => {
  return visibleCount.value < movieStore.filteredMovies.length;
});

const loadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    isLoadingMore.value = true;
    setTimeout(() => {
      visibleCount.value += ITEMS_PER_ROW;
      isLoadingMore.value = false;
    }, 400);
  }
};

let observer;
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  }, { 
    rootMargin: '200px',
    threshold: 0.1 
  });

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

watch([() => movieStore.searchQuery, () => movieStore.selectedGenre], () => {
  visibleCount.value = ITEMS_PER_ROW * INITIAL_ROWS;
});

const openMovieModal = (movie) => {
  selectedMovie.value = movie;
  showModal.value = true;
};

const handleAdd = () => {
  editingMovie.value = null;
  showAddModal.value = true;
};

const handleEdit = (movie) => {
  editingMovie.value = movie;
  showAddModal.value = true;
};

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this content?')) {
    movieStore.deleteMovie(id);
  }
};

const handleWatch = (movie) => {
  selectedMovie.value = movie;
  showModal.value = true;
};
</script>

<template>
  <main class="home-view container-max animate-fade">
    
    <!-- Section Title & Actions -->
    <header class="view-header">
      <div class="header-main">
        <h2 class="view-title">Movies</h2>
        <div class="title-accent"></div>
      </div>
      
      <button 
        v-if="authStore.isAdmin" 
        @click="handleAdd"
        class="add-movie-btn"
      >
        <Plus class="icon-sm" />
        <span>Add Movie</span>
      </button>
    </header>

    <!-- Category Filters -->
    <nav class="category-filters">
      <button 
        v-for="genre in movieStore.genres" 
        :key="genre"
        @click="movieStore.setGenre(genre)"
        class="category-btn"
        :class="{ active: movieStore.selectedGenre === genre }"
      >
        {{ genre }}
      </button>
    </nav>

    <!-- Movie Grid -->
    <div v-if="movieStore.filteredMovies.length > 0">
      <div class="movie-grid">
        <MovieCard 
          v-for="movie in displayedMovies" 
          :key="movie.id" 
          :movie="movie" 
          @click="openMovieModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @add="handleAdd"
          @watch="handleWatch"
        />
      </div>

      <!-- Load More Trigger -->
      <div 
        ref="loadMoreTrigger" 
        class="load-more-section"
        v-if="hasMore"
      >
        <div v-if="isLoadingMore" class="loader-wrapper">
          <Loader2 class="loader-icon" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon-wrapper">
        <Loader2 class="empty-icon" />
      </div>
      <p class="empty-text">No movies found.</p>
      <p class="empty-subtext">Try adjusting your filters or search query.</p>
    </div>

    <!-- Modals -->
    <MovieModal 
      v-if="selectedMovie"
      :show="showModal"
      :movie="selectedMovie"
      @close="showModal = false"
    />

    <AddMovieModal 
      v-if="showAddModal"
      :show="showAddModal"
      :movie="editingMovie"
      @close="showAddModal = false"
    />
  </main>
</template>


<style scoped>
.home-view {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.view-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-movie-btn {
  background-color: var(--primary);
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.add-movie-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.add-movie-btn:active {
  transform: translateY(0);
}

.view-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  text-transform: uppercase;
}

.title-accent {
  height: 4px;
  width: 50px;
  background-color: var(--primary);
  border-radius: 2px;
}

.category-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  /* Hide scrollbar for a clean look */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-filters::-webkit-scrollbar {
  display: none;
}

.category-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background-color: var(--bg-card);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.category-btn:hover {
  color: var(--text-main);
  border-color: var(--text-dim);
}

.category-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.0rem;
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-dim);
}

.loader-icon {
  width: 2rem;
  height: 2rem;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 8rem 0;
}

.empty-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: var(--bg-card);
  margin-bottom: 1.5rem;
}

.empty-icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-dim);
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-muted);
}

.empty-subtext {
  color: var(--text-dim);
  margin-top: 0.5rem;
}
</style>
