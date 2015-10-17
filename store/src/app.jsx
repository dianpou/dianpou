$(document.body).addClass('layout-top-nav skin-red-light');
_.mixin({ seq: function(start, end) {
  var length = (end - start) + 1;
  return Array.apply(null, {length: length}).map(function(item, i) {return start + i;}, Number);
},
    move: function(array, fromIndex, toIndex) {
      array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
      return array;
    }
});
import {lang, price, date} from 'lib/intl';
window.lang = lang;
window.price = price;
window.date = date;

import routes from './routes';
import scriptjs from 'scriptjs';

React.render(routes, document.body);
