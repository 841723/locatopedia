# #!/bin/bash

# # Configura Certbot si aún no se han generado certificados
# if [ ! -f "/etc/letsencrypt/live/locatopedia.com/fullchain.pem" ]; then
#     echo "Obteniendo certificados SSL con Certbot..."
#     certbot --nginx -d locatopedia.com -d www.locatopedia.com --non-interactive --agree-tos -m diegoraulroldan@gmail.com
# fi

# # Configura la renovación automática
# echo "Configurando la renovación automática de certificados..."
# echo "0 0 * * * certbot renew --quiet && nginx -s reload" | crontab -

# echo "Certbot configurado. Iniciando Nginx..."
