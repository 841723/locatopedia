# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Configuración de Nginx y Certbot
FROM nginx:alpine

# Instala Certbot y dependencias necesarias
RUN apk add --no-cache certbot certbot-nginx bash

# Establece el directorio raíz del servidor
WORKDIR /var/www/html

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /var/www/html

# Copia el archivo de configuración de Nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia un script para configurar Certbot automáticamente
COPY certbot_setup.sh /usr/local/bin/certbot_setup.sh
RUN chmod +x /usr/local/bin/certbot_setup.sh

# Exposición de puertos HTTP y HTTPS
EXPOSE 80 443

# Comando inicial para configurar Certbot y luego iniciar Nginx
# CMD ["nginx -g 'daemon off;'"]
CMD ["sleep", "infinity"]
