import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Pages} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';
import {lang, price, date} from 'libraries/intl';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('page.title'),
      subtitle: lang('page.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('page.title')}
      ]
    };
  }
  get tableTitle(){
    return lang("page.title");
  }
  get model(){
    return {
      routeName: 'pages',
      api:       Pages,
    };
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
      {value:"delete", label:lang("delete")},
    ]);
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column
          key="title"
          head={lang("page.page_title")}
          width="150">
          {ColumnContent.field('title')}
        </Column>,
        <Column
          key="pathname"
          head={lang("page.pathname")}>
          {ColumnContent.field('pathname')}
        </Column>,
        <Column
          key="position"
          sortable="position"
          current={this.props.query}
          onSort={this.handleSortClick.bind(this)}
          head={lang("page.position")}>
          {ColumnContent.field('position')}
        </Column>,
        <Column
          key="sort_index"
          sortable="sort_index"
          current={this.props.query}
          default="asc"
          onSort={this.handleSortClick.bind(this)}
          head={lang("page.sort_index")}>
          {ColumnContent.field('sort_index')}
        </Column>,
        <Column
          key="created_at"
          head={lang("page.created_at")}
          sortable="created_at"
          current={this.props.query}
          default="asc"
          onSort={this.handleSortClick.bind(this)}
          width="150">
          {row=>date(row.created_at)}
        </Column>,
        <Column
          key="col5"
          head={lang("operations")}
          width="150"
          className="text-center">
          {this.renderTableRowActions.bind(this)}
        </Column>
    ];
  }
}

class Form extends ModalFormLayoutPage {
  get modalTitle(){
    return lang('page.form_title');
  }
  get example(){
    return _.get(this.state.plugin, 'settings.data.example', '');
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      page:{title:'', status:'enabled'},
      plugins: [],
      plugin:{
        options:[],
        settings:[],
      }
    };
  }
  componentWillMount(){
    var id = this.context.router.getCurrentParams().id;
    if (id) {
      this.fetchRow(id).then((row)=>{
        row.settings = JSON.stringify(row.settings, null, 2);
        this.setState(update(this.state, { page:{$set:row} }));
      }).catch(this.handleError.bind(this));
    }
  }
  // handlePluginChange(plugin){
  //   var plugin = _.find(this.state.plugins, {plugin:plugin});
  //   this.setState(update(this.state, {
  //     plugin:{
  //       settings:{$set:plugin.settings_form}
  //     }
  //   }));
  // }
  handleSubmit(model, reset, invalid){
    try {
      model.settings = JSON.parse(model.settings);
      return super.handleSubmit(model, reset, invalid);
    } catch (e) {
      invalid({"settings":lang("invalid_json")});
    }
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.page.id} />
        <Input
          type="text"
          required
          name="title"
          placeholder={lang("page.page_title_placeholder")}
          valueLink={this.linkStateDeep('page.title')}
          label={lang("page.page_title")} />
        <Input
          type="text"
          required
          name="pathname"
          placeholder={lang('page.pathname_placeholder')}
          valueLink={this.linkStateDeep('page.pathname')}
          label={lang("page.pathname")} />
        <Input
          type="text"
          required
          name="position"
          valueLink={this.linkStateDeep('page.position')}
          placeholder={lang('page.position_placeholder')}
          label={lang('page.position')} />
        <Input
          type="text"
          name="sort_index"
          valueLink={this.linkStateDeep('page.sort_index')}
          placeholder={lang('page.sort_index_placeholder')}
          label={lang("page.sort_index")} />
        <Input name="settings" type="textarea" label={lang("page.settings")} rows="10" valueLink={this.linkStateDeep('page.settings')} />
        <div><strong>{lang("page.settings_example")}</strong><blockquote>{this.example}</blockquote></div>
      </div>
    );
  }
}

export default {Index, Form};
