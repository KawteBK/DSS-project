<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useMovieStore } from '../stores/movie';
import { LogOut, Search } from 'lucide-vue-next';

const authStore = useAuthStore();
const movieStore = useMovieStore();
const router = useRouter();

const searchQuery = ref('');

const handleSearch = () => {
  movieStore.setSearchQuery(searchQuery.value);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <header class="main-header">
    <div class="header-content container-max">
      <router-link to="/" class="header-logo">
        FLIXNODE
      </router-link>

      <div v-if="authStore.isAuthenticated" class="search-container">
        <label class="search-wrapper">
          <Search class="search-icon" />
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            placeholder="Search movies..."
            class="search-input"
          >
        </label>
      </div>

      <div v-if="authStore.isAuthenticated" class="user-actions">
        <span class="user-greeting">Welcome, {{ authStore.user.name }}</span>
        <button @click="handleLogout" class="logout-btn" title="Logout">
          <LogOut class="logout-icon" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--text-dim);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.6rem 1rem 0.6rem 2.8rem;
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--primary);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-greeting {
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .user-greeting {
    display: none;
  }
}

.logout-btn {
  color: var(--text-dim);
}

.logout-btn:hover {
  color: var(--text-main);
}

.logout-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

