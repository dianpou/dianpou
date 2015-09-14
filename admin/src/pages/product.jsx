import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Products} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';
import Image from '../components/image';
import {lang, price, date} from 'libraries/intl';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('product.title'),
      subtitle: lang('product.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('product.title')}
      ]
    };
  }
  get tableTitle(){
    return lang('product.title');
  }
  get model(){
    return {
      routeName: 'products',
      routeAlias: 'product_index',
      api:       Products,
    };
  }
  handleRowStatusChange(id, e){
    this.model.api.update(id, {status:e.target.checked ? 'available' : 'unavailable'}).done().error(this.handleError.bind(this));
  }
  handleBatchEnableClick(rows){
    this.refs.message.confirm(lang('product.batch_enable_confirm'), this.handleBatchEnableOK.bind(this, rows));
  }
  handleBatchEnableOK(ids, hide){
    this.batchStatusChange(ids, 'available').then(()=>{
      hide();
      this.refreshWithMessage('批量上架成功 ' + _.map(ids, (id)=>{return '#' + id + "\n";}).join(','));
    }).catch(this.handleError.bind(this));
  }
  handleBatchDisableClick(rows){
    this.refs.message.confirm(lang('product.batch_disable_confirm'), this.handleBatchDisableOK.bind(this, rows));
  }
  handleBatchDisableOK(ids, hide){
    this.batchStatusChange(ids, 'unavailable').then(()=>{
      hide();
      this.refreshWithMessage('批量下架成功 ' + _.map(ids, (id)=>{return '#' + id + "\n";}).join(','));
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
  renderTableBody(){
    return super.renderTableBody({ rowClassName:'product-item' });
  }
  renderTableBatch(options){
    return super.renderTableBatch([
      {value:"delete", label:lang("delete")},
      {value:"enable", label:lang("product.enable")},
      {value:"disable", label:lang("product.disable")},
    ]);
  }
  getTableColumns(){
    return [
        <Column
          key="checkbox"
          checkable="id"
          width="30"></Column>,
        <Column
          key="id"
          head={lang('product.id')}
          className="text-center"
          width="50">
          {row=>row.id}
        </Column>,
        <Column
          key="product_name"
          head={lang('product.name')} >
          {(row)=>{
            return (
              <div className="item-body">
                <Link to="products.edit" params={{id:row.id}} className="pull-left">
                  <Image src={_.get(row, 'cover.file.file_path')} size="small" />
                </Link>
                <p><Link to="products.edit" params={{id:row.id}}>{row.product_name}</Link></p>
                <p>{lang('product.category')}:&nbsp;
                  {row.categories.map((category, i)=>{
                    return <span style={{marginRight:"5px"}} key={i} className="label label-default">{category.category_name}&nbsp;</span>;
                    })}
                </p>
              </div>
            );
          }}
        </Column>,
        <Column
          key="price"
          width="120"
          head={lang('product.min_price')}
          style={{verticalAlign:'middle'}}
          className="text-center">
          {row=>price(row.stock.min_price)}
        </Column>,
        <Column
          key="stock"
          head={lang('product.stock')}
          width="100"
          style={{verticalAlign:'middle'}}
          className="text-center">
          {ColumnContent.field('stock.total')}
        </Column>,
        <Column
          key="status"
          head={lang('product.status')}
          width="100"
          style={{verticalAlign:'middle'}}
          className="text-center">
          {(row)=>{return (
            <ReactToggle
              defaultChecked={row.status=='available'}
              onChange={this.handleRowStatusChange.bind(this, row.id)} />
          );}}
        </Column>,
        <Column
          key="col5"
          head={lang('operations')}
          width="150"
          style={{verticalAlign:'middle'}}
          className="text-center">
          {this.renderTableRowActions.bind(this)}
        </Column>
    ];
  }
}

class Form extends ModalFormLayoutPage {
  get modalTitle(){
    return lang('product.form_title');
  }
}

export default {Index, Form};
