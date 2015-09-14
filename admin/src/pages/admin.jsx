import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Admins, Roles} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';
import Image from 'components/image';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('admin.title'),
      subtitle: lang('admin.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('admin.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('admin.title');
  }
  get model(){
    return {
      routeName: 'admins',
      api:       Admins,
    };
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column key="name" head={lang('admin.name')}>
          {(row)=>{return (
            <div className="media">
              <div className="media-left"><Image size="mini" src={row.avatar} /></div>
              <div className="media-body">
                <div className="media-heading"><Link to="admins.edit" params={row}>{row.name}</Link></div>
                {row.roles.map((role, i)=>{
                  return <span key={i} className="label label-default" style={{margin:"0px 3px"}}>{role.role_name}</span>;
                })}
              </div>
            </div>);}}
        </Column>,
        <Column key="email" head={lang('admin.email')} width="150">
          {ColumnContent.field('email')}
        </Column>,
        <Column
          valign="middle"
          key="created_at"
          head={lang('admin.created_at')}
          sortable="created_at"
          current={this.props.query}
          default="asc"
          onSort={this.handleSortClick.bind(this)}
          width="150">
          {ColumnContent.field('created_at')}
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
    return lang('admin.form_title');
  }
  componentWillMount(){
    async.waterfall([
      (cb)=>{
        Roles.read().done((data, status, xhr)=>{
          this.setState({
            roles: _.map(data, (item)=>{
                return {label:item.role_name, value:item.id.toString()};
            })
          }, cb);
        }).error(cb);
      },
      (cb)=>{
        var id = this.props.params.id;
        if (id) {
          this.fetchRow(id).then((row)=>{
            this.setState({
              model:row
            });
          }).catch(cb);
        }
      },
      ],
      this.handleError.bind(this));
  }
  handleSubmit(model, reset, invalid){
    if (model.password && model.password != model.password_confirm) {
      return invalid({password:lang('admin.password_inconsistent'), password_confirm:lang('admin.password_inconsistent')});
    }
    model.roles = model.roles.split(',');
    super.handleSubmit(model, reset, invalid);
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.model.id} />
        <Input
          type="text"
          required
          name="email"
          validations="isEmail"
          value={this.state.model.email}
          label={lang('admin.email')} />
        <Input
          type="text"
          required
          name="name"
          value={this.state.model.name}
          label={lang('admin.name')} />
        <Select
          label={lang('admin.role')}
          name="roles"
          multi={true}
          options={this.state.roles}
          value={_.pluck(this.state.model.roles, 'id').join(',')} />
        <Input type="password" required={this.state.model.id ? false : true} name="password" label={lang('admin.password')} />
        <Input type="password" name="password_confirm" label={lang('admin.password_confirm')} />
      </div>
    );
  }
}

export default {Index, Form};
