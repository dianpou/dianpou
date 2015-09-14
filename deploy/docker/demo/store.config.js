module.exports = {
  "domain":"http://dianpou.demo",
  "api":{
    "endpoint": "http://api.dianpou.demo",
    "client_id": "default",
    "client_secret": "cd87fd1b7b7c754227922556b4f2ae0b"
  },
  "intl": {
    locales:['en-US'],
    formats:{
      date: {
        "datetime": {
          year:"numeric",
          month:"long",
          day:"numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
      },
      number:{
        price:{
          style:'currency', currency:'USD'
        }
      }
    },
    messages: {},
  },
};
