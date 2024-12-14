<template>
    <div v-if="showInstallPrompt" class="pwa-prompt">
        <div class="prompt-content">
            <p>Установите приложение для удобной работы</p>
            <div class="prompt-buttons">
                <button @click="installPWA" class="install-btn">Установить</button>
                <button @click="dismissPrompt" class="dismiss-btn">Позже</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        showInstallPrompt.value = true
    })
})

const installPWA = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            showInstallPrompt.value = false
        }
        deferredPrompt = null
    }
}

const dismissPrompt = () => {
    showInstallPrompt.value = false
}
</script>

<style lang="scss" scoped>
@import '../assets/animations.scss';

.pwa-prompt {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideUp 0.5s ease;
    width: 90%;
    max-width: 400px;

    @media (max-width: 768px) {
        width: 90%;
    }

    .prompt-content {
        text-align: center;

        p {
            margin-bottom: 1rem;
            color: var(--text-primary);
            animation: fadeIn 0.5s ease;
        }
    }

    .prompt-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;

        button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;

            &.install-btn {
                background: var(--accent-color);
                color: white;
                border: none;

                &:hover {
                    animation: bounce 0.5s ease infinite;
                }
            }

            &.dismiss-btn {
                background: transparent;
                color: var(--text-primary);
                border: 1px solid var(--text-primary);

                &:hover {
                    animation: shake 0.3s ease;
                }
            }

            &:hover {
                animation: pulse 0.5s ease;
                transform: scale(1.05);
            }
        }
    }
}
</style>