<script setup>
import { ref, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { useMovieStore } from '../stores/movie';

const props = defineProps({
  show: Boolean,
  movie: Object,
});

const emit = defineEmits(['close']);
const movieStore = useMovieStore();

const isEditing = computed(() => !!props.movie);

const formData = ref({
  id: props.movie?.id || null,
  title: props.movie?.title || '',
  description: props.movie?.description || '',
  genres: props.movie?.genres?.join(', ') || '',
  poster: props.movie?.poster || 'https://images.unsplash.com/photo-1542204113-e93526289de2?w=500&auto=format&fit=crop&q=60'
});

const handleSubmit = () => {
  const movieData = {
    ...formData.value,
    genres: formData.value.genres.split(',').map(g => g.trim()),
    year: props.movie?.year || 2026,
  };
  
  if (isEditing.value) {
    movieStore.updateMovie(movieData);
  } else {
    movieStore.addMovie(movieData);
  }
  
  emit('close');
};
</script>

<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container-small animate-slide-up">
        <header class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Edit Story' : 'Add New Story' }}</h2>
          <button @click="$emit('close')" class="icon-btn">
            <X class="icon-sm" />
          </button>
        </header>


        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-field">
            <label class="field-label">Title</label>
            <input v-model="formData.title" type="text" required class="field-input">
          </div>

          <div class="form-field">
            <label class="field-label">Genres (separated by commas)</label>
            <input v-model="formData.genres" type="text" required placeholder="Sci-Fi, Adventure" class="field-input">
          </div>

          <div class="form-field">
            <label class="field-label">Description</label>
            <textarea v-model="formData.description" required rows="3" class="field-input textarea"></textarea>
          </div>

          <div class="form-field">
            <label class="field-label">Cover Image URL</label>
            <input v-model="formData.poster" type="url" required class="field-input">
          </div>

          <footer class="form-footer">
            <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit">Add Content</button>
          </footer>
        </form>
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
  background-color: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(4px);
}

.modal-container-small {
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
}

.icon-btn {
  color: var(--text-dim);
}

.icon-btn:hover {
  color: var(--text-main);
}

.icon-sm {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-input {
  width: 100%;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--primary);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.btn-cancel {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  padding: 0.6rem 1rem;
}

.btn-cancel:hover {
  color: var(--text-main);
}

.btn-submit {
  background-color: var(--primary);
  color: white;
  font-weight: 700;
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.btn-submit:hover {
  background-color: var(--primary-hover);
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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

