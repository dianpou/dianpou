import {SideTablePage, Modal} from './components/layout';
import scriptjs from 'scriptjs';
import {Button} from './components/form';
import {Table, Column} from 'lib/table';
import {lang, price, date} from 'lib/intl';

export class Index extends SideTablePage{
  get meta(){
    return {
      title:lang("address.title"),
      resource:'addresses',
    };
  }
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang('address.subtitle'),
      paths:[
        {text:lang('home.name'), icon:"fa fa-home", href:"/home"},
        {text:lang('address.title'), href:"/home/addresses"},
      ]
    });
    return super.componentWillMount();
  }
  renderTablePager(){ return; }
  renderTableFilter(){ return; }
  renderTableColumns(){
    return [
      <Column key="consignee" width="129" title={lang('address.consignee')}>{row=>row.consignee}</Column>,
      <Column key="address" title={lang('address.address')}>{row=>(<span>{row.address}&nbsp;&nbsp;{row.region}&nbsp;&nbsp;{row.zipcode}</span>)}</Column>,
      <Column key="mobile" width="120" title={lang('address.mobile')}>{row=>row.mobile}</Column>,
      <Column key="phone" width="120" title={lang('address.phone')}>{row=>row.phone}</Column>,
      <Column key="email" width="120" title={lang('address.email')}>{row=>row.email}</Column>,
      <Column key="actions" width="150" title={lang('operations')} className="text-center">{this.renderTableRowActions.bind(this)}</Column>,
    ];
  }
}

export class Form extends Modal {
  get title(){
    return lang('address.form_title');
  }
  get template(){
    return this.getTemplate('address').form;
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
    model.region = _.isString(model.region) ? model.region.split(',') : model.region;
    return super.handleValidSubmit(model, reset, invalid);
  }
}
