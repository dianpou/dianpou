#!/bin/sh
cd /dianpou && npm run production
supervisord -n
