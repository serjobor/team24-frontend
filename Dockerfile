# Используем официальный образ Node.js на Alpine (меньше размер)
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Уменьшаем количество слоев и кешируем зависимости
COPY package.json package-lock.json* ./
RUN npm install  && npm cache clean --force

# Копируем только необходимые файлы (иc dockerignore)
COPY . .

# Указываем non-root пользователя для безопасности
RUN chown -R node:node /app
USER node

# Используем переменные окружения для конфигурации
ENV NODE_ENV=production
ENV PORT=5173

# Запускаем приложение
CMD ["npm", "run","dev"]