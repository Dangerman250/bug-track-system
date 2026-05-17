import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Landing', component: () => import('../views/LandingView.vue'), meta: { public: true } },
  {
    path: '/app', component: () => import('../views/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'projects', name: 'Projects', component: () => import('../views/ProjectsView.vue') },
      { path: 'issues', name: 'Issues', component: () => import('../views/IssuesView.vue') },
      { path: 'issues/:id', name: 'IssueDetail', component: () => import('../views/IssueDetailView.vue') },
      { path: 'create', name: 'CreateIssue', component: () => import('../views/CreateIssueView.vue') },
      { path: 'team', name: 'Team', component: () => import('../views/TeamView.vue') },
      { path: 'activity', name: 'Activity', component: () => import('../views/ActivityView.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/ProfileView.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'Landing' }
  if (to.path === '/' && auth.isLoggedIn) return { path: '/app/dashboard' }
})

export default router
