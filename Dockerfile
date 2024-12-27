# Используем официальный Node.js образ
FROM node:20.15.1

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и yarn.lock в контейнер
COPY package.json yarn.lock ./

# Устанавливаем Yarn, если он не включен в образ
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем все файлы проекта в контейнер
COPY . .

# Собираем приложение для production
RUN yarn build

# Указываем порт, который будет слушать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", ".output/server/index.mjs"]
