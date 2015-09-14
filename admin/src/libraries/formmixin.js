var FormMixin = {
  formTouched: function(form) {
      _.forIn(form.inputs, function(v, k) {
        if (typeof (v.touch) == 'function') {
          v.touch();
        };
      });
    }
};
module.exports = FormMixin;
