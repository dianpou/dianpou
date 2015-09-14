import {Topnav} from './components/layout';
import async from 'async';
var update = React.addons.update;

export default class Checkout extends Topnav {
  get meta(){
    return {
      resource:"addresses",
    };
  }
  get initialState(){
    return {
      logistics : {loaded:false, items:[]},
      payments  : {loaded:false, items:[]},
      addresses : {loaded:false, items:[]},
      order     : {},
      address_id: null,
      disabled  : true,
    };
  }
  get subtotalProduct(){
    var subtotal = 0;
    this.bags.forEach((bag, index)=>{
      subtotal += bag.stock.price * bag.quantity;
    });

    return subtotal;
  }
  get subtotalLogistics(){
    return this.state.order.subtotal_logistics || 0;
  }
  get totalAmount(){
    return this.subtotalProduct + this.subtotalLogistics;
  }
  componentWillMount(){
    super.componentWillMount();
    this.loadData();
  }

  loadData(){
    this.setState(update(this.state, {
      payments:{loaded:{$set:false}},
      logistics:{loaded:{$set:false}},
      addresses:{loaded:{$set:false}}
    }));

    // load payments
    this.api.payments.read().done(data=>{
      this.setState({
        payments:{
          loaded: true,
          items:data
        }
      });
    }).error(this.handleError.bind(this));

    // load logistics
    this.api.logistics.read().done(data=>{
      this.setState({
        logistics:{
          loaded: true,
          items:data
        }
      });
    }).error(this.handleError.bind(this));

    // load addresses
    this.api.addresses.read().done(data=>{
      if (data.length == 0) {
        this.setState({addresses:{loaded:true, items:[]}});
        this.context.router.transitionTo('/checkout/consignee');
      } else {
      this.setState({
        addresses:{
          loaded: true,
          items:data
        }
      });
      }
    }).error(this.handleError.bind(this));
  }
  refresh(){
    this.loadData();
  }
  toggleButtonStatus(){
    if (this.state.disabled && this.state.address_id && this.state.order.logistics_id && this.state.order.payment_id) {
      this.setState({disabled:false});
    }
  }
  handleAddressChange(address_id){
    let order = Object.assign(
      this.state.order,
      _.mapKeys(
        _.pick(_.find(this.state.addresses.items, {id:address_id}),
          ['consignee', 'region', 'address', 'phone', 'mobile', 'zipcode', 'email']),
        (v, k)=>{return 'logistics_' + k;}));
    this.setState({order, address_id}, this.toggleButtonStatus.bind(this));
  }
  handleLogisticsChange(logistics_id){
    this.api.logistics.create(logistics_id + '/calculator', {
      items: _.pluck(this.state.bags.items, ['quantity'])
    }).done((data)=>{
      this.setState(update(this.state, {
        order:{
          logistics_id:{$set:logistics_id},
          subtotal_logistics:{$set:data.price}
        }
      }), this.toggleButtonStatus.bind(this));
    }).error(console.error);
  }
  handlePaymentChange(payment_id){
    this.setState(update(this.state, {
      order:{
        payment_id:{$set:payment_id}
      },
    }), this.toggleButtonStatus.bind(this));
  }
  handleOrderSubmit(){
    let order = this.state.order;
    order.bags = _.pluck(this.state.bags.items, 'id');
    this.api.checkout.create(order).done((data)=>{
      this.context.router.transitionTo('/home/orders/' + data.sn);
    }).error(this.handleError.bind(this));
  }
}
