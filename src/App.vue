<template>
    <div class="app">
        <!-- Фоновый градиент -->
        <div class="background-gradient"></div>

        <!-- Снег -->
        <div class="snowflakes" aria-hidden="true">
            <div v-for="n in 50" :key="n" class="snowflake">❅</div>
        </div>

        <!-- Гирлянда сверху -->
        <div class="garland">
            <div v-for="n in 20" :key="`light-${n}`" class="light" :class="`color-${n % 4}`">
            </div>
        </div>

        <!-- Боковые гирлянды -->
        <div class="side-garland left">
            <div v-for="n in 10" :key="`left-${n}`" class="light" :class="`color-${n % 4}`">
            </div>
        </div>
        <div class="side-garland right">
            <div v-for="n in 10" :key="`right-${n}`" class="light" :class="`color-${n % 4}`">
            </div>
        </div>

        <!-- Основной контент -->
        <header class="header">
            <div class="holiday-decor">🎄</div>
            <h1>Матрица Эйзенхауэра</h1>
            <div class="holiday-decor">🎄</div>
        </header>

        <main class="main">
            <Matrix />

            <div v-if="completedTasks.length > 0" class="completed-tasks-section">
                <div class="completed-header">
                    <h2>
                        <span class="completed-icon">🏆</span>
                        Выполненные задачи
                    </h2>
                    <button @click="clearCompletedTasks" class="clear-btn">
                        <span class="clear-icon">🧹</span>
                        Очистить
                    </button>
                </div>
                <div class="completed-tasks-list">
                    <div v-for="task in completedTasks" :key="task._id" class="completed-task-item">
                        <div class="task-info">
                            <span class="task-title">{{ task.title }}</span>
                            <span class="task-category" :class="task.category">
                                {{ getCategoryLabel(task.category) }}
                            </span>
                        </div>
                        <span class="completion-date">
                            {{ formatDate(task.completedAt || task.createdAt) }}
                        </span>
                    </div>
                </div>
            </div>
        </main>

        <PWAInstallPrompt />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Matrix from './components/Matrix.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import { useTaskStore } from './stores/tasks'

const store = useTaskStore()

const completedTasks = computed(() => store.getCompletedTasks)

const clearCompletedTasks = async () => {
    if (confirm('Вы уверены, что хотите удалить все выполненные задачи?')) {
        await store.clearCompletedTasks()
    }
}

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        'urgent-important': 'Важное срочное',
        'not-urgent-important': 'Важное несрочное',
        'urgent-not-important': 'Срочное неважное',
        'not-urgent-not-important': 'Неважное несрочное'
    }
    return labels[category] || category
}

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<style lang="scss">
:root {
    --bg-primary: #0f2442;
    --bg-secondary: #1a365d;
    --text-primary: #e3f2fd;
    --accent-color: #5090d3;
    --accent-color-light: #7cb9e8;
    --danger-color: #ff5252;
    --danger-color-hover: #ff1744;
    --success-color: #69f0ae;

    /* Праздничные цвета */
    --holiday-red: #ff5252;
    --holiday-green: #69f0ae;
    --holiday-gold: #ffd700;
    --holiday-blue: #40c4ff;
}

body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg-primary);
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
}

.app {
    position: relative;
    min-height: 100vh;
    padding: 1rem;
}

/* Фоновый градиент с размытием */
.background-gradient {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 20%, rgba(255, 82, 82, 0.15), transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(105, 240, 174, 0.15), transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(64, 196, 255, 0.1), transparent 60%);
    filter: blur(8px);
    z-index: -1;
}

/* Анимированный снег */
.snowflakes {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
}

.snowflake {
    color: white;
    font-size: 1.5em;
    position: absolute;
    top: -20px;
    animation: snowfall linear infinite;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);

    @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
            left: #{random(100)}vw;
            animation-duration: #{random(5) + 5}s;
            animation-delay: -#{random(5)}s;
        }
    }
}

/* Гирлянда */
.garland {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    z-index: 2;
}

.side-garland {
    position: fixed;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    z-index: 2;

    &.left {
        left: 0;
    }

    &.right {
        right: 0;
    }
}

.light {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: glow 1s ease-in-out infinite alternate;

    &.color-0 {
        background: var(--holiday-red);
    }

    &.color-1 {
        background: var(--holiday-green);
    }

    &.color-2 {
        background: var(--holiday-gold);
    }

    &.color-3 {
        background: var(--holiday-blue);
    }
}

/* Заг��ловок */
.header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;

    h1 {
        color: var(--text-primary);
        font-size: 2.5rem;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }
}

.holiday-decor {
    font-size: 2rem;
    animation: bounce 2s ease infinite;
}

/* Анимации */
@keyframes snowfall {
    0% {
        transform: translateY(-20px) rotate(0deg);
    }

    100% {
        transform: translateY(100vh) rotate(360deg);
    }
}

@keyframes glow {
    from {
        box-shadow: 0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor;
    }

    to {
        box-shadow: 0 0 10px currentColor,
            0 0 20px currentColor,
            0 0 30px currentColor;
    }
}

/* Медиа-запросы */
@media (max-width: 768px) {
    .header h1 {
        font-size: 1.8rem;
    }

    .side-garland {
        display: none;
    }

    .light {
        width: 8px;
        height: 8px;
    }
}

/* Дополнительные стили для основного контента */
.main {
    position: relative;
    z-index: 2;
}

.completed-tasks-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.completed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--holiday-gold);
        margin: 0;
        font-size: 1.5rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);

        .completed-icon {
            animation: bounce 2s infinite ease;
        }
    }

    .clear-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.2rem;
        background: linear-gradient(45deg, var(--danger-color), var(--danger-color-hover));
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;

        .clear-icon {
            font-size: 1.1rem;
        }

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 82, 82, 0.3);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.completed-tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 0.5rem;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--holiday-gold);
        border-radius: 3px;
    }
}

.completed-task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateX(5px);
        background: rgba(255, 255, 255, 0.08);
    }

    .task-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .task-title {
        color: var(--text-primary);
        text-decoration: line-through;
        opacity: 0.8;
    }

    .task-category {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.1);

        &.urgent-important {
            color: var(--holiday-red);
        }

        &.not-urgent-important {
            color: var(--holiday-green);
        }

        &.urgent-not-important {
            color: var(--holiday-gold);
        }

        &.not-urgent-not-important {
            color: var(--holiday-blue);
        }
    }

    .completion-date {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
    }
}

@media (max-width: 768px) {
    .completed-tasks-section {
        padding: 1rem;
        margin-top: 1.5rem;
    }

    .completed-header {
        margin-bottom: 1rem;

        h2 {
            font-size: 1.2rem;
        }

        .clear-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }
    }

    .completed-task-item {
        padding: 0.75rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;

        .completion-date {
            align-self: flex-end;
        }
    }
}
</style>
