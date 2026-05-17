<template>
  <tr @click="$emit('click')" style="cursor:pointer">
    <td><span class="issue-id">#{{ issue.id }}</span></td>
    <td>
      <div class="title-cell">
        <span class="issue-title">{{ issue.title }}</span>
        <span v-if="project" class="pj-pill" :style="{background:project.color+'18', color:project.color, borderColor:project.color+'44'}">
          {{ project.name }}
        </span>
      </div>
    </td>
    <td><span :class="'status status-'+statusClass">{{ issue.status }}</span></td>
    <td><span :class="'priority prio-'+issue.priority.toLowerCase()">{{ issue.priority }}</span></td>
    <td>{{ issue.assignee }}</td>
    <td><span v-for="t in issue.tags" :key="t" class="tag">{{ t }}</span></td>
    <td><span class="issue-date">{{ issue.created }}</span></td>
    <td @click.stop>
      <button class="btn btn-ghost del-btn" @click="$emit('delete')">🗑</button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectsStore } from '../stores/projects'
const props = defineProps({ issue: Object })
defineEmits(['click','delete'])
const statusClass = computed(() => props.issue.status.replace(' ','-').toLowerCase())
const ps = useProjectsStore()
const project = computed(() => props.issue.projectId ? ps.getById(props.issue.projectId) : null)
</script>

<style scoped>
.issue-id   { font-family:'JetBrains Mono',monospace; color:var(--text3); font-size:.78rem; }
.issue-title{ font-weight:500; }
.issue-date { font-size:.8rem; color:var(--text3); font-family:'JetBrains Mono',monospace; }
.del-btn    { padding:5px 10px; font-size:.78rem; }
.title-cell { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.pj-pill    { display:inline-block; padding:2px 9px; border-radius:20px; font-size:.67rem; font-weight:700; border:1px solid; }
</style>
