_.mixin({ seq: function(start, end) {
  var length = (end - start) + 1;
  return Array.apply(null, {length: length}).map(function(item, i) {return start + i;}, Number);
},
    move: function(array, fromIndex, toIndex) {
      array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
      return array;
    }
});

$(function(){
  // console.log(Holder);
  Holder.run({images:".placeholder"});
});

$(document.body).on('mouseenter mouseleave', '.image-with-caption', function(e) {
  var $caption = $(this).find('.caption');
  if (e.type == 'mouseenter') {
    $caption.show();
  } else {
    $caption.hide();
  };
});
