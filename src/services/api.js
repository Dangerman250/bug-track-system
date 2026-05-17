// services/api.js
// Mock backend that simulates a REST API with localStorage persistence

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))

// Seed data
const SEED_ISSUES = [
  {
    id: 'BT-001', title: 'Login button not responding on mobile Safari',
    status: 'open', priority: 'Critical', assignee: 'Jamie Chen',
    tags: ['auth', 'mobile'], created: '2025-05-08',
    description: 'Users on iPhone 13+ running iOS 17 report that tapping the login button produces no response. Consistent on Safari but not Chrome for iOS.',
    steps: '1. Open site on iPhone (Safari)\n2. Enter credentials\n3. Tap "Login"\n4. Nothing happens',
    env: 'Production',
    comments: [
      { author: 'Jamie Chen', time: '2h ago', text: 'Confirmed on my test device. Looking into the event handler.' },
      { author: 'Sam Rivera', time: '1h ago', text: 'Try adding `touch-action: manipulation` — might be the iOS 17 click delay.' }
    ]
  },
  {
    id: 'BT-002', title: 'Dashboard chart not rendering on first load',
    status: 'in progress', priority: 'High', assignee: 'Alex Dev',
    tags: ['ui', 'charts'], created: '2025-05-07',
    description: 'The dashboard chart component fails to render on initial page load. A hard refresh fixes it temporarily.',
    steps: '1. Log in fresh\n2. Navigate to Dashboard\n3. Chart area shows blank',
    env: 'Staging', comments: []
  },
  {
    id: 'BT-003', title: 'Email notification delay > 10 minutes',
    status: 'open', priority: 'High', assignee: 'Jordan Kim',
    tags: ['backend', 'email'], created: '2025-05-06',
    description: 'Email notifications for new issue assignments are delayed by 10+ minutes. Queue seems backed up.',
    steps: '', env: 'Production', comments: []
  },
  {
    id: 'BT-004', title: 'CSV export includes deleted records',
    status: 'resolved', priority: 'Medium', assignee: 'Sam Rivera',
    tags: ['export', 'data'], created: '2025-05-05',
    description: "Exporting issues to CSV still includes soft-deleted records. The query is missing the `deleted_at IS NULL` filter.",
    steps: '', env: 'Production',
    comments: [{ author: 'Sam Rivera', time: '3d ago', text: 'Fixed. Added the filter to the export query.' }]
  },
  {
    id: 'BT-005', title: 'Search bar results lag 2-3 seconds',
    status: 'open', priority: 'Medium', assignee: 'Jamie Chen',
    tags: ['performance', 'search'], created: '2025-05-04',
    description: 'Typing in the search bar causes a 2-3 second lag before results appear. Need to add debouncing.',
    steps: '', env: 'Production', comments: []
  },
  {
    id: 'BT-006', title: 'Sidebar collapses unexpectedly on resize',
    status: 'closed', priority: 'Low', assignee: 'Alex Dev',
    tags: ['ui', 'responsive'], created: '2025-05-03',
    description: 'When resizing the browser between 768px–900px, the sidebar auto-collapses even when it should stay visible.',
    steps: '', env: 'Development', comments: []
  },
  {
    id: 'BT-007', title: 'Password reset link expires too quickly',
    status: 'open', priority: 'High', assignee: 'Jordan Kim',
    tags: ['auth', 'security'], created: '2025-05-02',
    description: 'Reset links expire after 5 minutes — too short. Users frequently report expired link errors.',
    steps: '', env: 'Production', comments: []
  }
]

const SEED_USERS = [
  { id: 1, firstName: 'Alex', lastName: 'Dev', email: 'alex@bugtrack.io', password: 'demo1234', role: 'Senior Developer', bio: 'Full-stack dev who loves clean code.', location: 'San Francisco, CA', github: 'github.com/alexdev', avatarUrl: '' },
]

// Storage helpers
function getDB(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function setDB(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

function initDB() {
  if (!localStorage.getItem('bn_issues')) setDB('bn_issues', SEED_ISSUES)
  if (!localStorage.getItem('bn_users')) setDB('bn_users', SEED_USERS)
  if (!localStorage.getItem('bn_activity')) setDB('bn_activity', [
    { user: 'Jamie Chen', action: 'marked #BT-004 as Resolved', time: '2h ago', color: '#43e97b' },
    { user: 'Alex Dev', action: 'created issue #BT-007 (High priority)', time: '4h ago', color: '#ff6584' },
    { user: 'Sam Rivera', action: 'commented on #BT-002', time: '5h ago', color: '#6c63ff' },
    { user: 'Jordan Kim', action: 'was assigned #BT-003', time: '6h ago', color: '#f7971e' },
    { user: 'Alex Dev', action: 'changed #BT-006 to Closed', time: '1d ago', color: '#9ba3c2' },
  ])
}

initDB()

// ── AUTH ────────────────────────────────────────────────
export const authApi = {
  async login(email, password) {
    await delay()
    const users = getDB('bn_users', [])
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid email or password')
    const { password: _, ...safeUser } = user
    return safeUser
  },

  async register(data) {
    await delay()
    const users = getDB('bn_users', [])
    if (users.find(u => u.email === data.email)) throw new Error('Email already registered')
    const newUser = {
      id: Date.now(), firstName: data.firstName, lastName: data.lastName,
      email: data.email, password: data.password,
      role: data.role || 'developer',
      bio: '', location: '', github: '', avatarUrl: ''
    }
    users.push(newUser)
    setDB('bn_users', users)
    const { password: _, ...safeUser } = newUser
    return safeUser
  },

  async updateProfile(id, updates) {
    await delay()
    const users = getDB('bn_users', [])
    let idx = users.findIndex(u => u.id === id)
    if (idx === -1) {
      // User not in db yet (e.g. demo login) — create entry
      users.push({ id, password: 'demo1234', ...updates })
      idx = users.length - 1
    } else {
      users[idx] = { ...users[idx], ...updates }
    }
    setDB('bn_users', users)
    const { password: _, ...safeUser } = users[idx]
    return safeUser
  },

  async changePassword(id, currentPw, newPw) {
    await delay()
    const users = getDB('bn_users', [])
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) throw new Error('Please save your profile at least once before changing your password.')
    if (users[idx].password !== currentPw) throw new Error('Current password is incorrect')
    users[idx].password = newPw
    setDB('bn_users', users)
    return true
  }
}

// ── ISSUES ──────────────────────────────────────────────
export const issuesApi = {
  async getAll() {
    await delay()
    return getDB('bn_issues', [])
  },

  async getById(id) {
    await delay()
    const issues = getDB('bn_issues', [])
    const issue = issues.find(i => i.id === id)
    if (!issue) throw new Error('Issue not found')
    return issue
  },

  async create(data, author) {
    await delay()
    const issues = getDB('bn_issues', [])
    const num = String(issues.length + 1).padStart(3, '0')
    const newIssue = {
      id: `BT-${num}`,
      projectId: data.projectId || null,
      title: data.title, status: data.status || 'open',
      priority: data.priority || 'Medium',
      assignee: data.assignee || author,
      tags: data.tags || [],
      created: new Date().toISOString().slice(0, 10),
      description: data.description, steps: data.steps || '',
      env: data.env || 'Production', comments: []
    }
    issues.unshift(newIssue)
    setDB('bn_issues', issues)
    addActivity(author, `created issue ${newIssue.id} (${newIssue.priority} priority)`, '#6c63ff')
    return newIssue
  },

  async update(id, updates, author) {
    await delay()
    const issues = getDB('bn_issues', [])
    const idx = issues.findIndex(i => i.id === id)
    if (idx === -1) throw new Error('Issue not found')
    issues[idx] = { ...issues[idx], ...updates }
    setDB('bn_issues', issues)
    if (updates.status) addActivity(author, `changed ${id} to ${updates.status}`, '#f7971e')
    return issues[idx]
  },

  async delete(id, author) {
    await delay()
    const issues = getDB('bn_issues', [])
    const filtered = issues.filter(i => i.id !== id)
    setDB('bn_issues', filtered)
    addActivity(author, `deleted issue ${id}`, '#ff6584')
    return true
  },

  async addComment(id, text, author) {
    await delay()
    const issues = getDB('bn_issues', [])
    const idx = issues.findIndex(i => i.id === id)
    if (idx === -1) throw new Error('Issue not found')
    const comment = { author, time: 'Just now', text }
    issues[idx].comments.push(comment)
    setDB('bn_issues', issues)
    addActivity(author, `commented on ${id}`, '#6c63ff')
    return issues[idx]
  }
}

// ── ACTIVITY ────────────────────────────────────────────
export function addActivity(user, action, color = '#6c63ff') {
  const feed = getDB('bn_activity', [])
  feed.unshift({ user, action, time: 'Just now', color })
  setDB('bn_activity', feed.slice(0, 50))
}

export const activityApi = {
  async getAll() {
    await delay(100)
    return getDB('bn_activity', [])
  }
}

// ── PROJECTS ────────────────────────────────────────────
const SEED_PROJECTS = [
  { id:'PRJ-001', name:'E-Commerce Platform',  url:'https://shop.example.com',  description:'Main storefront with cart, checkout and product catalog.', stack:['Vue','Node.js','PostgreSQL'], color:'#6c63ff', owner:'Alex Dev', created:'2025-04-01', status:'active' },
  { id:'PRJ-002', name:'Mobile App',           url:'https://app.example.com',   description:'React Native app for on-the-go customers.',                stack:['React Native','Firebase'],  color:'#18a979', owner:'Jamie Chen', created:'2025-04-15', status:'active' },
  { id:'PRJ-003', name:'Admin Dashboard',      url:'https://admin.example.com', description:'Internal ops tool for orders, users and analytics.',         stack:['React','Express','MySQL'], color:'#e07b39', owner:'Sam Rivera', created:'2025-05-01', status:'active' },
]

function initProjectsDB() {
  if (!localStorage.getItem('bn_projects')) setDB('bn_projects', SEED_PROJECTS)
}
initProjectsDB()

export const projectsApi = {
  async getAll() {
    await delay()
    const projects = getDB('bn_projects', [])
    const issues   = getDB('bn_issues', [])
    return projects.map(p => ({
      ...p,
      issueCount: issues.filter(i => i.projectId === p.id).length,
      openCount:  issues.filter(i => i.projectId === p.id && i.status === 'open').length,
    }))
  },

  async create(data, author) {
    await delay()
    const projects = getDB('bn_projects', [])
    const num = String(projects.length + 1).padStart(3,'0')
    const project = {
      id: `PRJ-${num}`,
      name: data.name, url: data.url||'', description: data.description||'',
      stack: data.stack||[], color: data.color||'#6c63ff',
      owner: author, created: new Date().toISOString().slice(0,10), status:'active',
    }
    projects.unshift(project)
    setDB('bn_projects', projects)
    addActivity(author, `created project "${project.name}"`, project.color)
    return { ...project, issueCount:0, openCount:0 }
  },

  async update(id, data, author) {
    await delay()
    const projects = getDB('bn_projects', [])
    const idx = projects.findIndex(p => p.id === id)
    if (idx===-1) throw new Error('Project not found')
    projects[idx] = { ...projects[idx], ...data }
    setDB('bn_projects', projects)
    addActivity(author, `updated project "${projects[idx].name}"`, projects[idx].color)
    return projects[idx]
  },

  async delete(id, author) {
    await delay()
    const projects = getDB('bn_projects', [])
    const p = projects.find(p => p.id === id)
    setDB('bn_projects', projects.filter(p => p.id !== id))
    if (p) addActivity(author, `deleted project "${p.name}"`, '#e5484d')
    return true
  },

  async getIssues(projectId) {
    await delay(100)
    return getDB('bn_issues', []).filter(i => i.projectId === projectId)
  },
}

// ── TEAM ────────────────────────────────────────────────
export const teamApi = {
  async getMembers() {
    await delay()
    return [
      { name: 'Alex Dev', role: 'Senior Developer', open: 3, resolved: 24 },
      { name: 'Jamie Chen', role: 'QA Engineer', open: 2, resolved: 31 },
      { name: 'Sam Rivera', role: 'Backend Developer', open: 1, resolved: 18 },
      { name: 'Jordan Kim', role: 'DevOps Engineer', open: 2, resolved: 12 },
      { name: 'Taylor Smith', role: 'Frontend Developer', open: 0, resolved: 9 },
      { name: 'Morgan Lee', role: 'Product Manager', open: 1, resolved: 6 },
    ]
  }
}
