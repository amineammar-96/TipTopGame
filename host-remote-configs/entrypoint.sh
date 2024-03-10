PHP_MEMORY_LIMIT=512M
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
php bin/console cache:clear --env=prod
php bin/console app:reset-game
exec apache2-foreground
