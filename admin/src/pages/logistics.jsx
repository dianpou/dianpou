import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Logistics} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('logistics.title'),
      subtitle: lang('logistics.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('logistics.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('logistics.title');
  }
  get model(){
    return {
      routeName: 'logistics',
      api:       Logistics,
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
    this.refs.message.confirm(lang('batch_disable_confirm'), this.handleBatchDisableOK.bind(this, rows));
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
          key="logistics_name"
          sortable="logistics_name"
          current={this.props.query}
          onSort={this.handleSortClick.bind(this)}
          head={lang('logistics.name')}
          width="150">
          {ColumnContent.field('logistics_name')}
        </Column>,
        <Column
          key="logistics_desc"
          head={lang('logistics.desc')}>
          {ColumnContent.field('logistics_desc')}
        </Column>,
        <Column
          key="created_at"
          head={lang('logistics.created_at')}
          sortable="created_at"
          current={this.props.query}
          default="asc"
          onSort={this.handleSortClick.bind(this)}
          width="150">
          {ColumnContent.field('created_at')}
        </Column>,
        <Column
          key="status"
          head={lang('logistics.status')}
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
    return lang('logistics.form_title');
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      logistics:{logistics_name:'', status:'enabled'},
      deliverers: [],
      deliverer:{
        options:[],
        settings:[],
      }
    };
  }
  componentWillMount(){
    async.waterfall([
      (cb)=>{
        Logistics.read('deliverers').done((data, status, xhr)=>{
          var deliverers = [];
          this.setState(update(this.state, {
            deliverers: {$set:data},
            deliverer:{
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
            let settings = _.find(this.state.deliverers, {plugin:row.deliverer_name}).settings_form;
            this.setState(update(this.state, {
              logistics:{$set:row},
              deliverer:{
                settings:{$set:settings}
              }
            }));
          }).catch(cb);
        }
      },
      ],
      this.handleError.bind(this));
  }
  handleDelivererChange(plugin){
    var deliverer = _.find(this.state.deliverers, {plugin:plugin});
    this.setState(update(this.state, {
      deliverer:{
        settings:{$set:deliverer.settings_form}
      }
    }));
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.logistics.id} />
        <Input
          type="text"
          required
          name="logistics_name"
          valueLink={this.linkStateDeep('logistics.logistics_name')}
          label={lang('logistics.name')} />
        <Select
          label={lang('logistics.status')}
          name="status"
          valueLink={this.linkStateDeep('logistics.status')}
          options={[{value:'enabled', label:lang('enable')}, {value:'disabled', label:lang('disable')}]}
          placeholder={lang('logistics.status_placeholder')}
          searchable={false}
          clearable={false} />
        <Input
          type="textarea"
          name="logistics_desc"
          valueLink={this.linkStateDeep('logistics.logistics_desc')}
          label={lang('logistics.desc')} />
        <Select
          required
          label={lang('logistics.deliverer_name')}
          name="deliverer_name"
          clearable={false}
          searchable={false}
          valueLink={this.linkStateDeep('logistics.deliverer_name')}
          onChange={this.handleDelivererChange.bind(this)}
          options={this.state.deliverer.options}
          placeholder={lang('logistics.deliverer_name_placeholder')} />
        {_.keys(this.state.deliverer.settings).map((name, i)=>{
          let input_name = "deliverer_settings." + name;
          let props = this.state.deliverer.settings[name];
          return (
            <Input key={i} name={input_name} valueLink={this.linkStateDeep('logistics.' + input_name)} {...props} />
          );
        })}
      </div>
    );
  }
}

export default {Index, Form};
