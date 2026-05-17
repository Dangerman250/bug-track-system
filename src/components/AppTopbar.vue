<template>
  <div class="topbar">
    <button class="menu-btn" @click="$emit('toggle-sidebar')">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="topbar-title">{{ title }}</div>
    <div class="search-bar">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="#9ba3b8" stroke-width="1.5"/>
        <path d="M10 10l2 2" stroke="#9ba3b8" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" placeholder="search issues..." />
      <span class="search-kbd">⌘K</span>
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" title="Notifications">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5A4.5 4.5 0 003.5 6v2.5L2 10h12l-1.5-1.5V6A4.5 4.5 0 008 1.5z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span class="notif-dot"></span>
      </button>
      <router-link to="/app/profile" class="topbar-avatar">
        <img v-if="auth.user?.avatarUrl" :src="auth.user.avatarUrl" alt="profile" />
        <span v-else>{{ auth.initials }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
defineProps({ title: String, modelValue: String })
defineEmits(['toggle-sidebar', 'update:modelValue'])
const auth = useAuthStore()
</script>

<style scoped>
.topbar {
  height: 60px; background: var(--bg2);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 28px;
  gap: 16px; position: sticky; top: 0; z-index: 50;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.topbar-title {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1rem;
  flex: 1; letter-spacing: -0.02em; color: var(--text);
}
.search-bar {
  display: flex; align-items: center; gap: 9px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 8px; padding: 7px 12px; width: 240px;
  transition: all var(--transition);
}
.search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(91,91,214,0.08); }
.search-bar input {
  background: none; border: none; outline: none; color: var(--text);
  font-family: 'Inter', sans-serif; font-size: 0.83rem; width: 100%;
}
.search-bar input::placeholder { color: var(--text3); }
.search-kbd {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 4px; padding: 1px 6px; font-size: 0.68rem;
  color: var(--text3); font-family: 'JetBrains Mono', monospace;
  white-space: nowrap; flex-shrink: 0;
}
.topbar-actions { display: flex; align-items: center; gap: 10px; }
.icon-btn {
  position: relative; width: 34px; height: 34px; border-radius: 8px;
  background: var(--bg); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text2); transition: all var(--transition);
}
.icon-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
.notif-dot {
  position: absolute; top: 6px; right: 6px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent2); border: 1.5px solid white;
}
.topbar-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #6b7280);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.78rem; color: #fff;
  cursor: pointer; text-decoration: none;
  overflow: hidden; border: 2px solid var(--border);
  transition: all var(--transition);
}
.topbar-avatar:hover { border-color: var(--accent); transform: scale(1.05); }
.topbar-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.menu-btn {
  display: none; background: none; border: none; color: var(--text2);
  cursor: pointer; padding: 6px; border-radius: 7px;
  transition: all var(--transition);
}
.menu-btn:hover { background: var(--surface2); color: var(--text); }
@media (max-width: 720px) {
  .menu-btn { display: flex; align-items: center; }
  .search-bar { width: 150px; }
  .search-kbd { display: none; }
}
</style>
