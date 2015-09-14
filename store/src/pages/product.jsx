import {Topnav} from './components/layout';
import {lang, price} from 'lib/intl';
var update = React.addons.update;

export default class Product extends Topnav {
  get meta(){
    return {
      resource: 'products'
    };
  }
  get photos(){
    return this.state.model.photos || [];
  }
  get price(){
    if (this.state.loaded) {
      if (this.state.selected.stock.price) {
        return price(this.state.selected.stock.price);
      } else {
        return (<span>{price(this.state.model.stock.min_price)}&nbsp; - &nbsp;{price(this.state.model.stock.max_price)}</span>);
      }
    }
  }
  constructor(...args){
    super(...args);
    this.state = Object.assign(this.state, {
      selected:{
        stock:{},
        option:[]
      }
    });
  }
  componentWillMount(){
    super.componentWillMount();
    this.setState({loaded:false});
    this.model.read(this.props.params.id).done((data, status, xhr)=>{
      this.setState({
        model: data,
        loaded:true,
      });
    }).error(this.handleError.bind(this));
  }

  componentDidUpdate(){
    var $dom = $(React.findDOMNode(this));
    var instance = $dom.find('.fotorama').data('fotorama');
    if (instance) {
      var photoIndex = 0;
      if (this.state.selected.stock && this.state.selected.stock.cover_id) {
        photoIndex = _.findIndex(this.photos, {id:this.state.selected.stock.cover_id});
      }
      instance.show(photoIndex);
    } else {
      if (this.photos.length > 0) {
        $dom.find('.fotorama').fotorama();
      }
    }
  }
  handleOptionChange(i, v, e){
    var option = this.state.selected.option;
    option[i] = v;
    var stock;
    if (option.length == this.state.model.options.length) {
      stock = _.find(this.state.model.stocks, (stock)=>{
        return _.eq(stock.option, option);
      });
    }
    this.setState(update(this.state, {
      selected:{
        stock:{
          $set: stock || {}
        },
        option:{
          $set: option
        }
      }
    }));
  }
  handleAddToBag(e){
    var stock = this.state.selected.stock;
    var quantity = 1;
    var bag = {
      product_id: stock.product_id,
      sku       : stock.sku,
      quantity  : quantity,
    };
    this.api.bags.create({
      product_id: stock.product_id,
      sku       : stock.sku,
      quantity  : quantity,
    }).done((data, status, xhr)=>{
      this.loadBags();
      this.refs.header.openBag();
    }).error(this.handleError.bind(this));
  }
}
