module.exports = {
  "domain":"{YOUR_STORE_DOMAIN}",
  "api":{
    "endpoint": "{YOUR_API_ENDPOINT}",
    "client_id": "default",
    "client_secret": "cd87fd1b7b7c754227922556b4f2ae0b"
  },
  "tracking_code": "<script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-6451211-4', 'auto'); ga('send', 'pageview'); </script>",
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
