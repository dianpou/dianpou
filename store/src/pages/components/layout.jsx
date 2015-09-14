import Page from './page';
import {Table, Column} from 'lib/table';
import {Button} from 'react-bootstrap';
import Pager from './pager';
import {Form, Input} from './form';
import config from 'config';

var {update} = React.addons;

export class Topnav extends Page {
  get displayChildren(){
    return true;
  }
  get user(){
    return window.User;
  }

  get navs(){
    return this.state.navs.map((nav)=>{
      return {text:nav.title, href:nav.pathname};
    }) || [];
  }

  get bags(){
    return this.state.bags.items;
  }

  constructor(...args){
    super(...args);
    this.state = Object.assign(this.state||{}, {
      model:{},
      bags:{loaded:false, items:[]},
      navs:[],
    });
  }

  getChildContext(){
    return super.getChildContext();
  }
  getTrackingCode(){
    return config.tracking_code;
  }

  componentWillMount(){
    this.loadBags();
    this.loadNavs();
  }

  componentDidMount(){
    $('#tracking_code').html(config.tracking_code);
  }

  loadNavs(){
    return new Promise((resolve, reject)=>{
      this.api.pages.read({f:{position:'nav'}}).done((navs, status, xhr)=>{
        this.setState({ navs }, ()=>{
          resolve(navs);
        });
      }).error((err)=>{
        this.handleError(err);
        reject(err);
      });
    });
  }

  loadBags(){
    this.setState(update(this.state.bags, {loaded:{$set:false}}))
    return new Promise((resolve, reject)=>{
      this.api.bags.read().done((data, status, xhr)=>{
        this.setState({
          bags: {items:data, loaded:true}
        }, ()=>{
          resolve(data)
        });
      }).error((err)=>{
        this.handleError(err);
        reject(err);
      });
    });
  }


  handleError(err){
    console.log(err);
    var msg = err;
    try {
      msg = err.responseJSON.message;
    } catch (e) {}
    this.refs.notifier.addNotification({
      message: msg,
      level: 'error',
    });
  }

  render(){
    return this.getTemplate('layout/topnav').call(this);
  }
}

export class Sidenav extends Topnav {
  get disableChildren(){
    return true;
  }
  renderChildren(){
    return React.cloneElement(this.props.children, {parent:this, ref:"children"});
  }
  get template(){
    return this.getTemplate('layout/sidenav').bind(this);
  }
  get meta(){
    return {
      title: 'Title',
      subtitle: 'Subtitle meta',
      paths:[]
    };
  }
}

export class SidePage extends Page {
  render(){
    return this.template.call(this);
  }
}

export class SideTablePage extends SidePage {
  get initialState(){
    return {
      table:{
        loaded: false,
        rows:[],
        total:0,
        per_page:15,
      },
      query:{
        q: _.get(this.props.location, 'query.q'),
        page: _.get(this.props.location, 'query.page'),
      }
    };
  }
  get template(){
    return this.getTemplate('layout/sidetable').bind(this);
  }
  componentWillMount(){
    this.loadTableRows(this.props.location.query);
  }
  componentWillReceiveProps(nextProps, nextState){
    if (this.props.location.pathname == nextProps.location.pathname) {
      if (!_.eq(nextProps.location.query, this.props.location.query)) {
        this.loadTableRows(nextProps.location.query);
      }
    }
  }
  refresh(){
    this.loadTableRows(this.props.location.query);
  }
  loadTableRows(query){
    query = query;
    this.setState(update(this.state, {
      table:{
        loaded:{$set: false}
      }
    }));
    this.model.read(query||'').done((rows, status, xhr)=>{
      this.setState(update(this.state, {
        table:{
          loaded:{$set: true},
          rows: {$set:rows},
          total:{$set: xhr.getResponseHeader('X-Total-Count')}
        }
      }));
    }).error(this.handleError.bind(this));
  }
  handleFilterSubmit(model, reset, invalid){
    var f = model.f ? _.pick(model.f, _.identity) : undefined;
    var query = Object.assign(_.clone(this.props.location.query) || {}, model, {f});
    this.context.router.transitionTo(
      this.props.location.pathname,
      _.pick(query, _.identity)
    );
  }
  handleRowDeleteClick(row, e){
    this.refs.message.confirm(lang('delete_confirm'), this.handleRowDeleteOK.bind(this, row));
  }
  handleRowDeleteOK(row, hide, e){
    this.model.del(row.id).done(data=>{
      hide();
      this.refs.notifier.addNotification({
        message:"删除成功",
        level:"success"
      });
      this.refresh();
    }).error((err)=>{
      hide();
      this.handleError(err);
    });
  }
  renderTableColumns(){
    return (
      <Column title="name">{row=>row.name}</Column>
    );
  }
  renderTableBatch(){
    return;
  }
  renderTableButtons(){
    return (
      <div className="pull-right">
        <Link to="/home/addresses/create" className="btn btn-primary btn-sm btn-flat"><i className="fa fa-plus"></i>&nbsp;{lang('create')}</Link>
      </div>
    );
  }
  renderTableFilter(){
    return (
      <Form className="form-inline" onSubmit={this.handleFilterSubmit.bind(this)}>
        <Input
          bsSize="small"
          name="q"
          type="text"
          valueLink={this.linkStateDeep('query.q')}
          placeholder="Keywords" />
        &nbsp;
        <Button type="submit" bsSize="small"><i className="fa fa-search"></i></Button>
      </Form>
    );
  }
  renderTableRowActions(row){
    return (
      <div>
        <Link className="btn btn-default btn-sm" to={this.props.location.pathname + '/' + row.id}><i className="fa fa-pencil"></i>&nbsp;&nbsp;{lang('edit')}</Link>
        &nbsp;&nbsp;
        <Button bsSize="small" bsStyle="danger" onClick={this.handleRowDeleteClick.bind(this, row)}><i className="fa fa-trash"></i>&nbsp;&nbsp;{lang('delete')}</Button>
      </div>
    );
  }
  renderTablePager(){
    return <Pager style={{margin:"0px"}} location={this.props.location} current={_.get(this.props.location, 'query.page')} total={this.state.table.total} perPage={this.state.table.per_page} ref="pager" />;
  }
}

export class Modal extends Page {
  get title(){
    return "Modal Title";
  }
  get modalProps(){
    return Object.assign({
      backdrop:false
    }, this.props);
  }
  get footer(){
    return (
      <Button onClick={this.handleHide.bind(this)}>Close</Button>
    );
  }
  componentWillMount(){
    var id = this.props.params.id;
    if (id) {
      this.props.parent.model.read(id).done(data=>{
        this.setState({
          model:data
        });
      }).error(this.handleError.bind(this));
    }
  }
  handleError(err){
    console.log(err);
    var msg = err;
    try {
      msg = err.responseJSON.message;
    } catch (e) {}
    this.props.parent.refs.notifier.addNotification({
      message: msg,
      level: 'error',
    });
  }
  handleHide(e){
    this.hide();
  }
  handleSubmit(model, reset, invalid){
    this.refs.form.touch();
  }
  handleValidSubmit(model, reset, invalid){
    var id = this.props.params.id, verb;
    if (id) {
      verb = this.props.parent.model.update(id, model);
    } else {
      verb = this.props.parent.model.create(model);
    }
    verb.done((data)=>{
      this.hide(()=>{
        this.props.parent.refs.notifier.addNotification({
          level:"success",
          message:lang('submit_successfully'),
        });
        this.props.parent.refresh();
      });
    }).error((err)=>{
      invalid(err.responseJSON.errors);
      this.handleError(err);
    });
  }
  hide(cb){
    // console.log(this.props.parent);
    // this.context.router.transitionTo(this.props.parent.props.location.pathname, this.props.parent.props.location.query);
    this.context.router.goBack();
    cb && cb();
  }

  render(){
    return this.getTemplate('layout/modal').call(this);
  }
  renderModalBody(){
    return this.template.call(this);
  }
}
