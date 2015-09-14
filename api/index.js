export default function widget (name) {
  var component, tmp;
  __webpack_modules__.forEach((m, i)=>{
    tmp = __webpack_require__(i);
    if (tmp[name]) {
      component = tmp[name];
    }
  });

  return component;
}
