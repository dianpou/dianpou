import {BlankLayoutPage, TableLayoutPage, ModalFormLayoutPage} from 'components/layout';
import {Orders} from 'libraries/api';
import {Table, Column, ColumnContent} from 'components/table';
import {Select, Input, Button, DateRangePicker} from 'components/form';
import Image from 'components/image';
import Loader from 'components/loader';

import Alert from 'components/alert';
import {Message} from 'components/modal';
import {lang, price, date} from 'libraries/intl';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;
var {SplitButton, Toolbar, DropdownButton, MenuItem} = ReactBootstrap;
var {FormattedNumber, FormattedMessage} = ReactIntl;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('order.title'),
      subtitle: lang('order.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('order.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('order.title');
  }
  get model(){
    return {
      routeName: 'orders',
      routeAlias: 'orders.index',
      api:       Orders,
    };
  }
  get langNS(){
    return 'order';
  }
  handleOperationClick(row, operation, e){
    this.context.router.transitionTo('orders.' + operation, row);
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column width="100" key="sn" head={lang('order.sn')} >
          {(row)=>{
            return <Link to="orders.show" params={row}>{row.sn}</Link>;
          }}
        </Column>,
        <Column key="amount" head={lang('order.total_amount')} width="80">
          {(row)=>{
            return <FormattedNumber value={row.total_amount} format="cny" />;
          }}
        </Column>,
        <Column key="order_status" head={lang('order.order_status')} width="120">
          {(row)=>{
            return (<span>{lang('order.status.' + row.order_status)}</span>);
          }}
        </Column>,
        <Column key="payment_status" head={lang('order.status.payment')} width="120">
          {(row)=>{
            return (<span>{lang('order.status.' + row.payment_status)}</span>);
          }}
        </Column>,
        <Column key="consignee" head={lang('order.consignee')}>
          {(row)=>{
            return (
              <span>{row.logistics_consignee}&nbsp;({row.logistics_mobile})</span>
            );
          }}
        </Column>,
        <Column
          key="created_at"
          width="100"
          head={lang('order.created_at')}
          sortable="created_at"
          current={this.props.query}
          default="desc"
          onSort={this.handleSortClick.bind(this)}>
          {ColumnContent.field('created_at', this.d)}
        </Column>,
        <Column key="updated_at" width="100" head={lang('order.updated_at')}>
          {ColumnContent.field('updated_at', this.d)}
        </Column>,
        <Column
          key="operations"
          head={lang('operations')}
          width="100"
          style={{verticalAlign:'middle'}}
          className="text-center">
          {this.renderTableRowActions.bind(this)}
        </Column>
    ];
  }
  renderTableRowActions(row){
    var operations;
    var available_operations = _.keys(_.omit(row.operations, (v)=>{return v === false;})) || [];
    if (_.contains(['canceled', 'completed'], row.order_status)) {
      operations = (<Button bsSize="small" className="disabled">{lang('order.status.completed')}</Button>);
    } else {
      if (available_operations.length === 1) {
        operations = (<Button bsSize="small">{lang('order.operations.' + available_operations[0])}</Button>);
      } else {
        var first_operation = (
          <span>
            {lang('order.operations.' + _.first(available_operations))}
          </span>
        );
        operations = (
        <SplitButton bsSize='small' title={first_operation} onClick={this.handleOperationClick.bind(this, row, available_operations[0])}>
          {_.slice(available_operations, 1).map((operation)=>{
            return (
              <MenuItem
                eventKey={operation}
                onClick={this.handleOperationClick.bind(this, row, operation)}
                key={operation}>
                {lang('order.operations.' + operation)}
              </MenuItem>);
            })}
        </SplitButton>
        );
      }
    }
    return (
      <div>
        {operations}
      </div>
    );
  }
  renderTableBatch(options){
    return super.renderTableBatch([
      {value:"delete", label:lang('delete')},
      {value:"cancel", label:lang('cancel')}
    ]);
  }
  renderTableFilterInputs(){
    var status_options = [
      {value:'pending', label:lang('order.status.pending')},
      {value:'confirmed', label:lang('order.status.confirmed')},
      {value:'compoleted', label:lang('order.status.completed')},
      {value:'canceled', label:lang('order.status.canceled')},
    ];
    var pickerOptions = {
      locale:{
        format: 'YYYY/MM/DD'
      },
    }
    return (
      <div>
        <Input name="f.order_status" type="select" value={_.get(this.props, 'query.f.order_status')} labelClassName="hide">
          <option value="">{lang('order.status.all')}</option>
          {status_options.map((option, idx)=>{
            return <option value={option.value} key={idx}>{option.label}</option>;
          })}
        </Input>
        &nbsp;&nbsp;
        <DateRangePicker
          name="f.created_at"
          placeholder={lang('order.filter.date')}
          value={_.get(this.props, 'query.f.created_at')}
          style={{width:"170px"}} />
        &nbsp;&nbsp;
        {super.renderTableFilterInputs()}
      </div>
    );
  }
}

class Show extends BlankLayoutPage {
  get langNS(){
    return 'order';
  }
  get breadcrumb(){
    return {
      title: lang('order.title'),
      subtitle: '#' + this.state.model.sn,
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('order.title'), icon: 'fa fa-shopping-cart', href:this.context.router.makeHref('orders')},
        {text:lang('order.show')}
      ]
    };
  }
  get model(){
    return {
      routeName: 'orders.show',
      api: Orders
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = Object.assign(this.state, {
      model:{logistics:{}, payment:{}, user:{}},
      products:[],
      logs:[]
    });
  }
  componentWillMount(){
    this.reloadData();
  }
  reloadData(){
    var id = this.props.params.id;
    async.parallel([
      (cb)=>{
        this.model.api.read(id).done((data, status, xhr)=>{
          cb(null, data);
        }).error(cb);
      },
      (cb)=>{
        this.model.api.read(id + '/products').done((data, status, xhr)=>{
          cb(null, data);
        }).error(cb);
      },
      (cb)=>{
        this.model.api.read(id + '/logs').done((data, status, xhr)=>{
          cb(null, data);
        }).error(cb);
      },
      ], (err, r)=>{
        if (err) {
          return this.handleError(err);
        } else {
          var [order, products, logs] = r;
          this.setState({model:order, products:products, logs:logs, loaded:true});
        }
    });
  }
  handleOperationClick(operation){
    this.context.router.transitionTo('orders.' + operation, this.props.params);
  }
  renderContent(){

    var operations = [];

    _.forIn(this.state.model.operations || [], (v, k)=>{
      if (v && k != 'edit') {
        operations.push(k);
      }
    });

    return (
      <Loader loaded={this.state.loaded}>
        <div className="row">
          <div className="col-xs-9">
            <section className="invoice" style={{margin:0}}>
              <div>
                <div className="row">
                  <div className="col-xs-12">
                    <h2 className="page-header">
                      <i className="fa fa-globe"></i>
                      &nbsp;&nbsp;&nbsp;
                      {lang('order.status.'+this.state.model.order_status)}
                      <small className="pull-right">{lang('order.created_at')}:&nbsp;&nbsp;&nbsp;{date(this.state.model.created_at)}</small>
                    </h2>
                  </div>
                </div>
                <div className="row invoice-info">
                  <div className="col-sm-4 invoice-col">
                    <address>
                      <strong>{this.state.model.logistics_consignee}</strong>
                      {operations.edit ? (<span style={{marginLeft:"5px"}}>[<Link to="orders.edit" params={this.state.model}>{lang('order.operations.edit')}</Link>]</span>) : null}<br/>
                      {this.state.model.logistics_region}&nbsp;&nbsp;({this.state.model.logistics_zipcode})<br/>
                    {this.state.model.logistics_address}<br/>
                  {lang('address.mobile')}: {this.state.model.logistics_mobile}&nbsp;&nbsp;&nbsp;{this.state.model.logistics_phone}<br/>
                {lang('address.email')}: {this.state.model.logistics_email}
              </address>
            </div>
            <div className="col-sm-4 invoice-col">
              <b>
                {this.state.model.logistics.logistics_name}
                {this.state.model.logistics_cod ? (<span>(货到付款)</span>): null}
              </b><br/>
              <br/>
              <b>物流状态:</b>&nbsp;&nbsp;{lang('order.status.'+this.state.model.logistics_status)}<br/>
              <b>发货时间:</b>&nbsp;&nbsp;{date(this.state.model.logistics_time) || 'N/A'}<br/>
              <b>跟踪代码:</b>&nbsp;&nbsp;{this.state.model.logistics_tracking_number || 'N/A'}
              </div>
              <div className="col-sm-4 invoice-col">
                <b>订单号&nbsp;&nbsp;&nbsp;#{this.state.model.sn}</b><br/>
                <br/>
                <b>账号ID:</b>&nbsp;&nbsp;&nbsp;
                  <Link to="users.show" params={{id:this.state.model.user_id}}>
                    @{this.state.model.user.nickname}
                  </Link>
                  <br />
                  <b>订单ID:</b>&nbsp;&nbsp;&nbsp;{this.state.model.id}<br/>
                </div>
              </div>


              <div className="row">
                <div className="col-xs-12 table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>产品名称</th>
                        <th width="130">SKU #</th>
                        <th width="90">单价</th>
                        <th width="90">数量</th>
                        <th width="90">小计</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.products.map((product, i)=>{
                        return (
                          <tr key={i}>
                            <td>
                              <div className="media">
                                <div className="media-left">
                                  <a href="#">
                                    <Image size="mini" src={product.cover} />
                                  </a>
                                </div>
                                <div className="media-body" style={{width:'auto'}}>
                                  <h4 className="media-heading">{product.product_name}</h4>
                                  {product.option}
                                </div>
                              </div>
                            </td>
                            <td vAlign="middle">{product.sku}</td>
                            <td>{price(product.price)}</td>
                            <td>{product.quantity}</td>
                            <td>{price(product.price * product.quantity, 'cny')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row">

                <div className="col-xs-6">
                  <p className="lead">{lang('order.payment')}&nbsp;-&nbsp;{this.state.model.payment.payment_name}</p>
                  <p>
                    <b>{lang('order.status.payment')}:</b>&nbsp;&nbsp;{lang('order.status.'+this.state.model.payment_status)}<br/>
                    <b>{lang('order.payment_time')}:</b>&nbsp;&nbsp;{date(this.state.model.payment_time) || 'N/A'}<br/>
                  </p>
                  <p className="text-muted well well-sm no-shadow" style={{marginTop: '10px'}}>
                    {lang('order.payment_notice')}
                  </p>
                </div>
                <div className="col-xs-6">
                  <p className="lead">{lang('order.check_amount')}</p>
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td style={{width:"50%"}}>{lang('order.subtotal_product')}:</td>
                          <td>{price(this.state.model.subtotal_product)}</td>
                        </tr>
                        <tr>
                          <td>{lang('order.subtotal_logistics')}:</td>
                          <td>{price(this.state.model.subtotal_logistics)}</td>
                        </tr>
                        <tr>
                          <th>{lang('order.total_amount')}:</th>
                          <td>{price(this.state.model.total_amount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row no-print">
                <div className="col-xs-12">
                </div>
              </div>
            </div>
        </section>
      </div>
      <div className="col-xs-3">
      {operations.length > 0 ? (
        <div className="box">
          <div className="box-body">
            {operations.map((operation)=>{
              var style, buttonText = lang('order.operations.' + operation);
              switch (operation) {
                case 'refund_and_cancel':
                operation = 'refund';
                case 'refund':
                case 'cancel':
                style = 'danger';
                break;
                case 'complete':
                case 'confirm':
                style = 'primary'
                break;
                default:
                style = 'default';
                break;
              }
              if (operation == 'ship' && this.state.model.logistics_status == 'shipped') {
                buttonText = lang('order.edit_tracking_number');
              }
              return (<Button key={operation} block bsStyle={style} onClick={this.handleOperationClick.bind(this, operation)}>{buttonText}</Button>);
            })}
          </div>
        </div>
      ) : null}
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">{lang('order.logs')}</h3>
          </div>
          <div className="box-body" style={{padding:"0px 10px"}}>
              <ul className="list-unstyled order-logs">
                  {this.state.logs.length > 0 ? this.state.logs.map((log, i)=>{
                    return (
                      <li key={i}>
                        <h3><strong>{lang('order.operations.' + log.do)}:</strong>&nbsp;{log.comment||lang('order.comment_empty')}</h3>
                        <div className="meta">
                          <span className="datetime">{moment(log.created_at).fromNow()}</span>
                          <Link to="users.show" params={{id:0}} className="pull-right">@{log.name}</Link>
                        </div>
                        <div className="clearfix"></div>
                      </li>
                    );
                  }) : (<li className="text-center">{lang('order.logs_empty')}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Loader>
    );
  }
}
class Form extends BlankLayoutPage { }

class Edit extends ModalFormLayoutPage {
  get modalTitle(){
    return lang('order.edit_consignee');
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" value={this.state.model.id} name="id" groupClassName="hide" />
        <Input
          type="text"
          label={lang('address.consignee')}
          required
          valueLink={this.linkStateDeep('model.logistics_consignee')}
          name="logistics_consignee" />
        <Input
          type="text"
          label={lang('address.region')}
          required
          valueLink={this.linkStateDeep('model.logistics_region')}
          name="logistics_region" />
        <Input
          type="text"
          label={lang('address.zipcode')}
          valueLink={this.linkStateDeep('model.logistics_zipcode')}
          name="logistics_zipcode" />
        <Input
          type="text"
          label={lang('address.address')}
          required
          valueLink={this.linkStateDeep('model.logistics_address')}
          name="logistics_address" />
        <Input
          type="text"
          label={lang('address.mobile')}
          required
          valueLink={this.linkStateDeep('model.logistics_mobile')}
          name="logistics_mobile" />
        <Input
          type="text"
          label={lang('address.phone')}
          valueLink={this.linkStateDeep('model.logistics_phone')}
          name="logistics_phone" />
        <Input
          type="text"
          label={lang('address.email')}
          required
          valueLink={this.linkStateDeep('model.logistics_email')}
          name="logistics_email" />
      </div>
    );
  }
}

class OperationModal extends ModalFormLayoutPage {
  get operationName(){
    return '';
  }
  get operationNote(){
    return lang('order.dangerous_warning');
  }
  componentWillReceiveProps(p, s){
    this.setState({...p.parentState});
  }
  handleSubmit(model, reset, invalid){
    this.context.parent.model.api.update(this.props.params.id + '/' + this.operationName, model).done((data, status, xhr)=>{
      this.hideAndRefresh(lang('submit_successfully'));
    }).error(this.handleError.bind(this));
  }
  get modalTitle(){
    return lang('order.operations.' + this.operationName);
  }
  renderFormBody(form = null){
    return (
      <div>
        <div className="callout callout-info" style={{marginBottom: "10px"}}>
          <h4><i className="fa fa-info"></i> Note:</h4>
          {this.operationNote}
        </div>
        {form}
        <Input type="textarea" name="comment" label={lang('order.comment')} />
      </div>
    );
  }
}

class Cancel extends OperationModal {
  get operationName(){
    return 'cancel';
  }
}
class Pay extends OperationModal {
  get operationName(){
    return 'pay';
  }
  renderFormBody(){
    return super.renderFormBody(
      <div>
        <Input type="text" label={lang('order.total_paid')} required name="total_amount" value={this.state.model.total_amount} />
      </div>
    );
  }
}
class Confirm extends OperationModal {
  get operationName(){
    return 'confirm';
  }
}
class Ship extends OperationModal {
  get operationName(){
    return 'ship';
  }
  renderFormBody(){
    return super.renderFormBody(
      <div>
        <Input type="text" label={lang('order.tracking_number')} required name="tracking_number" value={this.state.model.logistics_tracking_number} />
      </div>
    );
  }
}
class Complete extends OperationModal {
  get operationName(){
    return 'complete';
  }
}

class Refund extends OperationModal {
  get operationName(){
    return 'refund';
  }
  handleQuantityChange(product, quantity, e){
    if (quantity > product.returnable) {
      console.error('overflow');
    } else {
      this.refs['total_amount'].setValue(product.price * quantity);
    }
  }
  renderFormBody(){
    var products = this.state.products || this.context.parent.state.products || [];
    return super.renderFormBody(
      <div>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>{lang('product.name')}</th>
              <th width="100">{lang('order.quantity')}</th>
              <th width="100">{lang('refund.quantity')}</th>
              <th width="100">{lang('quantity')}</th>
            </tr>
            {products.map((product, i)=>{
              return (
                <tr key={i}>
                  <td><Image src={product.cover} size={[32, 32]} />{product.product_name}&nbsp;{product.option}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-center">{product.returned}</td>
                  <td className="text-center">
                    <Input type="hidden" groupClassName="hide" name={"products."+i+".order_product_id"} value={product.id} />
                    <Input
                      type="text"
                      onChange={this.handleQuantityChange.bind(this, product)}
                      name={"products."+i+".quantity"} />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className="text-right">
                <strong>{lang('order.total_amount')}:</strong>
              </td>
              <td colSpan="3" className="text-right">
                {price(this.state.model.subtotal_product)}&nbsp;({lang('order.subtotal_product')})&nbsp;&nbsp;+&nbsp;&nbsp;
                {price(this.state.model.subtotal_logistics)}&nbsp;({lang('order.subtotal_logistics')})&nbsp;&nbsp;=&nbsp;&nbsp;
                <b>{price(this.state.model.total_amount)}</b>
              </td>
            </tr>
            <tr>
              <td className="text-right">
                <strong>{lang('order.refundable_amount')}:</strong>
              </td>
              <td colSpan="3" className="text-right">
                {price(this.state.model.subtotal_product)}&nbsp;({lang('order.subtotal_product')})&nbsp;&nbsp;-&nbsp;&nbsp;
                {price(this.state.model.total_refunded)}&nbsp;({lang('order.total_refunded')})&nbsp;&nbsp;=&nbsp;&nbsp;
                <b>{price(this.state.model.total_refundable)}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <Input
          type="text"
          ref="total_amount"
          readOnly={this.state.model.order_status == 'completed' ? false : true}
          label={lang('refund.total_amount')}
          name="total_amount" />
        <Input type="text" label={lang('refund.reason')} name="reason" />
      </div>
    );
  }
}

export default {Index, Show, Form, Edit, Cancel, Confirm, Complete, Pay, Ship, Refund};
