<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  const success = await authStore.login(email.value, password.value, name.value);
  if (success) {
    router.push('/');
  } else {
    errorMessage.value = authStore.error;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card animate-fade">
      <h1 class="login-title">Sign In</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="John Doe"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@example.com"
            class="form-input"
          >
          <p class="form-hint">Type 'admin' for Administrative privileges</p>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="form-input"
          >
        </div>

        <button 
          type="submit"
          class="submit-btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  background-color: var(--bg-card);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-alert {
  background-color: rgba(225, 29, 72, 0.1);
  border: 1px solid rgba(225, 29, 72, 0.5);
  color: #fb7185;
  padding: 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-dim);
}

.form-input {
  width: 100%;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.85rem;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-style: italic;
  margin-top: 0.25rem;
}

.submit-btn {
  width: 100%;
  background-color: var(--primary);
  color: white;
  font-weight: 700;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
}

.submit-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>

