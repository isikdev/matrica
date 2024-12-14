import { defineStore } from 'pinia'

interface Task {
    _id: string
    title: string
    category: string
    completed: boolean
    createdAt: Date
    completedAt?: Date
}

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [] as Task[],
        loading: false,
        error: null as string | null
    }),

    getters: {
        getTasksByCategory: (state) => {
            return (category: string) => state.tasks.filter(task => task.category === category)
        },

        getCompletedTasks: (state) => {
            return state.tasks.filter(task => task.completed)
        }
    },

    actions: {
        async fetchTasks() {
            this.loading = true
            this.error = null
            try {
                const response = await fetch('http://localhost:3000/api/tasks')
                if (!response.ok) throw new Error('Ошибка при загрузке задач')
                const data = await response.json()
                this.tasks = data
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error)
                this.error = 'Не удалось загрузить задачи'
            } finally {
                this.loading = false
            }
        },

        async addTask(taskData: { title: string; category: string }) {
            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                })

                if (!response.ok) throw new Error('Ошибка при добавлении задачи')

                const newTask = await response.json()
                this.tasks.push(newTask)
            } catch (error) {
                console.error('Ошибка при добавлении задачи:', error)
                this.error = 'Не удалось добавить задачу'
            }
        },

        async updateTask(taskId: string, updates: Partial<Task>) {
            try {
                const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                })

                if (!response.ok) throw new Error('Ошибка при обновлении задачи')

                const updatedTask = await response.json()
                const index = this.tasks.findIndex(t => t._id === taskId)
                if (index !== -1) {
                    this.tasks[index] = updatedTask
                }
            } catch (error) {
                console.error('Ошибка при обновлении задачи:', error)
                this.error = 'Не удалось обновить задачу'
            }
        },

        async deleteTask(taskId: string) {
            try {
                const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                    method: 'DELETE'
                })

                if (!response.ok) throw new Error('Ошибка при удалении задачи')

                this.tasks = this.tasks.filter(task => task._id !== taskId)
            } catch (error) {
                console.error('Ошибка при удалении задачи:', error)
                this.error = 'Не удалось удалить задачу'
            }
        },

        async clearCompletedTasks() {
            const completedTasks = this.tasks.filter(task => task.completed)
            try {
                await Promise.all(
                    completedTasks.map(task => this.deleteTask(task._id))
                )
            } catch (error) {
                console.error('Ошибка при очистке выполненных задач:', error)
                this.error = 'Не удалось очистить выполненные задачи'
            }
        }
    }
}) 