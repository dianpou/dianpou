import {SidePage, SideTablePage, Modal} from './components/layout';
import {Button} from './components/form';
import {Table, Column} from 'lib/table';
import {lang, price, date} from 'lib/intl';

export class Index extends SideTablePage {
  get meta(){
    return {
      title:lang('home.name'),
      resource:'orders',
    };
  }
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang('home.name'),
      paths:[
        {text:lang("home.name"), icon:"fa fa-home", href:"/home"},
        {text:lang("home.orders"), href:"/home/orders"},
      ]
    });
    return super.componentWillMount();
  }
  renderTableColumns(){
    return [
      <Column key="sn" width="120" title="#SN">{row=>(<Link to={"/home/orders/"+row.sn}>{row.sn}</Link>)}</Column>,
      <Column key="amount" width="120" title={lang('order.total_amount')}>{row=>price(row.total_amount)}</Column>,
      <Column key="order_status" width="120" title={lang('order.status.name')}>{row=>lang('order.status.' + row.order_status)}</Column>,
      <Column key="payment_status" width="120" title={lang('order.status.payment')}>{row=>lang('order.status.' + row.payment_status)}</Column>,
      <Column key="logistics_status" title={lang('order.consignee')}>{row=>(<div>{row.logistics_consignee}&nbsp;({row.logistics_mobile})</div>)}</Column>,
      <Column key="created_at" width="150" title={lang('created_at')}>{row=>date(row.created_at)}</Column>,
    ];
  }
}

export class Show extends SidePage {
  get initialState(){
    return {
      model:{
        logistics:{},
        payment:{},
        user:{},
        products:[],
      },
    };
  }
  get meta(){
    return {
      resource:"orders"
    };
  }
  get template(){
    return this.getTemplate('order').show;
  }
  refresh(){
    this.model.read(this.props.params.sn).done(data=>this.setState({model:data})).error(this.handleError.bind(this));
  }
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang("home.orders"),
      paths:[
        {text:lang("home.name"), icon:"fa fa-home", href:"/home"},
        {text:lang("home.orders"), icon:"fa fa-file-text-o", href:"/home/orders"},
        {text:this.props.params.sn},
      ]
    }, '/home/orders');
    this.model.read(this.props.params.sn).done(data=>this.setState({model:data})).error(this.handleError.bind(this));

    return (super.componentWillMount||()=>{})();
  }
}

export class Cancel extends Modal {
  get title(){
    return lang('order.cancel');
  }
  get template(){
    return this.getTemplate('order').cancel;
  }
  get footer(){
    return (
      <div>
        <Button className="pull-left" onClick={this.handleHide.bind(this)}>{lang('cancel')}</Button>
        <Button bsStyle="primary" onClick={e=>this.refs.form.submit()}>{lang('confirm')}</Button>
      </div>
    );
  }
  handleValidSubmit(model, reset, invalid){
    this.props.parent.model.update(this.props.params.sn + '/cancel', model).done((data, status, xhr)=>{
      this.hide(()=>{
        this.props.parent.props.parent.refs.notifier.addNotification({
          level:"success",
          message:lang('order.cancel.ok')
        });
        this.props.parent.refresh();
      });
    }).error(this.handleError.bind(this));
  }
}

export class Refund extends Modal {
  get title(){
    return lang('order.cancel.name');
  }
  get template(){
    return this.getTemplate('order').refund;
  }
  get footer(){
    return (
      <div>
        <Button className="pull-left" onClick={this.handleHide.bind(this)}>{lang('cancel')}</Button>
        <Button bsStyle="primary" onClick={e=>this.refs.form.submit()}>{lang('confirm')}</Button>
      </div>
    );
  }
  handleValidSubmit(model, reset, invalid){
    this.props.parent.model.update(this.props.params.sn + '/refund', model).done((data, status, xhr)=>{
      this.hide(()=>{
        this.props.parent.props.parent.refs.notifier.addNotification({
          level:"success",
          message:lang('order.refund.ok')
        });
        this.props.parent.refresh();
      });
    }).error(this.handleError.bind(this));
  }
}
