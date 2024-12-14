<template>
    <div class="task-list">
        <div class="task-input">
            <input v-model="newTaskTitle" type="text" :placeholder="placeholder" @keyup.enter="handleAddTask">
            <button @click="handleAddTask" class="add-btn">
                <span class="btn-icon">✨</span>
                Добавить
            </button>
        </div>

        <TransitionGroup name="task-list" tag="div" class="tasks-container">
            <div v-for="task in tasks" :key="task._id" class="task-item" :class="{ 'completed': task.completed }">
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" :checked="task.completed"
                        @change="$emit('update-task', task._id, { completed: !task.completed })">
                    <span v-if="!editingTask || editingTask._id !== task._id" class="task-title"
                        @dblclick="startEditing(task)">
                        {{ task.title }}
                    </span>
                    <input v-else v-model="editedTitle" type="text" class="edit-input" @blur="finishEditing"
                        @keyup.enter="finishEditing" @keyup.esc="cancelEditing" ref="editInput">
                </div>

                <button @click="$emit('delete-task', task._id)" class="delete-btn" title="Удалить задачу">
                    ❌
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style lang="scss" scoped>
.task-list {
    .task-input {
        margin-bottom: 1rem;
        display: flex;
        gap: 0.5rem;

        input {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: all 0.3s ease;

            &::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            &:focus {
                outline: none;
                border-color: var(--holiday-gold);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
            }
        }

        .add-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            border: none;
            border-radius: 10px;
            background: linear-gradient(45deg, var(--holiday-gold), var(--accent-color));
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;

            .btn-icon {
                font-size: 1.1rem;
            }

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    .tasks-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateX(5px);

            .delete-btn {
                opacity: 1;
            }
        }

        &.completed {
            opacity: 0.7;

            .task-title {
                text-decoration: line-through;
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .task-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }

        .task-checkbox {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid var(--holiday-gold);
            appearance: none;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;

            &:checked {
                background: var(--holiday-gold);

                &::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                }
            }

            &:hover {
                box-shadow: 0 0 10px var(--holiday-gold);
            }
        }

        .task-title {
            color: var(--text-primary);
            font-size: 0.95rem;
            user-select: none;
        }

        .edit-input {
            flex: 1;
            padding: 0.25rem 0.5rem;
            border: none;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            font-size: 0.95rem;

            &:focus {
                outline: none;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
            }
        }

        .delete-btn {
            opacity: 0;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.25rem;
            transition: all 0.3s ease;
            color: var(--danger-color);

            &:hover {
                transform: scale(1.2);
            }
        }
    }
}

// Анимации для списка задач
.task-list-enter-active,
.task-list-leave-active {
    transition: all 0.3s ease;
}

.task-list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.task-list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.task-list-move {
    transition: transform 0.3s ease;
}

@media (max-width: 768px) {
    .task-list {
        .task-input {
            flex-direction: column;

            input {
                padding: 0.6rem;
            }

            .add-btn {
                padding: 0.6rem;
            }
        }

        .task-item {
            padding: 0.6rem;
            font-size: 0.9rem;

            .task-checkbox {
                width: 16px;
                height: 16px;
            }
        }
    }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    tasks: any[]
    placeholder: string
    category: string
}>()

const emit = defineEmits(['add-task', 'update-task', 'delete-task'])

const newTaskTitle = ref('')
const editingTask = ref<Task | null>(null)
const editedTitle = ref('')
const editInput = ref<HTMLInputElement | null>(null)

interface Task {
    _id: string
    title: string
    category: string
    completed: boolean
}

const handleAddTask = () => {
    if (newTaskTitle.value.trim()) {
        emit('add-task', {
            title: newTaskTitle.value.trim(),
            category: props.category
        })
        newTaskTitle.value = ''
    }
}

const startEditing = (task: Task) => {
    editingTask.value = task
    editedTitle.value = task.title
    setTimeout(() => {
        editInput.value?.focus()
    })
}

const finishEditing = () => {
    if (editingTask.value && editedTitle.value.trim() !== editingTask.value.title) {
        emit('update-task', editingTask.value._id, { title: editedTitle.value.trim() })
    }
    editingTask.value = null
}

const cancelEditing = () => {
    editingTask.value = null
}
</script>
