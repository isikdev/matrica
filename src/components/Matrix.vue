<template>
  <div class="matrix">
    <div v-if="store.loading" class="loading">
      <div class="loader">❄️</div>
      <span>Загрузка задач...</span>
    </div>

    <div v-else-if="store.error" class="error-message">
      {{ store.error }}
    </div>

    <div v-else class="matrix-grid">
      <!-- Важное и срочное -->
      <div class="matrix-quadrant urgent-important">
        <div class="quadrant-header">
          <span class="icon">🎯</span>
          <h3>Важное и срочное</h3>
        </div>
        <TaskList :tasks="store.getTasksByCategory('urgent-important')" category="urgent-important"
          placeholder="Добавить важную и срочную задачу..." @add-task="handleAddTask" @update-task="handleUpdateTask"
          @delete-task="handleDeleteTask" />
      </div>

      <!-- Важное, но не срочное -->
      <div class="matrix-quadrant not-urgent-important">
        <div class="quadrant-header">
          <span class="icon">🎄</span>
          <h3>Важное, но не срочное</h3>
        </div>
        <TaskList :tasks="store.getTasksByCategory('not-urgent-important')" category="not-urgent-important"
          placeholder="Добавить важную задачу..." @add-task="handleAddTask" @update-task="handleUpdateTask"
          @delete-task="handleDeleteTask" />
      </div>

      <!-- Срочное, но не важное -->
      <div class="matrix-quadrant urgent-not-important">
        <div class="quadrant-header">
          <span class="icon">⭐</span>
          <h3>Срочное, но не важное</h3>
        </div>
        <TaskList :tasks="store.getTasksByCategory('urgent-not-important')" category="urgent-not-important"
          placeholder="Добавить срочную задачу..." @add-task="handleAddTask" @update-task="handleUpdateTask"
          @delete-task="handleDeleteTask" />
      </div>

      <!-- Не важное и не срочное -->
      <div class="matrix-quadrant not-urgent-not-important">
        <div class="quadrant-header">
          <span class="icon">🎁</span>
          <h3>Не важное и не срочное</h3>
        </div>
        <TaskList :tasks="store.getTasksByCategory('not-urgent-not-important')" category="not-urgent-not-important"
          placeholder="Добавить задачу..." @add-task="handleAddTask" @update-task="handleUpdateTask"
          @delete-task="handleDeleteTask" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.matrix {
  position: relative;
  z-index: 2;
}

.matrix-grid {
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.matrix-quadrant {
  border: 2px solid transparent;
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    z-index: -1;
    opacity: 0.1;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.15;
  }

  .quadrant-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;

    .icon {
      font-size: 1.5rem;
      animation: bounce 2s infinite ease;
    }

    h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
      margin: 0;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
  }

  &.urgent-important {
    border-color: var(--holiday-red);

    &::before {
      background: linear-gradient(45deg, var(--holiday-red), transparent);
    }
  }

  &.not-urgent-important {
    border-color: var(--holiday-green);

    &::before {
      background: linear-gradient(45deg, var(--holiday-green), transparent);
    }
  }

  &.urgent-not-important {
    border-color: var(--holiday-gold);

    &::before {
      background: linear-gradient(45deg, var(--holiday-gold), transparent);
    }
  }

  &.not-urgent-not-important {
    border-color: var(--holiday-blue);

    &::before {
      background: linear-gradient(45deg, var(--holiday-blue), transparent);
    }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    .quadrant-header .icon {
      animation: spin 1s infinite linear;
    }
  }
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-primary);

  .loader {
    font-size: 2rem;
    animation: spin 2s infinite linear;
  }
}

.error-message {
  color: var(--danger-color);
  text-align: center;
  padding: 1rem;
  border: 2px solid var(--danger-color);
  border-radius: 10px;
  margin: 1rem 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* Медиа-запросы для мо��ильных устройств */
@media (max-width: 768px) {
  .matrix-quadrant {
    padding: 1rem;

    .quadrant-header {
      .icon {
        font-size: 1.25rem;
      }

      h3 {
        font-size: 1rem;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import TaskList from './TaskList.vue'
import { useTaskStore } from '../stores/tasks'

const store = useTaskStore()

const handleAddTask = async (taskData: { title: string; category: string }) => {
  await store.addTask(taskData)
}

const handleUpdateTask = async (taskId: string, updates: any) => {
  await store.updateTask(taskId, updates)
}

const handleDeleteTask = async (taskId: string) => {
  await store.deleteTask(taskId)
}

onMounted(async () => {
  await store.fetchTasks()
})
</script>