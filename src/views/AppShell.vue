<template>
  <div class="app-shell">
    <AppSidebar :is-open="sidebarOpen" />
    <div class="main-content">
      <AppTopbar :title="pageTitle" v-model="searchQ" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <router-view :search-q="searchQ" />
    </div>
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import { useIssuesStore } from '../stores/issues'

const sidebarOpen = ref(false)
const searchQ = ref('')
const route = useRoute()
const issuesStore = useIssuesStore()

onMounted(() => issuesStore.fetchAll())

const titleMap = {
  Dashboard: 'Dashboard', Issues: 'Issue Tracker', IssueDetail: 'Issue Detail',
  CreateIssue: 'Report Bug', Team: 'Team', Activity: 'Activity', Profile: 'My Profile'
}
const pageTitle = computed(() => titleMap[route.name] || 'BugNest')
</script>

<style scoped>
.app-shell { display: flex; min-height: 100vh; }
.main-content { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.sidebar-overlay { display: none; position: fixed; inset: 0; background: #00000066; z-index: 99; }
@media (max-width: 720px) {
  .main-content { margin-left: 0; }
  .sidebar-overlay { display: block; }
}
</style>
