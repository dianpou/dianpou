import {BlankLayoutPage, TableLayoutPage, ModalFormLayoutPage} from 'components/layout';
import {Refunds} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button, DateRangePicker} from '../components/form';
import Image from '../components/image';
import Loader from '../components/loader';

import Alert from '../components/alert';
import {Message} from '../components/modal';
import {lang, price, date} from 'libraries/intl';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;
var {SplitButton, Toolbar, DropdownButton, MenuItem} = ReactBootstrap;
var {FormattedNumber, FormattedMessage} = ReactIntl;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('refund.title'),
      subtitle: lang('refund.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('refund.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('refund.title');
  }
  get model(){
    return {
      routeName: 'refunds',
      routeAlias: 'refunds.index',
      api:       Refunds,
    };
  }
  get langNS(){
    return 'refund';
  }
  handleOperationClick(row, operation, e){
    this.context.router.transitionTo('refunds.' + operation, row);
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column width="120" key="sn" head={lang('refund.sn')} >
          {(row)=>{
            return <Link to="refunds.show" params={row}>{row.sn}</Link>;
          }}
        </Column>,
        <Column key="amount" head={lang('refund.total_amount')} width="120">
          {(row)=>{
            return <FormattedNumber value={row.total_amount} format="cny" />;
          }}
        </Column>,
        <Column key="refund_status" head={lang('refund.refund_status')} width="120">
          {(row)=>{
            return (<span>{lang('refund.status.' + row.refund_status)}</span>);
          }}
        </Column>,
        <Column key="payment_status" head={lang('refund.status.payment')} width="120">
          {(row)=>{
            return (<span>{lang('refund.status.' + row.payment_status)}</span>);
          }}
        </Column>,
        <Column
          key="created_at"
          width="120"
          head={lang('refund.created_at')}
          sortable="created_at"
          current={this.props.query}
          default="desc"
          onSort={this.handleSortClick.bind(this)}>
          {ColumnContent.field('created_at', this.d)}
        </Column>,
        <Column key="updated_at" width="120" head={lang('refund.updated_at')}>
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
  renderTableMenu(){}
  renderTableRowActions(row){
    var operations;
    var available_operations = _.keys(_.omit(row.operations, (v)=>{return v === false;})) || [];
    if (_.contains(['canceled', 'completed'], row.refund_status)) {
      operations = (<Button bsSize="small" className="disabled">{lang('refund.status.completed')}</Button>);
    } else {
      if (available_operations.length === 1) {
        operations = (<Button bsSize="small" onClick={this.handleOperationClick.bind(this, row, available_operations[0])}>{lang('refund.operations.' + available_operations[0])}</Button>);
      } else {
        var first_operation = (
          <span>
            {lang('refund.operations.' + _.first(available_operations))}
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
                {lang('refund.operations.' + operation)}
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
      {value:'pending', label:lang('refund.status.pending')},
      {value:'confirmed', label:lang('refund.status.confirmed')},
      {value:'compoleted', label:lang('refund.status.completed')},
      {value:'canceled', label:lang('refund.status.canceled')},
    ];
    var pickerOptions = {
      locale:{
        format: 'YYYY/MM/DD'
      },
    }
    return (
      <div>
        <Input name="f.refund_status" type="select" value={_.get(this.props, 'query.f.refund_status')} labelClassName="hide">
          <option value="">{lang('refund.status.all')}</option>
          {status_options.map((option, idx)=>{
            return <option value={option.value} key={idx}>{option.label}</option>;
          })}
        </Input>
        &nbsp;&nbsp;
        <DateRangePicker
          name="f.created_at"
          placeholder={lang('refund.filter.date')}
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
    return 'refund';
  }
  get breadcrumb(){
    return {
      title: lang('refund.show'),
      subtitle: '#' + this.state.model.sn,
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('refund.title'), icon: 'fa fa-shopping-cart', href:this.context.router.makeHref('refunds')},
        {text:lang('refund.show')}
      ]
    };
  }
  get model(){
    return {
      routeName: 'refunds.show',
      api: Refunds
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = Object.assign(this.state, {
      model:{user:{}, order:{}},
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
          var [refund, products, logs] = r;
          this.setState({model:refund, products:products, logs:logs, loaded:true});
        }
    });
  }
  handleOperationClick(operation){
    this.context.router.transitionTo('refunds.' + operation, this.props.params);
  }
  renderContent(){
    var operations = this.state.model.operations || {};

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
                      {lang('refund.status.'+this.state.model.refund_status)}
                      <small className="pull-right">{lang('refund.created_at')}:&nbsp;&nbsp;&nbsp;{date(this.state.model.created_at)}</small>
                    </h2>
                  </div>
                </div>
                <div className="row invoice-info">
                <div className="col-sm-4 invoice-col">
                  <b>{lang('refund.order_sn')}&nbsp;&nbsp;&nbsp;#{this.state.model.order.sn}</b><br/>
                  <br/>
                  <b>{lang('order.total_amount')}:</b>&nbsp;&nbsp;&nbsp;{price(this.state.model.order.total_amount)} <br />
                  <b>{lang('order.order_status')}:</b>&nbsp;&nbsp;&nbsp;{lang('order.status.' + this.state.model.order.order_status, null, false)}<br/>
                </div>
                <div className="col-sm-4 invoice-col">
                </div>
                <div className="col-sm-4 invoice-col">
                  <b>{lang('refund.sn')}&nbsp;&nbsp;&nbsp;#{this.state.model.sn}</b><br/>
                  <br/>
                  <b>{lang('refund.user_id')}:</b>&nbsp;&nbsp;&nbsp;
                  <Link to="users.show" params={{id:this.state.model.user_id}}>
                    @{this.state.model.user.nickname}
                  </Link>
                  <br />
                  <b>{lang('refund.id')}:</b>&nbsp;&nbsp;&nbsp;{this.state.model.id}<br/>
                </div>
                </div>


              <div className="row">
                <div className="col-xs-12 table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{lang('product.name')}</th>
                        <th width="130">{lang('product.sku')}</th>
                        <th width="90">{lang('product.price')}</th>
                        <th width="90">{lang('refund.quantity')}</th>
                        <th width="90">{lang('refund.subtotal')}</th>
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
                                    <Image size="mini" src={product.product.cover} />
                                  </a>
                                </div>
                                <div className="media-body" style={{width:'auto'}}>
                                  <h4 className="media-heading">{product.product.product_name}</h4>
                                  {product.product.option}
                                </div>
                              </div>
                            </td>
                            <td vAlign="middle">{product.product.sku}</td>
                            <td>{price(product.product.price)}</td>
                            <td>{product.quantity}</td>
                            <td>{price(product.product.price * product.quantity)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="row">

                <div className="col-xs-6">
                  <p className="lead">{lang("refund.payment")}</p>
                  <p>
                    <b>{lang('refund.status.payment')}:</b>&nbsp;&nbsp;{lang('refund.status.'+this.state.model.payment_status)}<br/>
                    <b>{lang('refund.payment_time')}:</b>&nbsp;&nbsp;{date(this.state.model.payment_time) || 'N/A'}<br/>
                  </p>
                </div>
                <div className="col-xs-6">
                  <p className="lead">{lang('refund.check_amount')}</p>
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>{lang('refund.total_amount')}</th>
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
      {!_.contains(['canceled', 'completed'], this.state.model.refund_status) ? (
        <div className="box">
          <div className="box-body">
            {_.keys(this.state.model.operations).map((k, i) => {
              var v = this.state.model.operations[k];
              var operation = k;
              if (v && k != 'edit') {
                var style;
                var buttonText = lang('refund.operations.' + k);
                switch (k) {
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
                if (k == 'ship' && this.state.model.logistics_status == 'shipped') {
                  buttonText = lang('refund.edit_tracking_number');
                }
                return <Button key={k} block bsStyle={style} onClick={this.handleOperationClick.bind(this, operation)}>{buttonText}</Button>
              }
            })}
          </div>
        </div>
      ) : null}
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">{lang('refund.logs')}</h3>
          </div>
          <div className="box-body" style={{padding:"0px 10px"}}>
              <ul className="list-unstyled order-logs">
                  {this.state.logs.length > 0 ? this.state.logs.map((log, i)=>{
                    return (
                      <li key={i}>
                        <h3><strong>{lang('refund.operations.' + log.do)}:</strong>&nbsp;{log.comment||lang('refund.comment_empty')}</h3>
                        <div className="meta">
                          <span className="datetime">{moment(log.created_at).fromNow()}</span>
                          <Link to="users.show" params={{id:0}} className="pull-right">@{log.name}</Link>
                        </div>
                        <div className="clearfix"></div>
                      </li>
                    );
                  }) : (<li className="text-center">{lang('refund.logs_empty')}</li>)}
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

class OperationModal extends ModalFormLayoutPage {
  get operationName(){
    return '';
  }
  get operationNote(){
    return lang('refund.dangerous_warning');
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
    return lang('refund.operations.' + this.operationName);
  }
  renderFormBody(form = null){
    return (
      <div>
        <div className="callout callout-info" style={{marginBottom: "10px"}}>
          <h4><i className="fa fa-info"></i> Note:</h4>
          {this.operationNote}
        </div>
        {form}
        <Input type="textarea" name="comment" label={lang('refund.comment')} />
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
        <Input type="text" label={lang('refund.total_paid')} required name="total_amount" value={this.state.model.total_amount} />
      </div>
    );
  }
}
class Confirm extends OperationModal {
  get operationName(){
    return 'confirm';
  }
}

class Complete extends OperationModal {
  get operationName(){
    return 'complete';
  }
}

class Refund extends OperationModal {
  get operationName(){
    return 'complete';
  }
}

export default {Index, Show, Form, Cancel, Confirm, Complete, Pay, Refund};
