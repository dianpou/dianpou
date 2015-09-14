import {SidePage, SideTablePage, Modal} from './components/layout';
import {Button} from './components/form';
import {Table, Column} from 'lib/table';
import {lang, price, date} from 'lib/intl';

export class Index extends SideTablePage {
  get meta(){
    return {
      title:lang('home.refunds'),
      resource:'refunds',
    };
  }
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang('home.refunds'),
      paths:[
        {text:lang('home.name'), icon:"fa fa-home", href:"/home"},
        {text:lang('home.refunds'), href:"/home/refunds"},
      ]
    });
    return super.componentWillMount();
  }
  renderTableButtons(){return;}
  renderTableColumns(){
    return [
      <Column key="sn" width="120" title="#SN">{row=>(<Link to={"/home/refunds/"+row.sn}>{row.sn}</Link>)}</Column>,
      <Column key="amount" width="80" title={lang('refund.total_amount')}>{row=>price(row.total_amount)}</Column>,
      <Column key="refund_status" width="80" title={lang('refund.status.name')}>{row=>lang('refund.status.' + row.refund_status)}</Column>,
      <Column key="payment_status" width="80" title={lang('refund.status.payment')}>{row=>lang('refund.status.' + row.payment_status)}</Column>,
      <Column key="created_at" width="150" title={lang('created_at')}>{row=>date(row.created_at)}</Column>,
    ];
  }
}

export class Show extends SidePage {
  get initialState(){
    return {
      model:{
        order:{},
        payment:{},
        user:{},
        products:[],
      },
    };
  }
  get meta(){
    return {
      resource:"refunds"
    };
  }
  get template(){
    return this.getTemplate('refund').show;
  }
  refresh(){
    this.model.read(this.props.params.sn).done(data=>this.setState({model:data})).error(this.handleError.bind(this));
  }
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang("home.refunds"),
      paths:[
        {text:lang("home.name"), icon:"fa fa-home", href:"/home"},
        {text:lang("home.refunds"), icon:"fa fa-file-text-o", href:"/home/refunds"},
        {text:this.props.params.sn},
      ]
    }, '/home/refunds');
    this.model.read(this.props.params.sn).done(data=>this.setState({model:data})).error(this.handleError.bind(this));

    return (super.componentWillMount||()=>{})();
  }
}

export class Cancel extends Modal {
  get title(){
    return "取消退款单";
  }
  get template(){
    return this.getTemplate('refund').cancel;
  }
  get footer(){
    return (
      <div>
        <Button className="pull-left" onClick={this.handleHide.bind(this)}>取消</Button>
        <Button bsStyle="primary" onClick={e=>this.refs.form.submit()}>确定</Button>
      </div>
    );
  }
  handleValidSubmit(model, reset, invalid){
    this.props.parent.model.update(this.props.params.sn + '/cancel', model).done((data, status, xhr)=>{
      this.hide(()=>{
        this.props.parent.props.parent.refs.notifier.addNotification({
          level:"success",
          message:lang('submit_successfully')
        });
        this.props.parent.refresh();
      });
    }).error(this.handleError.bind(this));
  }
}

export class Refund extends Modal {
  get title(){
    return lang('refund.refund_and_cancel');
  }
  get template(){
    return this.getTemplate('refund').refund;
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
          message:lang('submit_successfully')
        });
        this.props.parent.refresh();
      });
    }).error(this.handleError.bind(this));
  }
}
