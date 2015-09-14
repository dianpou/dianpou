var {Button, Carousel, CarouselItem} = ReactBootstrap;
var {lang, date, price} = Intl;
var {update} = React.addons;

require('jcarousel');

class OfficalWidget extends Plugin.Widget {
  get classns(){
    return classNames(super.classns, 'offical');
  }
}
export class PureHTML extends OfficalWidget {
  // renderWidget(){
  //
  // }
  // render(){
  //   var {data, className, ...other} = this.props;
  //   return <div className={classNames('section', className)} {...other} dangerouslySetInnerHTML={{__html:data}}></div>;
  // }
}
export class Header extends OfficalWidget {
  get classns(){
    return classNames('offical', 'header');
  }
  get initialState(){
    return {
      links:[],
    };
  }
  componentWillMount(){
    if (this.props.data.position) {
      this.api.pages.read({f:{position:this.props.data.position}}).done((links)=>{
        this.setState({links:links});
      }).error(this.handleError.bind(this));
    }
  }
  renderWidget(data){
    var {title, subtitle, href} = data;
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>
                <span dangerouslySetInnerHTML={{__html:title}}></span>
                <small dangerouslySetInnerHTML={{__html:subtitle}}></small>
              </h1>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled nav-links">
              {this.state.links.map((link, i)=>{
                var {className, text} = link.settings.button;
                return (
                  <li key={i}>
                    <a href={'/' + link.pathname} className={classNames(className, {active:this.context.router.isActive(link.pathname)})}>{text || link.title}</a>
                  </li>
                );
              })}
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export class ImageParkText extends OfficalWidget {
  get classns(){
    return classNames(super.classns, 'image-park-text');
  }
  static get defaultProps(){
    return {
      data:{
        text: {
          title:'Title here',
          subtitle:'Subtitle here',
        },
        img:'',
      },
      index: 0
    };
  }
  renderWidget(data, index){
    var text = (
      <td width="60%" key="text" valign="middle" className="text-center">
        <div className="text">
          <h2 dangerouslySetInnerHTML={{__html:data.text.title}}></h2>
          <p className="lead" dangerouslySetInnerHTML={{__html:data.text.subtitle}}></p>
        </div>
      </td>
    );
    var img = _.isObject(data.img) ? (
      <td width="40%" key="img">
        <img className="img-responsive center-block" {...data.img} />
      </td>
    ) : (
      <td width="40%" key="img" dangerouslySetInnerHTML={{__html:data.img}}></td>
    );
    var contents = [text, img];
    if (this.props.reverse !== undefined) {
      contents = this.props.reverse ? _(contents).reverse().value() : contents;
    } else if(index % 2 == 0){
      contents = _(contents).reverse().value();
    }
    return (
      <div className="container">
        <table>
          <tr>
            {contents}
          </tr>
        </table>
      </div>
    );
  }
}

export class ItemsBelowText extends OfficalWidget {
  get classns(){
    return classNames(super.classns, 'items-below-text');
  }
  renderWidget(data, index){
    var {title, subtitle, items} = data;
    var text, items, contents;
    text = (
      <div key="text" className="row">
        <h2 dangerouslySetInnerHTML={{__html:title}}></h2>
        <p className="lead" dangerouslySetInnerHTML={{__html:subtitle}}></p>
      </div>
    );
    items = (
      <ul key="items" className="list-unstyled">
      {items.map((item, i)=>{
        return <li key={i} dangerouslySetInnerHTML={{__html:item}}></li>;
        })}
      </ul>
    );
    contents = [text, items];
    if (this.props.reverse) {
      contents = _(contents).reverse().value();
    }
    return (
      <div className="container">
        {contents}
      </div>
    );
  }
}

export class Slider extends OfficalWidget {
  static get defaultProps(){
    return {
      items:[],
      settings:{},
    };
  }
  renderWidget(data, index){
    return (
      <Carousel {...this.props.settings}>
        {data.map((item, i)=>{
          return (
            <CarouselItem key={i}>
              <div dangerouslySetInnerHTML={{__html:item}}></div>
            </CarouselItem>
          );
        })}
      </Carousel>
    );
  }
}


export class ProductPicker extends OfficalWidget {
  get classns(){
    return classNames(super.classns, 'product-picker');
  }
  get photos(){
    return this.state.model.photos || [];
  }
  get price(){
    if (this.state.model.id) {
      if (this.state.selected.stock.price) {
        return price(this.state.selected.stock.price);
      } else {
        return (<span>{price(this.state.model.stock.min_price)}&nbsp; - &nbsp;{price(this.state.model.stock.max_price)}</span>);
      }
    }
  }
  constructor(...args){
    super(...args);
    this.state = Object.assign(this.state || {}, {
      model:{},
      selected:{
        stock:{},
        option:[]
      }
    });
  }
  componentWillMount(){
    // super.componentWillMount();
    this.api.products.read(this.props.data.product_id).done((data, status, xhr)=>{
      this.setState({
        model: data,
      });
    }).error(this.handleError.bind(this));
  }
  componentWillUpdate(){
    // var $dom = $(React.findDOMNode(this));
    // var instance = $dom.find('.fotorama').data('fotorama');
    // if (instance) {
    //   instance.destroy();
    // }
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
      this.props.parent.loadBags();
      this.props.parent.refs.header.openBag();
    }).error(this.handleError.bind(this));
  }
  renderWidget(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="fotorama" data-height="600" data-nav="thumbs" data-thumbmargin="10" data-thumbfit="scaledown">
              {this.photos.map((photo, i)=>{
                return <a key={i} href={photo.file.file_path}><img src={photo.file.file_path} /></a>;
              })}
            </div>
          </div>
          <div className="col-md-4">
            <h1>{this.state.model.product_name}</h1>
            <h3>{this.price}</h3>
            {(this.state.model.options||[]).map((option, i)=>{
              return (
                <div key={i} className="product-options">
                  <h4>
                  {option.name}
                  </h4>
                  <RadioGroup name={"option." + i} selectedValue={this.state.selected.option[i]} onChange={this.handleOptionChange.bind(this, i)}>
                    {Radio => (
                      <div className="items">
                        {option.options.map((v, j)=>{
                          return <label key={j}><Radio value={v} className="hide" /><span>{v}</span></label>;
                        })}
                      </div>
                    )}
                  </RadioGroup>
                </div>
              );
            })}
            <div>
              <ReactBootstrap.Button onClick={this.handleAddToBag.bind(this)} bsSize="large" className={classNames({'btn-success':this.state.selected.stock.stocks})} disabled={!this.state.selected.stock.stocks} block>
                <i className="ion-bag"></i>
                &nbsp;&nbsp;
                {lang('add_to_bag')}
              </ReactBootstrap.Button>
              <div style={{margin:"10px 0px"}}>
                {lang('current_stocks')}:{this.state.selected.stock.stocks || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export class ProductSelector extends OfficalWidget {
  get classns(){
    return classNames(super.classns, 'product-selector');
  }
  constructor(...args){
    super(...args);
    this.state = Object.assign(this.state || {}, {
      model:{stocks:[]},
      selected:{
        stock:{},
        option:[]
      }
    });
  }
  componentWillMount(){
    // super.componentWillMount();
    this.api.products.read(this.props.data.product_id).done((data, status, xhr)=>{
      this.setState({
        model: data,
      });
    }).error(this.handleError.bind(this));
  }
  componentDidUpdate(){
    var $dom = $(React.findDOMNode(this));
    $dom.find('.fotorama').fotorama();
  }
  handleAddToBag(stock, e){
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
      this.props.parent.loadBags();
      this.props.parent.refs.header.openBag();
    }).error(this.handleError.bind(this));
  }
  componentWillUpdate(){
    $('#stocks').scrollbar('destroy');
  }
  componentDidUpdate(){

    $('#stocks').scrollbar({
      scrollx:$('.stocks-scrollbar'),
      scrolly:'none',
    });
  }

  renderWidget(data){
    return (
      <div>
        <div className="text-center product-title">
          <h1>
            {data.title ? (<span dangerouslySetInnerHTML={{__html:data.title}}></span>) : this.state.model.product_name}
          </h1>
          <p className="lead">{lang('widget.product_selector.count', {total:this.state.model.stocks.length})}</p>
        </div>
        <div className="stocks" id="stocks">
          <ul>
            {this.state.model.stocks.map((stock, i)=>{
              return (
                <li key={i}>
                  <div>
                    <img src={_.get(stock.cover, 'file.file_path', this.state.model.cover.file.file_path)} />

                    <h3>{data.template ? _.template(data.template)({option:stock.option}) : stock.option}</h3>
                    <p className="price">
                      {price(stock.price)}&nbsp;&nbsp;({lang('stock')}:{stock.stocks})
                    </p>
                    <br />
                    <p>
                      <Button disabled={stock.stocks === 0} onClick={this.handleAddToBag.bind(this, stock)} bsStyle="success">
                        <i className="ion-bag"></i>
                        &nbsp;&nbsp;
                        {lang('choose')}
                      </Button>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="container stocks-scrollbar">
          <div className="scroll-element_outer">
              <div className="scroll-element_size"></div>
              <div className="scroll-element_track"></div>
              <div className="scroll-bar"></div>
          </div>
        </div>
      </div>
    );
  }
}
