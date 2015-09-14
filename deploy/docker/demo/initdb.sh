#!/bin/sh
supervisord -n &
sleep 5
sudo -u postgres createdb -E UTF8 -T template0 -O postgres dianpou
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres'" -d dianpou
cd /dianpou/api && php artisan migrate:refresh --seed && php artisan db:seed --class=DemoDataSeeder
supervisorctl stop all
