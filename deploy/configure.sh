#!/bin/bash

read -p "API in debug mode?[true|false]: " debug_yn
read -p "API Domain: " api_endpoint
read -p "API Database Host[localhost]: " api_db_host
read -p "API Database Name: " api_db_name
read -p "API Database User: " api_db_user
read -p "API Database Pass: " api_db_pass
read -p "Store URL: " store_url

cp -f api/.env.example api/.env
sed -i "s|{DEBUG}|$debug_yn|" api/.env
sed -i "s|{YOUR_API_DOMAIN}|$api_endpoint|" api/.env
sed -i "s|{YOUR_DB_HOST}|$api_db_host|" api/.env
sed -i "s|{YOUR_DB_NAME}|$api_db_name|" api/.env
sed -i "s|{YOUR_DB_USER}|$api_db_user|" api/.env
sed -i "s|{YOUR_DB_PASS}|$api_db_pass|" api/.env

cp -f store/src/config.sample.js store/src/config.js
sed -i "s|{YOUR_STORE_DOMAIN}|http://$store_url|" store/src/config.js
sed -i "s|{YOUR_API_ENDPOINT}|http://$api_endpoint|" store/src/config.js

cp -f admin/src/config.sample.js admin/src/config.js
sed -i "s|{YOUR_API_ENDPOINT}|http://$api_endpoint|" admin/src/config.js
