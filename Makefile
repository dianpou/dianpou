config:
	@bash deploy/configure.sh
	@echo "Configure done! 'make install' to finished progress"
install:
	# Prepare
	@chmod -R 777 api/storage api/bootstrap/cache
	# Install Dependencies
	@for task in  'cd api && composer install' \
								'cd admin && npm install && rm -rf node_modules/react' \
								'npm install' \
								'bower install --allow-root'; \
								do { eval $$task; } & \
								done; wait
	# Install DB
	@php api/artisan migrate:refresh --seed
	# Build Clients
	@npm run production
	@echo "Install successfully, Initial admin is 'admin@dianpou.com', password 'admin', Enjoy it!"

test:
	@api/vendor/bin/phpunit api/tests

api-test:
	@api/vendor/bin/phpunit api/tests/API

model-test:
	@api/vendor/bin/phpunit api/tests/Models

unit-test:
	@api/vendor/bin/phpunit api/tests/Unit

.PHONY: source destination clean test badkitty
