import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Categories} from '../libraries/api';
import {makeTree} from '../libraries/utils';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('category.title'),
      subtitle: lang('category.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('category.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('category.title');
  }
  get model(){
    return {
      routeName:'categories',
      api:Categories,
    }
  }
  fetchRows(query){
    return new Promise((resolve, reject)=>{
      Categories.read('tree').done((data, status, xhr)=>{
        var tree = makeTree(data);
        resolve({
          rows: tree,
          total: xhr.getResponseHeader('X-Total-Count')
        });
      }).error(reject);
    });
  }
  getTableColumns(){
    return [
        <Column key="col2" head={lang('category.name')}>{(row)=>{return <span className={"category-level-" + row.level}>{row.category_name}</span>;}}</Column>,
        <Column key="col3" head={lang('operations')} width="150" className="text-center">{this.renderTableRowActions.bind(this)}</Column>
    ];
  }
  renderTablePager(){ return; }
  renderTableFilter(){ return; }
  renderTableBatch(){ return; }
}

class Form extends ModalFormLayoutPage {
  get modalTitle(){
    return lang('category.form_title');
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      category:{category_name:'', parent_id:null, id:null},
      options:[]
    };
  }
  componentWillMount(){
    async.waterfall([
      (cb)=>{
        Categories.read('tree').done((data, status, xhr)=>{
          var tree = makeTree(data);
          var options = [];
          tree.forEach((category)=>{
            options.push({
              value:category.id.toString(),
              label: _.repeat('---', category.level) + ' ' + category.category_name,
              name: category.category_name,
            });
          });
          this.setState({
            options: options
          }, cb);
        }).error(cb);
      },
      (cb)=>{
        var id = this.context.router.getCurrentParams().id || 0;
        if (id) {
          this.fetchRow(id).then((row)=>{
            row.parent_id = row.parent_id ? row.parent_id.toString() : null;
            this.setState({category:row}, cb);
          }).catch(cb);
        }
      },
    ], this.handleError.bind(this));
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.category.id} />
        <Input type="text" required name="category_name" valueLink={this.linkStateDeep('category.category_name')} label={lang('category.name')} />
        <Select
          label={lang('category.parent')}
          name="parent_id"
          valueLink={this.linkStateDeep('category.parent_id')}
          options={this.state.options}
          placeholder={lang('category.parent_placeholder')}
          />
      </div>
    );
  }
}

export default {Index, Form};
