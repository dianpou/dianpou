FROM dianpou/production

RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main' > /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
RUN apt-get update && apt-get -y --force-yes upgrade
RUN apt-get install -y postgresql-9.4

ADD ./ /dianpou
ADD ./deploy/docker/demo/postgresql.supervisor.conf /etc/supervisor/conf.d/postgresql.conf
ADD ./deploy/docker/demo/dianpou.nginx.conf /etc/nginx/sites-enabled/dianpou.conf
ADD ./deploy/docker/demo/api.env /dianpou/api/.env
ADD ./deploy/docker/demo/store.config.js /dianpou/store/src/config.js
ADD ./deploy/docker/demo/admin.config.js /dianpou/admin/src/config.js
WORKDIR /dianpou
RUN /dianpou/deploy/docker/demo/initdb.sh

CMD /dianpou/deploy/docker/demo/bootstrap.sh
