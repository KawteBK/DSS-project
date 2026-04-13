<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { useMovieStore } from './stores/movie';
const movieStore = useMovieStore();
movieStore.fetchMovies(); 
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    
    <main class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter />

    <!-- Global Background Elements -->
    <div class="background-decor">
      <div class="glow-top"></div>
      <div class="glow-bottom"></div>
    </div>
  </div>
</template>

<style>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.page-content {
  flex-grow: 1;
}

.background-decor {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
}

.glow-top {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, transparent 70%);
  filter: blur(80px);
}

.glow-bottom {
  position: absolute;
  bottom: -5%;
  right: -5%;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30, 41, 59, 0.2) 0%, transparent 70%);
  filter: blur(100px);
}

/* Transitions */
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.2s ease;
}

.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
}
</style>

