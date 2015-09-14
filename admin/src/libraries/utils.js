export function makeTree(items, level = 0) {
  var tree = []
  items.forEach((item, index)=>{
    var {children, ...other} = item;
    tree.push({...other, level:level});
    if (children.length > 0) {
      tree = _.union(tree, makeTree(children, level + 1));
      // tree += makeTree(children, level + 1);
      // console.log();
    }
  });
  return tree;
}
