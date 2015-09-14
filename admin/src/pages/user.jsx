import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Users} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';
import Image from 'components/image';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('user.title'),
      subtitle: lang('user.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('user.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('user.title');
  }
  get model(){
    return {
      routeName: 'users',
      api:       Users,
    };
  }
  getTableColumns(){
    return [
        <Column
          key="id"
          checkable="id"
          width="30"></Column>,
        <Column key="name" head={lang('user.name')}>
          {(row)=>{return (
            <div className="media">
              <div className="media-left"><Image size="mini" src={row.avatar} /></div>
              <div className="media-body">
                <div className="media-heading"><Link to="users.edit" params={row}>{row.name}</Link></div>
                @{row.nickname}
              </div>
            </div>);}}
        </Column>,
        <Column key="email" head={lang('user.email')} width="150">
          {ColumnContent.field('email')}
        </Column>,
        <Column
          valign="middle"
          key="created_at"
          head={lang('user.created_at')}
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
    return lang('user.form_title');
  }
  handleSubmit(model, reset, invalid){
    if (model.password && model.password != model.password_confirm) {
      return invalid({password:lang('user.password_inconsistent'), password_confirm:lang('user.password_inconsistent')});
    }
    super.handleSubmit(model, reset, invalid);
  }
  renderFormBody(){
    return (
      <div>
        <Input type="hidden" name="id" value={this.state.model.id} />
        <Input
          type="text"
          required
          name="nickname"
          value={this.state.model.nickname}
          label={lang('user.nickname')} />
        <Input
          type="text"
          required
          name="name"
          value={this.state.model.name}
          label={lang('user.name')} />
        <Input
          type="text"
          required
          name="email"
          validations="isEmail"
          value={this.state.model.email}
          label={lang('user.email')} />
        <Input type="password" required={this.state.model.id ? false : true} name="password" label={lang('user.password')} />
        <Input type="password" name="password_confirm" label={lang('user.password_confirm')} placeholder={lang('user.password_confirm_placeholder')} />
      </div>
    );
  }
}

export default {Index, Form};
