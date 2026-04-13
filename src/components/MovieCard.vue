<script setup>
import { useAuthStore } from '../stores/auth';
import { Pencil, Trash2, Plus, Play } from 'lucide-vue-next';

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

defineEmits(['click', 'edit', 'delete', 'add', 'watch']);

const authStore = useAuthStore();
</script>

<template>
  <div 
    class="movie-card"
    @click="$emit('click', movie)"
  >
    <!-- Poster Image Container -->
    <div class="poster-container">
      <img 
        :src="movie.poster" 
        :alt="movie.title"
        class="poster-img"
        loading="lazy"
      >
      <!-- Hover Overlay -->
      <div class="poster-overlay">
        <!-- Watch Button (All Users) -->
        <button 
          class="overlay-btn watch-btn" 
          @click.stop="$emit('watch', movie)"
          title="Watch Movie"
        >
          <Play class="icon-md" />
          <span>Watch</span>
        </button>

        <!-- Admin Buttons -->
        <div v-if="authStore.isAdmin" class="admin-actions">
         <!--  <button 
            class="action-btn add-btn" 
            @click.stop="$emit('add')"
            title="Add New Movie"
          >
            <Plus class="icon-sm" />
          </button>-->
          <button 
            class="action-btn edit-btn" 
            @click.stop="$emit('edit', movie)"
            title="Edit Movie"
          >
            <Pencil class="icon-sm" />
          </button>
          <button 
            class="action-btn delete-btn" 
            @click.stop="$emit('delete', movie.id)"
            title="Delete Movie"
          >
            <Trash2 class="icon-sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Movie Info -->
    <div class="movie-info">
      <h3 class="movie-title">
        {{ movie.title }}
      </h3>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.poster-container {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: var(--bg-card);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.movie-card:hover .poster-container {
  box-shadow: 0 20px 25px -5px var(--primary-glow), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster-img {
  transform: scale(1.05);
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.movie-card:hover .poster-overlay {
  opacity: 1;
}

/* Watch Button */
.watch-btn {
  background-color: var(--primary);
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  box-shadow: 0 4px 12px var(--primary-glow);
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.movie-card:hover .watch-btn {
  transform: translateY(0);
}

.watch-btn:hover {
  background-color: var(--primary-hover);
  transform: scale(1.05);
}

/* Admin Actions */
.admin-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.movie-card:hover .admin-actions {
  transform: translateX(0);
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.add-btn:hover { background-color: #10b981; color: white; border-color: #10b981; }
.edit-btn:hover { background-color: #3b82f6; color: white; border-color: #3b82f6; }
.delete-btn:hover { background-color: #ef4444; color: white; border-color: #ef4444; }

.icon-md { width: 1.25rem; height: 1.25rem; fill: currentColor; }
.icon-sm { width: 1rem; height: 1rem; }

.movie-info {
  text-align: center;
}

.movie-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.movie-card:hover .movie-title {
  color: var(--text-main);
}
</style>

