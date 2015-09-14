import {Topnav} from './components/layout';
import {api} from 'lib/api';
var update = React.addons.update;

export default class Bag extends Topnav {
  get subtotalProduct(){
    var subtotal = 0;
    this.state.bags.items.forEach((bag, index)=>{
      subtotal += bag.stock.price * bag.quantity;
    });

    return subtotal;
  }
  handleRemoveClick(row, e){
    this.api.bags.destroy(row.id).done((data, status, xhr)=>{
      this.setState(state=>{
        var index = _.findIndex(state.bags, {id:row.id});
        state.bags.items.splice(index, 1);
        return {bags:state.bags};
      });
    }).error(this.handleError.bind(this));
  }
  handleCheckoutClick(){
    this.context.router.transitionTo('/checkout');
  }
  handleQuantityChange(row, quantity){
    this.api.bags.update(row.id, {quantity:quantity}).done((data, status, xhr)=>{
      this.setState(state=>{
        var index = _.findIndex(state.bags.items, {id:data.id});
        var bags = state.bags;
        bags.items[index] = Object.assign(bags.items[index], data);
        return {bags:bags};
      });
    }).error(this.handleError.bind(this));
  }
}
