const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Получаем локальный IP адрес
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
};

const localIP = getLocalIP();

// Настраиваем CORS для доступа с любых устройств в локальной сети
app.use(cors({
    origin: [
        'http://localhost:5173',
        `http://${localIP}:5173`,
        'http://localhost:3000',
        `http://${localIP}:3000`
    ],
    credentials: true
}));

app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eisenhower-matrix')
    .then(() => {
        console.log('✅ Успешное подключение к MongoDB');
    })
    .catch((error) => {
        console.error('❌ Ошибка подключения к MongoDB:', error);
    });

// Схема задачи
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['urgent-important', 'not-urgent-important', 'urgent-not-important', 'not-urgent-not-important']
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

// API роуты
// Получить все задачи
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении задач' });
    }
});

// Создать нов��ю задачу
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Ошибка при создании задачи' });
    }
});

// Обновить задачу
app.patch('/api/tasks/:id', async (req, res) => {
    try {
        console.log('Получен запрос на обновление:', req.params.id, req.body) // Отладка

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Некорректный ID задачи' })
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )

        if (!task) {
            return res.status(404).json({ error: 'Задача не найдена' })
        }

        console.log('Задача обновлена:', task) // Отладка
        res.json(task)
    } catch (error) {
        console.error('Ошибка обновления:', error)
        res.status(500).json({ error: 'Ошибка при обновлении задачи' })
    }
})

// Удалить задачу
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        console.log('Получен запрос на удаление:', req.params.id) // Отладка

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Некорректный ID задачи' })
        }

        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).json({ error: 'Задача не найдена' })
        }

        console.log('Задача удалена:', task) // Отладка
        res.json({ message: 'Задача успешно удалена' })
    } catch (error) {
        console.error('Ошибка удаления:', error)
        res.status(500).json({ error: 'Ошибка при удалении задачи' })
    }
})

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 Локальный доступ: http://localhost:${PORT}`);
    console.log(`🌐 Доступ по сети: http://${localIP}:${PORT}`);
});
