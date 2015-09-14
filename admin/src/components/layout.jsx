import {Component, Page} from './component';
import Breadcrumb from './breadcrumb';
import Alert from './alert';
import {Message} from './modal';
import {Table, Column, ColumnContent} from './table';
import Pager from './pager';
import Loader from './loader';
import {Form, Input, Select, Button} from './form';

var {Modal} = ReactBootstrap;
var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class BlankLayoutPage extends Page {
  get breadcrumb(){
    return {
      title: 'Title',
      subtitle: 'Subtitle',
      paths: [
        {text:'Home', icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:'Current'}
      ]
    };
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      message:null,
      model:{},
      loaded: false,
    };
  }
  handleError(err){
    console.error(err);
    try {
      if (err.status == 401) {
        return this.context.router.transitionTo('signin');
      }
    } catch (e) { }
    this.refs.alert.error(err.toString());
  }
  renderContent(){
    return;
  }
  reloadData(){

  }
  refreshWithMessage(message = null){
    this.reloadData();
    if (message) {
      this.refs.alert.success(message);
    }
  }
  renderLayout(){
    return (
      <section className="content">
        <Message ref="message" />
        <Alert ref="alert" message={this.state.message} />
        {this.renderContent()}
      </section>
    );
  }
  render(){
    return (
      <div className="content-wrapper">
        <Breadcrumb {...this.breadcrumb} />
        {this.renderLayout()}
        <RouteHandler parentState={this.state} />
        <div className="clearfix"></div>
      </div>
    );
  }
}

class TableLayoutPage extends BlankLayoutPage {
  get tableTitle(){
    return "Table Title";
  }
  constructor (props, context) {
    super(props, context);
    var sort = {};
    this.state = {
      message: null,
      table:{
        loaded: false,
        rows: [],
        rowParsed: false,
        total:0
      },
      query:{
        per_page:15,
        q:props.query.q || null,
      }
    };
  }
  transformSortToState(sort_text){
    var sort = {};
    if (sort_text) {
      var [field, direction] = sort_text.split(' ');
      sort[field] = direction;
    }
    return sort;
  }
  getBreadcrumbProps(){}
  componentWillMount(){
    this.loadTableRows(this.context.router.getCurrentQuery());
  }
  componentWillUpdate(){
    this.lastRouteName   = this.currentRoute.name;
  }
  componentWillReceiveProps(nextProps, nextState){
    if (
      (this.model.routeName  == this.currentRoute.name && this.model.routeName  == this.lastRouteName) ||
      (this.model.routeAlias == this.currentRoute.name && this.model.routeAlias == this.lastRouteName)
    ) {
      if (!_.eq(nextProps, this.props)) {
        this.loadTableRows(nextProps.query);
      }
    }
  }
  reloadData(){
    this.loadTableRows(this.context.router.getCurrentQuery());
  }
  loadTableRows(query = {}){
    if (this.state.table.loaded === true) {
      this.setState(update(this.state, {
        table:{
          loaded:{$set:false}
        }
      }));
    }
    query = Object.assign({ per_page:this.state.query.per_page }, query);
    this.fetchRows(query).then((data)=>{
      var {rows, total} = data;
        this.setState(update(this.state, {
          table:{
            rows:{$set:rows},
            total:{$set:total},
            loaded:{$set:true},
          }
        }));
    }).catch(this.handleError.bind(this));
  }
  fetchRows(query = null){
    return new Promise((resolve, reject)=>{
      this.model.api.read(Object.assign({page:this.context.router.getCurrentQuery().page || 1}, query || {}))
        .done((data, status, xhr)=>{
        resolve({
          rows:data,
          total:xhr.getResponseHeader('X-Total-Count')
        });
      }).error(reject);
    });
  }
  removeRow(row){
    return new Promise((resolve, reject)=>{
      this.model.api.destroy(row.id).done((data, status, xhr)=>{
        resolve(data);
      }).error(reject);
    });
  }
  getTableColumns(){
    return [
        <Column key="col1" checkable="id" width="30"></Column>,
        <Column key="col2" head={lang('name')}>{ColumnContent.field('name')}</Column>,
        <Column key="col3" head={lang('operations')} width="150" className="text-center">{this.renderTableRowActions.bind(this)}</Column>
    ];
  }
  handleSortClick(field, direction){
    this.context.router.transitionTo(
      this.currentRoute.name,
      this.props.params,
      Object.assign(_.clone(this.props.query), {sort:field, order: direction})
    );
  }
  handleTableFilterSubmit(model, reset, invalid){
    var f = model.f ? _.pick(model.f, _.identity) : undefined;
    var query = Object.assign(_.clone(this.props.query), model, {f});
    console.log(query);
    this.context.router.transitionTo(
      this.currentRoute.name,
      this.props.params,
      _.pick(query, _.identity)
    );
  }
  handleRowEditClick(row, e){
    this.context.router.transitionTo(this.model.routeName + '.edit', row);
  }
  handleRowDeleteClick(row, e){
    this.refs.message.confirm(lang('delete_confirm'), this.handleRowDeleteOK.bind(this, row));
  }
  handleRowDeleteOK(row, hide, e){
    this.removeRow(row).then((data)=>{
      hide();
      this.refreshWithMessage("删除 #" + row.id + " 成功!");
    }).catch((err)=>{
      console.error(err);
      hide();
      this.refs.alert.error(err);
    });
  }
  handleTableBatchSubmit(model, reset, invalid){
    var checked = this.refs.table.getCheckedRows();
    if (checked.length === 0) {
      return this.refs.message.error(lang('batch_items_empty'));
    }
    if (model.action == 'none') {
      return this.refs.message.error(lang('batcn_action_empty'));
    }
    var methodName = 'handleBatch' + _.capitalize(model.action) + 'Click';
    if (this[methodName]) {
      this[methodName].call(this, checked);
    } else {
      this.refs.message.error(lang('batcn_action_not_implement'));
    }
  }
  handleBatchDeleteClick(rows){
    this.refs.message.confirm(lang('delete_confirm'), this.handleBatchDeleteOK.bind(this, rows));
  }
  handleBatchDeleteOK(ids, hide){
    var rows = _.filter(this.state.table.rows, (row)=>{return _.contains(ids, row.id.toString());});
    async.each(rows, (row, cb)=>{
      this.removeRow(row).then(cb.bind(this, null)).catch(cb);
    }, (err)=>{
      hide();
      this.refreshWithMessage('已成功删除后列项目 ' + _.map(ids, (id)=>{return '#' + id + "\n";}).join(','));
    });
  }
  handleTableBatchClick(){
    this.refs.batch.submit();
  }
  renderTableFilter(){
    return (
      <Formsy.Form onSubmit={this.handleTableFilterSubmit.bind(this)} className="form-inline" ref="filter">
        {this.renderTableFilterInputs()}
      </Formsy.Form>
    );
  }
  renderTableFilterInputs(){
    return (
      <Input
        buttonAfter={<Button type="submit" className="btn-flat"><i className="fa fa-search"></i></Button>}
        name="q"
        type="text"
        valueLink={this.linkStateDeep('query.q')}
        labelClassName="hide"
        className="form-control"
        placeholder={lang('keywords')} />
    );
  }
  renderTableMenu(){
    return (
      <div className="text-right" ref="menus">
        <Link className="btn btn-primary" to={this.model.routeName+'.create'}><i className="fa fa-plus"></i>&nbsp;{lang('create')}</Link>
      </div>
    );
  }
  renderTableBody(props){
    return (
      <Loader loaded={this.state.table.loaded} className="table">
        <Table rows={this.state.table.rows} className="table table-bordered table-striped" {...props} ref="table">
          {this.getTableColumns()}
        </Table>
      </Loader>
    );
  }
  renderTableRowActions(row){
    return (
      <div>
        <Button bsSize="small" onClick={this.handleRowEditClick.bind(this, row)}><i className="fa fa-pencil"></i>&nbsp;&nbsp;{lang('edit')}</Button>
        &nbsp;&nbsp;
        <Button bsSize="small" bsStyle="danger" onClick={this.handleRowDeleteClick.bind(this, row)}><i className="fa fa-trash"></i>&nbsp;&nbsp;{lang('delete')}</Button>
      </div>
    );
  }
  renderTableBatch(options = [{value:'delete', label:lang('delete')}]){
    return (
      <Formsy.Form className="form-inline" onSubmit={this.handleTableBatchSubmit.bind(this)} ref="batch">
        <Input name="action" type="select" value={this.props.query.status} labelClassName="hide">
          <option value="">{lang('batch_action')}</option>
          {options.map((option, idx)=>{
            return <option value={option.value} key={idx}>{option.label}</option>;
          })}
        </Input>
        &nbsp;&nbsp;
        <Button onClick={this.handleTableBatchClick.bind(this)}>
          <i className="fa fa-check-square"></i>&nbsp;{lang('apply')}
        </Button>
      </Formsy.Form>
    );
  }
  renderTablePager(){
    return <Pager current={this.context.router.getCurrentQuery().page || 1} total={this.state.table.total} perPage={this.state.query.per_page} ref="pager" />;
  }
  renderContent(){
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title" ref="table_title">{this.tableTitle}</h3>
            </div>
            <div className="box-body">
              <div className="row">
                <div className="col-sm-8">
                  {this.renderTableFilter()}
                </div>
                <div className="col-sm-4 text-right">
                  {this.renderTableMenu()}
                </div>
              </div>
              {this.renderTableBody()}
              <div className="row">
                <div className="col-sm-6">
                  {this.renderTableBatch()}
                </div>
                <div className="col-sm-6 text-right">
                  {this.renderTablePager()}
                </div>
              </div>
            </div> {/*box-body*/}
          </div> {/*box*/}
        </div> {/*col*/}
      </div>
    );
  }
}

/**
 * Modal Form Layout
 */
class ModalFormLayoutPage extends Page {
  static get contextTypes(){
    return _.extend({
      parent: React.PropTypes.object.isRequired
    }, super.contextTypes || {});
  }
  get modalTitle(){
    return 'Title';
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      title: 'Form',
      show: true,
      pending:false,
      model:{}
    };
  }
  componentDidMount(){
    if (this.props.params.id) {
      this.fetchRow(this.props.params.id).then((data, status, xhr)=>{
        this.setState({
          model:data
        });
      }).catch(this.handleError.bind(this));
    }
  }
  handleError(err){
    this.setState({pending:false});
    if (err) {
      this.refs.alert.error(err);
    }
  }
  handleHide(){
    this.setState({show:false});
    if (!this.context.router.goBack()) {
      this.context.router.transitionTo(
        this.context.parent.model.routeName,
        this.context.parent.props.params,
        this.context.parent.props.query
      );
    }
  }
  hideAndReturn(){
    this.handleHide();
    if (!this.context.router.goBack()) {
      this.context.router.transitionTo(
        this.context.parent.model.routeName,
        this.context.parent.props.params,
        this.context.parent.props.query
      );
    }
  }
  hideAndRefresh(message = null){
    this.setState({pending:false}, ()=>{
      this.handleHide();
      this.context.parent.refreshWithMessage(message);
    });
  }
  getModalProps(){
    return {};
  }
  renderFormBody(){
    return (
        <Input name="test" type="text" valueLink={this.linkState('title')} />
    );
  }
  renderFormButtons(){
    return (
      <div>
        <Button className="pull-left" onClick={this.handleHide.bind(this)}>{lang('cancel')}</Button>
        <Button pending={this.state.pending} onClick={this.handleSubmitClick.bind(this)} bsStyle="primary"><i className="fa fa-check"></i>&nbsp;&nbsp;{lang('submit')}</Button>
      </div>
    );
  }
  fetchRow(id){
    return new Promise((resolve, reject)=>{
      this.context.parent.model.api.read(id).done((data, status, xhr)=>{
        resolve(data);
      }).error(reject);
    });
  }
  createRow(model){
    return new Promise((resolve, reject)=>{
      this.context.parent.model.api.create(model).done((data, status, xhr)=>{
        resolve(data);
      }).error(reject);
    });
  }
  updateRow(id, model){
    return new Promise((resolve, reject)=>{
      this.context.parent.model.api.update(id, model).done((data, status, xhr)=>{
        resolve(data);
      }).error(reject);
    });
  }
  handleSubmit(model, reset, invalid){
    this.setState({pending:true});
    var id = model.id;
    var promise = id ? this.updateRow(id, model) : this.createRow(model);
    promise
      .then(this.hideAndRefresh.bind(this, lang('submit_successfully')))
      .catch(this.handleError.bind(this));
  }
  handleSubmitClick(){
    this.refs.form.touch();
    this.refs.form.submit();
  }
  render(){
    return (
      <Modal show={this.state.show} backdrop={false} onHide={this.handleHide.bind(this)} {...this.getModalProps()}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert ref="alert" />
          <Form onValidSubmit={this.handleSubmit.bind(this)} ref="form">
            {this.renderFormBody()}
            <button type="submit" className="hide"></button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {this.renderFormButtons()}
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = {BlankLayoutPage, TableLayoutPage, ModalFormLayoutPage};
