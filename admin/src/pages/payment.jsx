import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Payments} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('payment.title'),
      subtitle: lang('payment.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('payment.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('payment.title');
  }
  get model(){
    return {
      routeName: 'payments',
      api:       Payments,
    };
  }
  handleRowStatusChange(id, e){
    this.model.api.update(id, {status:e.target.checked ? 'enabled' : 'disabled'}).done().error(this.handleError.bind(this));
  }
  handleBatchEnableClick(rows){
    this.refs.message.confirm(lang('batch_enable_confirm'), this.handleBatchEnableOK.bind(this, rows));
  }
  handleBatchEnableOK(ids, hide){
    this.batchStatusChange(ids, 'enabled').then(()=>{
      hide();
      this.refreshWithMessage('批量启用成功 ' + _.map(ids, (id)=>{return '#' + id + "\n";}).join(','));
    }).catch(this.handleError.bind(this));
  }
  handleBatchDisableClick(rows){
    this.refs.message.confirm(lang('batcn_disable_confirm'), this.handleBatchDisableOK.bind(this, rows));
  }
  handleBatchDisableOK(ids, hide){
    this.batchStatusChange(ids, 'disabled').then(()=>{
      hide();
      this.refreshWithMessage('批量禁用成功 ' + _.map(ids, (id)=>{return '#' + id + "\n";}).join(','));
    }).catch(this.handleError.bind(this));
  }
  batchStatusChange(ids, status){
    return new Promise((resolve, reject)=>{
      async.each(ids, (id, cb)=>{
        this.model.api.update(id, {status:status}).done(cb.bind(this, null)).error(cb);
      }, (err)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  renderTableBatch(options){
    return super.renderTableBatch([
      {value:"delete", label:lang('delete')},
      {value:"enable", label:lang('enable')},
      {value:"disable", label:lang('disable')},
    ]);
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column
          key="payment_name"
          sortable="payment_name"
          current={this.props.query}
          onSort={this.handleSortClick.bind(this)}
          head={lang('payment.name')}
          width="150">
          {ColumnContent.field('payment_name')}
        </Column>,
        <Column
          key="payment_desc"
          head={lang('payment.desc')}>
          {ColumnContent.field('payment_desc')}
        </Column>,
        <Column
          key="created_at"
          head={lang('payment.created_at')}
          sortable="created_at"
          current={this.props.query}
          default="asc"
          onSort={this.handleSortClick.bind(this)}
          width="150">
          {ColumnContent.field('created_at')}
        </Column>,
        <Column
          key="status"
          head={lang('payment.status')}
          width="100"
          className="text-center">
          {(row)=>{return (
            <ReactToggle
              defaultChecked={row.status=='enabled'}
              onChange={this.handleRowStatusChange.bind(this, row.id)} />
          );}}
        </Column>,
        <Column
          key="col5"
          head={lang('operations')}
          width="150"
          className="text-center">
          {this.renderTableRowActions.bind(this)}
        </Column>
    ];
  }
}

class Form extends ModalFormLayoutPage {
  get modalTitle(){
    return lang('payment.form_title');
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      payment:{payment_name:'', status:'enabled'},
      gateways: [],
      gateway:{
        options:[],
        form:[],
      }
    };
  }
  componentWillMount(){
    async.waterfall([
      (cb)=>{
        Payments.read('gateways').done((data, status, xhr)=>{
          var gateways = [];
          this.setState(update(this.state, {
            gateways: {$set:data},
            gateway:{
              options: {$set:_.map(data, (item)=>{
                return {label:item.name, value:item.plugin};
              })},
            }
          }), cb);
        }).error(cb);
      },
      (cb)=>{
        var id = this.context.router.getCurrentParams().id;
        if (id) {
          this.fetchRow(id).then((row)=>{
            let form = _.find(this.state.gateways, {plugin:row.gateway_name}).settings_form;
            this.setState(update(this.state, {
              payment:{$set:row},
              gateway:{
                form:{$set:form}
              }
            }));
          }).catch(cb);
        }
      },
      ],
      this.handleError.bind(this));
  }
  handleGatewayChange(plugin){
    var gateway = _.find(this.state.gateways, {plugin:plugin});
    this.setState(update(this.state, {
      gateway:{
        form:{$set:gateway.settings_form}
      }
    }));
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.payment.id} />
        <Input
          type="text"
          required
          name="payment_name"
          valueLink={this.linkStateDeep('payment.payment_name')}
          label={lang('payment.name')} />
        <Select
          label={lang('payment.status')}
          name="status"
          valueLink={this.linkStateDeep('payment.status')}
          options={[{value:'enabled', label:lang('enable')}, {value:'disabled', label:lang('disable')}]}
          placeholder={lang('payment.status_placeholder')}
          searchable={false}
          clearable={false} />
        <Input
          type="textarea"
          name="payment_desc"
          valueLink={this.linkStateDeep('payment.payment_desc')}
          label={lang('payment.desc')} />
        <Select
          required
          label={lang('payment.gateway_name')}
          name="gateway_name"
          clearable={false}
          searchable={false}
          valueLink={this.linkStateDeep('payment.gateway_name')}
          onChange={this.handleGatewayChange.bind(this)}
          options={this.state.gateway.options}
          placeholder={lang('payment.gateway_name_placeholder')} />
        {_.keys(this.state.gateway.form).map((name, i)=>{
          let input_name = "gateway_settings." + name;
          let props = this.state.gateway.form[name];
          return (
            <Input key={i} name={input_name} valueLink={this.linkStateDeep('payment.' + input_name)} {...props} />
          );
        })}
      </div>
    );
  }
}

export default {Index, Form};
