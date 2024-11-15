# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json (o yarn.lock) para instalar las dependencias
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con un servidor estático
FROM nginx:alpine

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 para que se pueda acceder a la aplicación
EXPOSE 80

# Comando para iniciar Nginx (no se necesita ejecutar nada en la aplicación React)
CMD ["nginx", "-g", "daemon off;"]

# Copiar el archivo nginx.conf personalizado
COPY nginx.conf /etc/nginx/nginx.conf