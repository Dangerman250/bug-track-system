<template>
  <div class="landing">

    <!-- ── Animated background ── -->
    <div class="landing-bg">
      <div class="bg-blob blob1"></div>
      <div class="bg-blob blob2"></div>
      <div class="bg-blob blob3"></div>
      <div class="bg-blob blob4"></div>
      <div class="bg-grid"></div>
      <!-- Floating particles -->
      <div class="particle" v-for="p in particles" :key="p.id"
        :style="{ left: p.x + '%', top: p.y + '%', width: p.size + 'px', height: p.size + 'px', animationDelay: p.delay + 's', animationDuration: p.dur + 's' }">
      </div>
    </div>

    <!-- ── Nav ── -->
    <nav class="landing-nav" :class="{ scrolled: scrolled }">
      <div class="logo" :class="{ 'logo-in': mounted }">
        <div class="logo-mark">🐛</div>
        bugnest
      </div>
      <div class="nav-links" :class="{ 'nav-in': mounted }">
        <a href="#">features</a>
        <a href="#">docs</a>
        <button class="btn btn-outline" @click="openAuth('login')">sign in</button>
        <button class="btn btn-primary" @click="openAuth('register')">get started →</button>
      </div>
    </nav>

    <!-- ── Hero ── -->
    <section class="landing-hero">
      <!-- Badge -->
      <div class="badge" :class="{ 'anim-in': mounted }" style="--delay:0.1s">
        <span class="badge-dot"></span>
        v2.0 — now with ai triage
        <span class="badge-arrow">→</span>
      </div>

      <!-- Title with word-by-word reveal -->
      <h1 class="hero-title">
        <span class="word" :class="{ 'word-in': mounted }" style="--delay:0.25s">squash</span>
        <span class="word" :class="{ 'word-in': mounted }" style="--delay:0.35s">bugs.</span>
        <br />
        <span class="word" :class="{ 'word-in': mounted }" style="--delay:0.48s">ship</span>
        <span class="word gradient-text typed-wrap" :class="{ 'word-in': mounted }" style="--delay:0.58s">
          <span class="typed">{{ typedText }}</span><span class="cursor">|</span>
        </span>
      </h1>

      <p class="hero-sub" :class="{ 'anim-in': mounted }" style="--delay:0.72s">
        bugnest gives your team one place to report, track, and resolve every
        software issue — from critical crashes to minor ux polish.
      </p>

      <!-- Buttons -->
      <div class="hero-btns" :class="{ 'anim-in': mounted }" style="--delay:0.85s">
        <button class="btn btn-primary hero-btn ripple-btn" @click="openAuth('register')" @mousedown="ripple">
          start for free →
        </button>
        <button class="btn btn-outline hero-btn" @click="handleDemo">
          ▶ live demo
        </button>
      </div>

      <!-- Social proof row -->
      <div class="proof-row" :class="{ 'anim-in': mounted }" style="--delay:0.95s">
        <div class="proof-avatars">
          <div class="proof-avatar" v-for="a in proofAvatars" :key="a" :style="{ background: a }"></div>
        </div>
        <span class="proof-text"><strong>2,400+</strong> teams joined this month</span>
        <div class="proof-stars">★★★★★</div>
      </div>

      <!-- ── Dashboard Mockup ── -->
      <div class="hero-visual" :class="{ 'visual-in': mounted }" style="--delay:1.05s">

        <!-- Glow behind card -->
        <div class="card-glow"></div>

        <div class="mockup-card">
          <div class="mockup-header">
            <div class="mockup-dots"><span></span><span></span><span></span></div>
            <div class="mockup-url">app.bugnest.io/dashboard</div>
            <div class="mockup-controls">
              <span></span><span></span>
            </div>
          </div>

          <div class="mockup-body">
            <!-- Stat row -->
            <div class="mockup-stats">
              <div class="m-stat" v-for="s in mockStats" :key="s.label"
                :class="{ 'mstat-in': statsVisible }"
                :style="{ '--c': s.color, '--cbg': s.bg, '--delay': s.delay }">
                <div class="m-stat-n">{{ s.n }}</div>
                <div class="m-stat-l">{{ s.label }}</div>
                <div class="m-stat-bar">
                  <div class="m-stat-fill" :style="{ width: s.pct + '%', background: s.color }"></div>
                </div>
              </div>
            </div>

            <!-- Chart + Issues side by side -->
            <div class="mockup-middle">
              <!-- Bar chart -->
              <div class="m-chart">
                <div class="m-chart-label">issues this week</div>
                <div class="m-bars">
                  <div class="m-bar-col" v-for="(b, i) in chartBars" :key="i">
                    <div class="m-bar" :class="{ 'mbar-in': barsVisible }"
                      :style="{ height: b.h + '%', background: b.active ? 'var(--accent)' : '#e3e7f0', '--delay': i * 0.06 + 's' }">
                    </div>
                    <div class="m-bar-lbl">{{ b.d }}</div>
                  </div>
                </div>
              </div>

              <!-- Mini issue list -->
              <div class="m-issues">
                <div class="m-issues-label">recent bugs</div>
                <div class="m-issue" v-for="(iss, i) in mockIssues" :key="i"
                  :class="{ 'missue-in': issuesVisible }"
                  :style="{ '--delay': i * 0.1 + 's' }">
                  <div class="m-issue-dot" :style="{ background: iss.color }"></div>
                  <div class="m-issue-text">{{ iss.title }}</div>
                  <div class="m-issue-badge" :style="{ background: iss.color + '22', color: iss.color }">{{ iss.status }}</div>
                </div>
              </div>
            </div>

            <!-- Activity bar -->
            <div class="m-activity">
              <div class="m-activity-label">team activity</div>
              <div class="m-activity-dots">
                <div class="m-act-dot" v-for="(a, i) in activityDots" :key="i"
                  :style="{ background: a, animationDelay: i * 0.15 + 's' }">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating notification cards -->
        <div class="float-card float-top-right" :class="{ 'float-in': mounted }" style="--delay:1.4s">
          <div class="float-icon float-icon--green">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M4 7l2.2 2.2L10 4.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div class="float-title">bug resolved</div>
            <div class="float-sub">auth token fix deployed</div>
          </div>
        </div>

        <div class="float-card float-bottom-left" :class="{ 'float-in': mounted }" style="--delay:1.6s">
          <div class="float-icon float-icon--indigo">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1M3.1 3.1l.7.7M10.2 10.2l.7.7M3.1 10.9l.7-.7M10.2 3.8l.7-.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </div>
          <div>
            <div class="float-title">ai triage active</div>
            <div class="float-sub">8 bugs auto-prioritised</div>
          </div>
        </div>

        <div class="float-card float-bottom-right" :class="{ 'float-in': mounted }" style="--delay:1.8s">
          <div class="float-icon float-icon--amber">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5A4 4 0 003 5.5v2.5L2 9.5h10l-1-1.5V5.5A4 4 0 007 1.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 9.5a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.3"/></svg>
          </div>
          <div>
            <div class="float-title">3 new reports</div>
            <div class="float-sub">just now</div>
          </div>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="hero-stats" :class="{ 'anim-in': mounted }" style="--delay:1.1s">
        <div class="stat" v-for="s in heroStats" :key="s.n">
          <div class="stat-n">{{ s.displayed }}</div>
          <div class="stat-l">{{ s.l }}</div>
        </div>
      </div>
    </section>

    <!-- ── Features ── -->
    <section class="features-section" ref="featuresEl">
      <div class="section-label">features</div>
      <h2 class="section-title">everything your team needs</h2>
      <div class="features-grid">
        <div class="feat-card" v-for="(f, i) in features" :key="f.title"
          :class="{ 'feat-in': featVisible }"
          :style="{ '--delay': i * 0.08 + 's' }">
          <div class="feat-icon-wrap">
            <!-- chart -->
            <svg v-if="f.iconKey === 'chart'" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="10" width="4" height="8" rx="1.5" fill="currentColor" opacity=".3"/><rect x="8" y="6" width="4" height="12" rx="1.5" fill="currentColor" opacity=".6"/><rect x="14" y="2" width="4" height="16" rx="1.5" fill="currentColor"/></svg>
            <!-- filter -->
            <svg v-if="f.iconKey === 'filter'" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <!-- comment -->
            <svg v-if="f.iconKey === 'comment'" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H7l-3 3V5a1 1 0 011-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
            <!-- lock -->
            <svg v-if="f.iconKey === 'lock'" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            <!-- rocket -->
            <svg v-if="f.iconKey === 'rocket'" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C6 2 4 7 4 10l2 2c.5-3 2-6 4-7 2 1 3.5 4 4 7l2-2c0-3-2-8-6-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 12l1 6h4l1-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <!-- ai -->
            <svg v-if="f.iconKey === 'ai'" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.1 5.1l1.4 1.4M13.5 13.5l1.4 1.4M5.1 14.9l1.4-1.4M13.5 6.5l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="feat-title">{{ f.title }}</div>
          <div class="feat-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ── Auth Modal ── -->
    <AppModal v-model="showAuth" :title="authTab === 'login' ? 'welcome back' : 'create account'">
      <div class="tab-row">
        <button :class="['tab-btn', { active: authTab === 'login' }]" @click="authTab = 'login'">sign in</button>
        <button :class="['tab-btn', { active: authTab === 'register' }]" @click="authTab = 'register'">register</button>
      </div>
      <template v-if="authTab === 'register'">
        <div class="form-row">
          <div class="form-group"><label>first name</label><input type="text" v-model="form.firstName" placeholder="alex" /></div>
          <div class="form-group"><label>last name</label><input type="text" v-model="form.lastName" placeholder="johnson" /></div>
        </div>
        <div class="form-group">
          <label>role</label>
          <select v-model="form.role">
            <option>developer</option><option>tester</option><option>admin</option><option>manager</option>
          </select>
        </div>
      </template>
      <div class="form-group"><label>email</label><input type="email" v-model="form.email" placeholder="you@company.com" /></div>
      <div class="form-group"><label>password</label><input type="password" v-model="form.password" placeholder="••••••••" /></div>
      <div v-if="authTab === 'register'" class="form-group">
        <label>confirm password</label><input type="password" v-model="form.confirmPassword" placeholder="••••••••" />
      </div>
      <button class="btn btn-primary submit-btn" :disabled="auth.loading" @click="handleAuth">
        {{ auth.loading ? 'please wait…' : authTab === 'login' ? 'sign in →' : 'create account →' }}
      </button>
      <div v-if="localError" class="form-error">{{ localError }}</div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import AppModal from '../components/ui/AppModal.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const showAuth = ref(false)
const authTab = ref('login')
const localError = ref('')
const mounted = ref(false)
const scrolled = ref(false)
const statsVisible = ref(false)
const barsVisible = ref(false)
const issuesVisible = ref(false)
const featVisible = ref(false)
const featuresEl = ref(null)
const form = reactive({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'developer' })

// Typewriter
const words = ['faster.', 'better.', 'smarter.', 'together.']
const typedText = ref('')
let wordIdx = 0, charIdx = 0, deleting = false, typeTimer = null

function typeNext() {
  const word = words[wordIdx]
  if (!deleting) {
    typedText.value = word.slice(0, ++charIdx)
    if (charIdx === word.length) { deleting = true; typeTimer = setTimeout(typeNext, 1800); return }
  } else {
    typedText.value = word.slice(0, --charIdx)
    if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length }
  }
  typeTimer = setTimeout(typeNext, deleting ? 60 : 90)
}

// Particles
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 8,
  dur: 6 + Math.random() * 8,
}))

const proofAvatars = ['#3f4452', '#18a979', '#e5484d', '#e07b39', '#6b7280']

const mockStats = [
  { n: '24', label: 'open', color: '#e5484d', bg: '#ffefef', pct: 24, delay: '0.1s' },
  { n: '11', label: 'in progress', color: '#e07b39', bg: '#fef3eb', pct: 45, delay: '0.2s' },
  { n: '142', label: 'resolved', color: '#18a979', bg: '#e6f9f3', pct: 88, delay: '0.3s' },
]

const chartBars = [
  { h: 40, d: 'M', active: false }, { h: 65, d: 'T', active: false }, { h: 50, d: 'W', active: false },
  { h: 80, d: 'T', active: false }, { h: 60, d: 'F', active: false }, { h: 75, d: 'S', active: false },
  { h: 90, d: 'S', active: true },
]

const mockIssues = [
  { title: 'auth token expiry crash', status: 'critical', color: '#e5484d' },
  { title: 'slow dashboard query', status: 'in progress', color: '#e07b39' },
  { title: 'missing null check', status: 'resolved', color: '#18a979' },
]

const activityDots = [
  '#3f4452','#18a979','#e5484d','#3f4452','#e07b39','#6b7280',
  '#3f4452','#18a979','#e5484d','#3f4452','#e07b39','#6b7280',
  '#3f4452','#18a979','#e5484d','#3f4452','#e07b39','#6b7280',
  '#3f4452','#18a979','#e5484d','#3f4452','#e07b39','#6b7280',
]

const heroStats = reactive([
  { n: '14k+', target: 14000, suffix: 'k+', displayed: '0k+', l: 'teams' },
  { n: '2.4M', target: 2400, suffix: 'M', displayed: '0M', l: 'bugs tracked' },
  { n: '98.7%', target: 98.7, suffix: '%', displayed: '0%', l: 'uptime' },
  { n: '4.9★', target: 4.9, suffix: '★', displayed: '0★', l: 'rating' },
])

function animateCounters() {
  heroStats.forEach((s, i) => {
    const duration = 1400
    const start = performance.now()
    const isDecimal = !Number.isInteger(s.target)
    function step(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = s.target * ease
      if (i === 0) s.displayed = Math.round(current / 1000) + 'k+'
      else if (i === 1) s.displayed = (current / 1000).toFixed(1) + 'M'
      else if (i === 2) s.displayed = current.toFixed(1) + '%'
      else s.displayed = current.toFixed(1) + '★'
      if (progress < 1) requestAnimationFrame(step)
      else s.displayed = s.n
    }
    setTimeout(() => requestAnimationFrame(step), i * 120)
  })
}

const features = [
  { iconKey: 'chart',   title: 'smart dashboard', desc: 'real-time metrics and team activity at a glance.' },
  { iconKey: 'filter',  title: 'powerful filters', desc: 'filter by status, priority, assignee and more.' },
  { iconKey: 'comment', title: 'threaded comments', desc: 'discuss each bug in context with full history.' },
  { iconKey: 'lock',    title: 'role-based auth', desc: 'admins, developers, testers with the right access.' },
  { iconKey: 'rocket',  title: 'one-click deploy', desc: 'push to github and deploy with ci integration.' },
  { iconKey: 'ai',      title: 'ai triage', desc: 'automatic priority scoring powered by ai.' },
]

function openAuth(tab) { authTab.value = tab; showAuth.value = true; localError.value = '' }

async function handleAuth() {
  localError.value = ''
  if (authTab.value === 'login') {
    if (!form.email || !form.password) { localError.value = 'please fill all fields.'; return }
    const ok = await auth.login(form.email, form.password)
    if (ok) { toast.success('welcome back! 👋'); router.push('/app/dashboard') }
    else localError.value = auth.error
  } else {
    if (!form.firstName || !form.email || !form.password) { localError.value = 'please fill all fields.'; return }
    if (form.password !== form.confirmPassword) { localError.value = 'passwords do not match.'; return }
    const ok = await auth.register(form)
    if (ok) { toast.success('account created! welcome 🎉'); router.push('/app/dashboard') }
    else localError.value = auth.error
  }
}

async function handleDemo() {
  await auth.loginDemo()
  toast.info('demo mode active')
  router.push('/app/dashboard')
}

function ripple(e) {
  const btn = e.currentTarget
  const circle = document.createElement('span')
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  circle.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`
  circle.classList.add('ripple-circle')
  btn.appendChild(circle)
  setTimeout(() => circle.remove(), 700)
}

function onScroll() { scrolled.value = window.scrollY > 20 }

let featObs
onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    setTimeout(() => { statsVisible.value = true; animateCounters() }, 400)
    setTimeout(() => { barsVisible.value = true }, 600)
    setTimeout(() => { issuesVisible.value = true }, 800)
    typeTimer = setTimeout(typeNext, 1200)
  }, 80)
  window.addEventListener('scroll', onScroll)

  // Observe features section
  featObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { featVisible.value = true; featObs.disconnect() }
  }, { threshold: 0.15 })
  if (featuresEl.value) featObs.observe(featuresEl.value)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(typeTimer)
  featObs?.disconnect()
})
</script>

<style scoped>
/* ─── Base ─── */
.landing {
  min-height: 100vh; display: flex; flex-direction: column;
  background: #fafbff; position: relative; overflow-x: hidden;
}

/* ─── Background ─── */
.landing-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

.bg-blob {
  position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.13;
}
.blob1 { width: 600px; height: 600px; background: #3f4452; top: -180px; left: -100px; animation: drift1 14s ease-in-out infinite; }
.blob2 { width: 500px; height: 500px; background: #e5484d; bottom: -120px; right: -80px; animation: drift2 18s ease-in-out infinite; }
.blob3 { width: 380px; height: 380px; background: #18a979; top: 40%; left: 60%; animation: drift3 12s ease-in-out infinite; }
.blob4 { width: 280px; height: 280px; background: #6b7280; top: 20%; right: 10%; animation: drift4 16s ease-in-out infinite; }

@keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.06)} 66%{transform:translate(-20px,20px) scale(0.95)} }
@keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-30px,25px) scale(1.04)} 70%{transform:translate(20px,-15px) scale(0.97)} }
@keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,-30px) scale(1.08)} }
@keyframes drift4 { 0%,100%{transform:translate(0,0)} 60%{transform:translate(20px,30px) scale(1.05)} }

.bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(91,91,214,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(91,91,214,0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 60%, transparent 100%);
}

/* Particles */
.particle {
  position: absolute; border-radius: 50%;
  background: var(--accent); opacity: 0.18;
  animation: particleFloat var(--dur, 8s) ease-in-out infinite var(--delay, 0s);
}
@keyframes particleFloat {
  0%,100%{transform:translateY(0px) scale(1); opacity:.18}
  50%{transform:translateY(-30px) scale(1.3); opacity:.06}
}

/* ─── Nav ─── */
.landing-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 60px; transition: all 0.35s ease;
}
.landing-nav.scrolled {
  background: rgba(255,255,255,0.88); backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid rgba(227,231,240,0.8); padding: 14px 60px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
}

.logo {
  font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.4rem;
  letter-spacing: -0.04em; display: flex; align-items: center; gap: 10px; color: #0f1117;
  opacity: 0; transform: translateX(-20px); transition: all 0.6s ease 0.1s;
}
.logo.logo-in { opacity: 1; transform: translateX(0); }
.logo-mark { width: 34px; height: 34px; background: var(--accent); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; }

.nav-links {
  display: flex; gap: 28px; align-items: center;
  opacity: 0; transform: translateX(20px); transition: all 0.6s ease 0.2s;
}
.nav-links.nav-in { opacity: 1; transform: translateX(0); }
.nav-links a { color: var(--text2); text-decoration: none; font-size: 0.85rem; font-weight: 500; transition: color var(--transition); }
.nav-links a:hover { color: var(--text); }

/* ─── Hero ─── */
.landing-hero {
  position: relative; z-index: 10; flex: 1;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 148px 40px 60px;
}

/* Generic animate-in */
.anim-in {
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.7s ease var(--delay, 0s), transform 0.7s ease var(--delay, 0s);
}
.anim-in.anim-in { opacity: 1; transform: translateY(0); }

/* Badge */
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.92); border: 1px solid var(--border);
  padding: 6px 16px; border-radius: 50px; font-size: 0.78rem; font-weight: 600;
  margin-bottom: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); color: var(--text2);
  opacity: 0; transform: translateY(12px) scale(0.96);
  transition: opacity 0.6s ease var(--delay,0s), transform 0.6s ease var(--delay,0s);
}
.badge.anim-in { opacity: 1; transform: translateY(0) scale(1); }
.badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #18a979; animation: pulseDot 2s ease infinite; }
@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
.badge-arrow { margin-left: 2px; color: var(--accent); transition: transform 0.2s ease; }
.badge:hover .badge-arrow { transform: translateX(3px); }

/* Word reveal */
.hero-title { font-family: 'Outfit', sans-serif; font-size: clamp(2.8rem,6vw,4.8rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.04em; margin-bottom: 22px; color: var(--text); }
.word {
  display: inline-block; margin-right: 0.25em;
  opacity: 0; transform: translateY(24px) rotateX(-15deg);
  transition: opacity 0.55s ease var(--delay,0s), transform 0.55s ease var(--delay,0s);
  transform-origin: bottom;
}
.word.word-in { opacity: 1; transform: translateY(0) rotateX(0); }
.gradient-text { background: linear-gradient(135deg, var(--accent) 0%, #6b7280 50%, #9098ad 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% 200%; animation: gradientShift 4s ease infinite; }
@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

/* Typewriter */
.typed-wrap { display: inline-flex; align-items: baseline; gap: 2px; }
.typed { display: inline-block; }
.cursor {
  display: inline-block; color: var(--accent);
  animation: blink 1s step-end infinite;
  font-weight: 300;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

.hero-sub {
  font-size: 1rem; color: var(--text2); max-width: 500px; line-height: 1.75;
  margin-bottom: 36px;
  opacity: 0; transform: translateY(14px);
  transition: opacity 0.7s ease var(--delay,0s), transform 0.7s ease var(--delay,0s);
}
.hero-sub.anim-in { opacity: 1; transform: translateY(0); }

.hero-btns {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px;
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.7s ease var(--delay,0s), transform 0.7s ease var(--delay,0s);
}
.hero-btns.anim-in { opacity: 1; transform: translateY(0); }
.hero-btn { font-size: 0.95rem; padding: 12px 28px; }

/* Ripple */
.ripple-btn { overflow: hidden; position: relative; }
.ripple-circle {
  position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4);
  transform: scale(0); animation: rippleAnim 0.7s ease-out forwards; pointer-events: none;
}
@keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }

/* Social proof */
.proof-row {
  display: flex; align-items: center; gap: 12px; margin-bottom: 52px; flex-wrap: wrap; justify-content: center;
  opacity: 0; transform: translateY(10px);
  transition: opacity 0.7s ease var(--delay,0s), transform 0.7s ease var(--delay,0s);
}
.proof-row.anim-in { opacity: 1; transform: translateY(0); }
.proof-avatars { display: flex; }
.proof-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; margin-left: -8px; }
.proof-avatars .proof-avatar:first-child { margin-left: 0; }
.proof-text { font-size: 0.82rem; color: var(--text2); }
.proof-text strong { color: var(--text); }
.proof-stars { color: #f7b731; font-size: 0.82rem; letter-spacing: 1px; }

/* ─── Hero Visual ─── */
.hero-visual {
  position: relative; width: 100%; max-width: 700px; margin-bottom: 56px;
  opacity: 0; transform: translateY(36px) scale(0.96);
  transition: opacity 0.9s ease var(--delay,0s), transform 0.9s cubic-bezier(0.22,1,0.36,1) var(--delay,0s);
}
.hero-visual.visual-in { opacity: 1; transform: translateY(0) scale(1); }

.card-glow {
  position: absolute; inset: -30px; border-radius: 30px;
  background: radial-gradient(ellipse at 50% 40%, rgba(91,91,214,0.12) 0%, transparent 70%);
  filter: blur(20px); z-index: 0;
  animation: glowPulse 4s ease-in-out infinite;
}
@keyframes glowPulse { 0%,100%{opacity:0.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }

.mockup-card {
  position: relative; z-index: 1;
  background: #fff; border: 1px solid #e3e7f0; border-radius: 16px; overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.10), 0 4px 16px rgba(91,91,214,0.08), 0 1px 2px rgba(0,0,0,0.05);
  animation: cardFloat 7s ease-in-out infinite;
}
@keyframes cardFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }

.mockup-header {
  background: #f7f8fc; border-bottom: 1px solid #e3e7f0;
  padding: 11px 16px; display: flex; align-items: center; gap: 10px;
}
.mockup-dots { display: flex; gap: 6px; }
.mockup-dots span { width: 10px; height: 10px; border-radius: 50%; }
.mockup-dots span:nth-child(1) { background: #ff5f57; }
.mockup-dots span:nth-child(2) { background: #febc2e; }
.mockup-dots span:nth-child(3) { background: #28c840; }
.mockup-url { flex: 1; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #9ba3b8; }
.mockup-controls { display: flex; gap: 6px; }
.mockup-controls span { width: 16px; height: 10px; background: #e3e7f0; border-radius: 3px; }

.mockup-body { padding: 16px; }

/* Mockup stats */
.mockup-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
.m-stat {
  background: var(--cbg, #f7f8fc); border-radius: 8px; padding: 12px;
  border: 1px solid transparent;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.5s ease var(--delay,0s), transform 0.5s ease var(--delay,0s);
}
.m-stat.mstat-in { opacity: 1; transform: translateY(0); border-color: var(--c, transparent); }
.m-stat-n { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.3rem; color: var(--c, #333); letter-spacing: -0.02em; }
.m-stat-l { font-size: 0.68rem; color: #9ba3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1px; }
.m-stat-bar { height: 3px; background: #f0f0f0; border-radius: 2px; margin-top: 8px; overflow: hidden; }
.m-stat-fill { height: 100%; border-radius: 2px; transition: width 1s ease 0.8s; width: 0; }
.m-stat.mstat-in .m-stat-fill { width: inherit; }

/* Chart */
.mockup-middle { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.m-chart { background: #f7f8fc; border: 1px solid #e3e7f0; border-radius: 8px; padding: 10px; }
.m-chart-label, .m-issues-label { font-size: 0.68rem; color: #9ba3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; }
.m-bars { display: flex; align-items: flex-end; gap: 4px; height: 60px; }
.m-bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 3px; height: 100%; justify-content: flex-end; }
.m-bar {
  width: 100%; border-radius: 3px 3px 0 0;
  transform: scaleY(0); transform-origin: bottom;
  transition: transform 0.5s cubic-bezier(0.22,1,0.36,1) var(--delay,0s);
}
.m-bar.mbar-in { transform: scaleY(1); }
.m-bar-lbl { font-size: 0.58rem; color: #c0c8d8; font-family: 'JetBrains Mono', monospace; }

/* Issues list */
.m-issues { background: #f7f8fc; border: 1px solid #e3e7f0; border-radius: 8px; padding: 10px; }
.m-issue {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 0; border-bottom: 1px solid #f0f2f8;
  opacity: 0; transform: translateX(-8px);
  transition: opacity 0.4s ease var(--delay,0s), transform 0.4s ease var(--delay,0s);
}
.m-issue:last-child { border-bottom: none; }
.m-issue.missue-in { opacity: 1; transform: translateX(0); }
.m-issue-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.m-issue-text { font-size: 0.7rem; color: #5a6070; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.m-issue-badge { font-size: 0.6rem; font-weight: 600; padding: 2px 7px; border-radius: 50px; white-space: nowrap; }

/* Activity */
.m-activity { background: #f7f8fc; border: 1px solid #e3e7f0; border-radius: 8px; padding: 10px; }
.m-activity-dots { display: flex; gap: 3px; flex-wrap: wrap; }
.m-act-dot {
  width: 8px; height: 8px; border-radius: 2px;
  animation: actPulse 3s ease-in-out infinite;
}
@keyframes actPulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }

/* ─── Floating cards ─── */
.float-card {
  position: absolute; background: white; border: 1px solid #e3e7f0; border-radius: 12px;
  padding: 10px 14px; display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.10); z-index: 10; white-space: nowrap;
  opacity: 0; transform: scale(0.88) translateY(10px);
  transition: opacity 0.6s ease var(--delay,0s), transform 0.6s cubic-bezier(0.22,1,0.36,1) var(--delay,0s);
}
.float-card.float-in { opacity: 1; transform: scale(1) translateY(0); }

.float-top-right  { top: 10%; right: -48px; animation: floatA 5s ease-in-out infinite 2s; }
.float-bottom-left { bottom: 22%; left: -56px; animation: floatB 6s ease-in-out infinite 2.2s; }
.float-bottom-right { bottom: 8%; right: -44px; animation: floatA 4.5s ease-in-out infinite 2.4s; }

@keyframes floatA { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
@keyframes floatB { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(8px)} }

.float-icon {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.float-icon--green  { background: #e6f9f3; color: #18a979; }
.float-icon--indigo { background: #eaebee; color: #3f4452; }
.float-icon--amber  { background: #fef3eb; color: #e07b39; }
.float-title { font-weight: 700; font-size: 0.78rem; color: #0f1117; }
.float-sub { font-size: 0.7rem; color: #9ba3b8; margin-top: 1px; }

/* ─── Hero stats ─── */
.hero-stats {
  display: flex; gap: 48px; flex-wrap: wrap; justify-content: center;
  opacity: 0; transform: translateY(10px);
  transition: opacity 0.7s ease var(--delay,0s), transform 0.7s ease var(--delay,0s);
}
.hero-stats.anim-in { opacity: 1; transform: translateY(0); }
.stat { text-align: center; }
.stat-n { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; }
.stat-l { font-size: 0.76rem; color: var(--text3); margin-top: 2px; }

/* ─── Features ─── */
.features-section {
  position: relative; z-index: 10; padding: 64px 60px 80px;
  background: rgba(255,255,255,0.6); backdrop-filter: blur(8px);
  border-top: 1px solid rgba(227,231,240,0.7); text-align: center;
}
.section-label { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 10px; }
.section-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 2rem; letter-spacing: -0.03em; color: var(--text); margin-bottom: 40px; }

.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px; margin: 0 auto; }

.feat-card {
  background: white; border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 26px 22px; text-align: left; box-shadow: var(--shadow-sm);
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.55s ease var(--delay,0s), transform 0.55s ease var(--delay,0s),
    border-color 0.2s, box-shadow 0.2s;
}
.feat-card.feat-in { opacity: 1; transform: translateY(0); }
.feat-card:hover { border-color: var(--accent); transform: translateY(-4px) !important; box-shadow: 0 10px 32px rgba(91,91,214,0.12); }
.feat-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--accent-light); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px; transition: background 0.2s, color 0.2s;
}
.feat-card:hover .feat-icon-wrap { background: var(--accent); color: #fff; }
.feat-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.9rem; margin-bottom: 7px; color: var(--text); }
.feat-desc { font-size: 0.82rem; color: var(--text2); line-height: 1.65; }

/* ─── Auth modal ─── */
.tab-row { display: flex; margin-bottom: 22px; background: var(--bg); border-radius: 9px; padding: 4px; }
.tab-btn { flex: 1; padding: 9px; background: transparent; border: none; color: var(--text2); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.85rem; transition: all var(--transition); border-radius: 7px; }
.tab-btn.active { background: white; color: var(--accent); box-shadow: var(--shadow-sm); }
.submit-btn { width: 100%; justify-content: center; padding: 12px; font-size: 0.9rem; margin-top: 4px; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.form-error { color: var(--accent2); font-size: 0.82rem; margin-top: 10px; text-align: center; }

@media (max-width: 768px) {
  .landing-nav { padding: 14px 20px; }
  .landing-nav.scrolled { padding: 10px 20px; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .features-section { padding: 40px 20px 60px; }
  .float-top-right, .float-bottom-left, .float-bottom-right { display: none; }
  .mockup-middle { grid-template-columns: 1fr; }
  .hero-stats { gap: 28px; }
}
@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
