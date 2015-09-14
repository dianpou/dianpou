import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Roles} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('role.title'),
      subtitle: lang('role.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('role.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('role.title');
  }
  get model(){
    return {
      routeName: 'roles',
      api:       Roles,
    };
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column key="name" head={lang('role.name')} width="150">
          {ColumnContent.field('role_name')}
        </Column>,
        <Column key="scope" head={lang('role.scope')}>
          {(row)=>{
            return (
              <div>
                {row.role_scopes.map((scope, i)=>{
                  return <span key={i} style={{margin:"0px 3px"}}className="label label-default">{lang('role.scope_' + scope)}</span>;
                })}
              </div>
            );
          }}
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
    return lang('role.form_title');
  }
  handleSubmit(model, reset, invalid){
    model.role_scopes = model.role_scopes.split(',');
    super.handleSubmit(model, reset, invalid);
  }
  renderFormBody(){
    var scopes = [
      {label:lang('role.scope_all'), value:"all"},
      {label:lang('role.scope_order'), value:"order"},
      {label:lang('role.scope_product'), value:"product"},
      {label:lang('role.scope_cms'), value:"cms"},
    ];
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.model.id} />
        <Input
          type="text"
          required
          name="role_name"
          value={this.state.model.role_name}
          label={lang('role.name')} />
        <Select
          label={lang('role.scope')}
          name="role_scopes"
          multi={true}
          options={scopes}
          value={this.state.model.role_scopes} />
      </div>
    );
  }
}

export default {Index, Form};
