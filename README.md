# Dianpou [![Join the Dianpou Community on Slack](http://slack.dianpou.org/badge.svg)](http://slack.dianpou.org/)

Dianpou is an open-source e-commerce software with a focus on simplicity.  Unlike Magento/Shopify/Spree/... for general purpose, It's focus on those who create incredible products and would selling it through their own offical online store, Just like `Apple Inc`. The goal is help you easily build your own offical online store just like [Apple Store](http://apple.com).

__*Warning: This is currently in very early stage and should not be used in production until we reach a 1.0.0 release, and I'd love your help to get there, checkout about [Contributing](#contributing)*__

## Quick Preview

Landing page.
[![Index](https://cloud.githubusercontent.com/assets/63785/9850568/07eb3470-5b26-11e5-869a-292dc00ca534.png)](http://demo.dianpou.org)

Every product can easy to have their own URL and landing page
[![Models](https://cloud.githubusercontent.com/assets/63785/9854632/63251098-5b3c-11e5-88d1-3121c191f631.png)](http://demo.dianpou.org/models)

Typical shopping flow for general product.
[![Buy Models](https://cloud.githubusercontent.com/assets/63785/9850730/28b04ffa-5b27-11e5-8f57-b06b796da689.png)](http://demo.dianpou.org/models/buy)

Product can easy to have its own shopping flow.
[![Buy Watch](https://cloud.githubusercontent.com/assets/63785/9850693/da964cfc-5b26-11e5-84ff-d8dd252536c0.png)](http://demo.dianpou.org/watch/buy)

__There are many of amazing features I can't list here is waiting for you to explore__

## Have a try in seconds

### Online demo

Store: http://demo.dianpou.org  Admin: http://admin.demo.dianpou.org

The default admin account: `admin@dianpou.com`  password: `admin`

You may sign in with your `github` account in store front, and pay an order with a paypal sandbox account `paypal-buyer@dianpou.com`, the password is `123456`.

### With Docker

You need to get [Docker](http://docker.com) installed first. After all just run the following command.

```bash
$ docker run -d --name dianpou_demo -p 80:80 dianpou/demo
```

Append the following line to the end of file `/etc/hosts`

```
{THE_DOCKER_INSTANCE_IP} dianpou.demo www.dianpou.demo api.dianpou.demo admin.dianpou.demo
```

After all, you will be able to access the demo by visit http://dianpou.demo

## The Architecture & Tech stack

![The architecture](https://cloud.githubusercontent.com/assets/63785/9857388/c5345f90-5b4c-11e5-9265-7341213bd92d.png)

* [Laravel](http://laravel.com) is used to build server-side api
* [Facebook's React](https://facebook.github.io/react/) is used to build both of `store` and `admin`, They are all modern web app.
* ES6 has been widely used

__Thanks to Laravel and React, You have no necessary to worry about learning a new framework. You can join to developing immediately, even there are no any documentions yet__


## Installation

### Requirements

* PHP > 5.6
* Composer > 3
* Nodejs > 1.0
* PostgreSQL > 9.4

After you installed all the dependencies.


Step 1. Get the code

```bash
$ git clone git@bitbucket.org:garbinh/dianpou.git /var/www/dianpou
```

Step 2. Go to path /var/www/dianpou, run following command to configure installation.

```bash
$ make config
```

fill all the information required by this command, including

* Debug mode
* API endpoint domain that you want to use
* The database you created, including host, db name, user and password,
* The store front domain you want to use

Step 3. After configuration. run following command to finished installation

```bash
$ make install
```

Wait for serval minutes, you'll get the successful message for installation.

## Documentions

*#TODO*


## Contributing

I finished all the work incuding idea, architecture design, product design, user interfaces design and all the coding work by my self in the past 6 months. Honestly, There is a lot of work need to be done before 1.0.0, such as documention, translation, serval major features, It'll be very hard if without any help. So any contribution is welcome. You can contribute in any way you'd like to. List below is the ways that you can join to contributing.

1. Join the [community on Slack](http://slack.dianpou.org/), talk to each other, contribute your ideas, share your knowledge.
2. Submit issue on [Github](https://github.com/dianpou/dianpou/issues).
3. Create Pull Request on [Github](https://github.com/dianpou/dianpou/pulls) if you find a bug or add a feature.
4. Email me `garbinh(at)gmail.com` for any feedback.

## License

GPL V3, see [LICENSE](https://github.com/dianpou/dianpou/blob/master/LICENSE) for more details.
