<template>
  <div class="completed-tasks">
    <div 
      v-for="task in tasks" 
      :key="task.id" 
      class="completed-task-item"
    >
      <span class="task-title">{{ task.title }}</span>
      <span class="task-date">{{ formatDate(task.createdAt) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tasks: any[]
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU')
}
</script>

<style lang="scss" scoped>
.completed-tasks {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
}

.completed-task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  text-decoration: line-through;
  opacity: 0.7;

  .task-date {
    font-size: 0.8rem;
    color: var(--text-primary);
    opacity: 0.6;
  }
}
</style> 