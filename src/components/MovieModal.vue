<script setup>
import { X, Star, Calendar, Clapperboard, Play, Download } from 'lucide-vue-next';

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['close']);

const handleWatch = (url) => {
  alert('Starting playback...');
};
</script>

<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <!-- Modal Content -->
      <div class="modal-container">
        <!-- Close Button -->
        <button @click="$emit('close')" class="modal-close-btn">
          <X class="close-icon" />
        </button>

        <div class="modal-content">
          <!-- Left side: Poster -->
          <div class="modal-poster-wrapper">
            <img :src="movie.poster" :alt="movie.title" class="modal-poster-img">
          </div>
          
          <!-- Right side: Content -->
          <div class="modal-details">
            <header class="details-header">
              <h2 class="details-title">{{ movie.title }}</h2>
              <div class="details-meta">
                <span class="meta-item rating">
                  <Star class="meta-icon icon-yellow" />
                  {{ movie.rating }}
                </span>
                <span class="meta-item year">
                  <Calendar class="meta-icon" />
                  {{ movie.year }}
                </span>
              </div>
            </header>
            
            <section class="details-section">
              <h4 class="section-label">
                <Clapperboard class="label-icon" />
                Genres
              </h4>
              <div class="genre-tags">
                <span v-for="genre in movie.genres" :key="genre" class="genre-tag">
                  {{ genre }}
                </span>
              </div>
            </section>
            
            <section class="details-section">
              <h4 class="section-label">Storyline</h4>
              <p class="description-text">{{ movie.description }}</p>
            </section>
            
            <footer class="details-footer">
              <div class="footer-actions">
                <button @click="handleWatch(movie.videoUrl)" class="btn-watch">
                  <Play class="btn-icon" />
                  <span>Watch Movie</span>
                </button>
                
                <a v-if="movie.downloadUrl" :href="movie.downloadUrl" download class="btn-download">
                  <Download class="btn-icon" />
                  <span>Download</span>
                </a>
                
                <button @click="$emit('close')" class="btn-secondary">
                  Close
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  background-color: var(--bg-card);
  border-radius: 1.25rem;
  border: 1px solid var(--border-color);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 20;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background-color: var(--primary);
  color: white;
  transform: rotate(90deg);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal-content {
    flex-direction: row;
  }
}

.modal-poster-wrapper {
  width: 100%;
}

@media (min-width: 768px) {
  .modal-poster-wrapper {
    width: 40%;
    border-right: 1px solid var(--border-color);
  }
}

.modal-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 400px;
}

@media (min-width: 768px) {
  .modal-poster-img {
    max-height: none;
  }
}

.modal-details {
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .modal-details {
    padding: 1.5rem;
  }
}

.details-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}

.details-meta {
  display: flex;
  gap: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.rating {
  color: var(--accent-yellow);
}

.meta-icon {
  width: 1rem;
  height: 1rem;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.label-icon {
  width: 0.9rem;
  height: 0.9rem;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background-color: var(--border-color);
  color: var(--text-muted);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.description-text {
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 1rem;
}

.details-footer {
  margin-top: auto;
  padding-top: 1rem;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-watch {
  background-color: var(--primary);
  color: white;
  padding: 0.85rem 2rem;
  border-radius: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px var(--primary-glow);
  font-size: 1rem;
}

.btn-watch:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-download {
  background-color: transparent;
  color: var(--text-main);
  padding: 0.85rem 1.5rem;
  border-radius: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--border-color);
  text-decoration: none;
}

.btn-download:hover {
  background-color: var(--border-color);
}

.btn-secondary {
  padding: 0.85rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border-radius: 0.6rem;
  font-weight: 600;
  margin-left: auto;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 640px) {
  .btn-watch, .btn-download, .btn-secondary {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
}

/* Modal Fade Animation */

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

