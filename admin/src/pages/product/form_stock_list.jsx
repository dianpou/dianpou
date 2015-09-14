var ModalTrigger   = ReactBootstrap.ModalTrigger,
    Input          = ReactBootstrap.Input,
    StockEditor    = require('./form_stock_modal'),
    api           = require('../../libraries/api'),
    Products      = api.Products,
    ProductPhotos = api.ProductPhotos,
    ProductStocks = api.ProductStocks,
    Image         = require('../../components/image'),
    OptionEditor   = require('./form_option');
module.exports = React.createClass({
    getInitialState: function () {
      return {
        stocks: this.props.stocks,
        photos: this.props.photos,
        options: this.props.options
      };
    },
    handleCreateSubmit: function (stock) {
      var stocks = this.state.stocks;
      stocks.push(stock);
      this.setState({stocks}, this.refs.add_stock.hide);
      return true;
    },
    handleEditSubmit: function (stock, cb) {
      // var stocks = this.state.stocks;
      // var index  = _.findIndex(stocks, 'id', stock.id);
      // stocks[index] = stock;
      // console.debug('Stock edited:', stock)
      // this.setState({stocks}, cb);
      this.props.onEditSubmit(stock, cb);
    },
    handleRemove: function (index, stock) {
      var removeFromLocal = (index) => {
        var stocks = this.state.stocks;
        delete stocks[index];
        this.setState({stocks});
      };
      if (_.startsWith(stock.id, 'local')) {
        removeFromLocal(index);
      } else {
        ProductStocks.del(stock.product_id, stock.id).error(this.props.onError).done((data, status, xhr)=>{
          removeFromLocal(index);
        });
      }
    },
    render: function () {
      return (<ul className="list-unstyled product-options">
                  {this.props.stocks.map((stock, i)=>{
                      var stock_editor = (<StockEditor onSubmit={this.handleEditSubmit}
                                                      stocks={this.state.stocks}
                                                      stock={stock}
                                                      isNew={false}
                                                      options={this.props.options}
                                                      photos={this.props.photos} />);
                      return (
                          <li key={i}>
                                  <div className="media">
                                    <div className="media-left">
                                      <ModalTrigger modal={stock_editor}>
                                      <a href="javascript:;">
                                        <Image src={_.get(stock, 'cover.file.file_path')} size="mini" />
                                      </a>
                                    </ModalTrigger>
                                    </div>
                                    <div className="media-body">
                                      <h4 className="media-heading">{stock.option}<span className="price pull-right">{stock.price}</span></h4>
                                      SKU:&nbsp;{stock.sku}&nbsp;&nbsp;{lang('product.stock')}:&nbsp;{stock.stocks}
                                      <div className="pull-right">
                                        <ModalTrigger modal={stock_editor}>
                                          <a href="javascript:;"><i className="fa fa-pencil"></i></a>
                                        </ModalTrigger>
                                        &nbsp;&nbsp;
                                        <a href="javascript:;" onClick={this.handleRemove.bind(this, i, stock)}><i className="fa fa-trash"></i></a>
                                      </div>
                                    </div>
                                  </div>
                          </li>
                      );
                  })}
                  <ModalTrigger modal={<StockEditor onSubmit={this.handleCreateSubmit} stocks={this.state.stocks} options={this.props.options} photos={this.props.photos} />} ref="add_stock">
                    <li className="add-new"><i className="fa fa-plus"></i></li>
                  </ModalTrigger>
              </ul>);
    }
});
