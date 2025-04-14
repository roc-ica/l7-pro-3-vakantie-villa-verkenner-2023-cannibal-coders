FROM php:8.1-apache

# Install pdo and pdo_mysql extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Copy server files
COPY . /var/www/html/

# Create uploads directory with proper permissions
RUN mkdir -p /var/www/html/uploads/properties && \
    chmod -R 777 /var/www/html/uploads

# Expose port 80
EXPOSE 80
