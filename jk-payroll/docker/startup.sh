#!/bin/sh

# Wait for the database to be ready (for SQLite this is instant)
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate --force

# Start the application
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf