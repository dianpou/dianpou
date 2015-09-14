var Modal   = ReactBootstrap.Modal,
    GlobalMixin = require('../../libraries/globalmixin'),
    FormMixin   = require('../../libraries/formmixin'),
    Input   = require('../../components/formsy/input'),
    Select  = require('../../components/formsy/select'),
    Alert   = require('../../components/alert'),
    Image   = require('../../components/image'),
    Button  = ReactBootstrap.Button,
    Radio   = require('../../components/radio');
module.exports = React.createClass({
    mixins: [FormMixin, GlobalMixin, React.addons.LinkedStateMixin],
    getInitialState: function () {
      return {
        goback: false,
        stock: this.props.stock
      };
    },
    getDefaultProps: function () {
      return {photos:[], stock:{id:_.uniqueId('local_')}, options:[], isNew:true};
    },
    scrollTo: function (to, e) {
      var $dom = $(React.findDOMNode(this));
      var $scrollable = $dom.find('.scroll-scrollable');
      $scrollable.scrollTo($(to), 300);
      this.setState({goback:(to == '#coverSelector')});
    },
    changeCover: function (e) {
      var cover_id = e.target.value, cover;

      if (cover_id) {
        cover = _.find(this.props.photos, (item)=>{return item.id == cover_id;});
      };
      console.debug("Change cover:", this.props.photos, cover, cover_id, _.extend(this.state.stock, {cover_id, cover}));

      this.setState(_.extend(this.state.stock, {cover_id, cover}));
    },
    changeOption: function (groupId, val) {
      this.setState(_.set(this.state, 'stock.option[' + groupId + ']', val));
    },
    generateSKU: function (k, e) {
      var sku = 'S' + moment().format('YYYYMMDD') + _.random(1000, 9999);
      if (k) {
        this.setState(_.set(this.state, k, sku));
      } else {
        return sku;
      }
    },
    handleSubmit: function () {
      this.formTouched(this.refs.form);
    },
    handleValidSubmit: function (model, reset, invalid) {
      var existsIndex = _.findIndex(this.props.stocks, 'option', this.state.stock.option);
      if (existsIndex !== -1 && this.props.isNew) {
        this.refs.alert.error(lang('product.stock_exists', {option:this.state.stock.option }));
        return;
      };
      this.props.onSubmit(this.state.stock, this.props.onHide);
    },
    render: function  () {
        if (this.state.goback) {
          var goback = (<button type="button" onClick={this.scrollTo.bind(this, '#editorForm')} className="btn btn-default pull-left">返回</button>);
        } else {
          var goback = null;
        }
        console.debug('Current cover:', this.state.stock, this.state.stock.cover_id, this.state.stock.cover);
        return (
          <Modal onHide={this.props.onHide} title={lang('product.edit_stock')} backdrop={false} animation={true}>
            <Formsy.Form onSubmit={this.handleSubmit} onValidSubmit={this.handleValidSubmit} ref="form">
              <div className='modal-body'>
                <Alert ref="alert" />
                <div className="stock-editor scroll-scrollable">
                  <div className="scroll-pages">
                    <div id="editorForm" className="scroll-page">
                      <div className="row">
                        <div className="col-md-8">
                          {this.props.options.map((group, i)=>{
                            return <Select key={i}
                                           label={group.name}
                                           name={"option."+i}
                                           searchable={false}
                                           required
                                           options={group.options.map((option)=>{return {label:option,value:option};})}
                                           value={_.get(this.state, 'stock.option['+ i +']')}
                                           onChange={this.changeOption.bind(this, i)} />
                          })}
                          <Input type="text"
                                 label="SKU"
                                 buttonAfter={<Button title={lang('product.sku_button')} onClick={this.generateSKU.bind(this, 'stock.sku')}><i className="fa fa-barcode"></i></Button>}
                                 name="sku"
                                 valueLink={this.linkStateDeep('stock.sku')}
                                 required
                                 placeholder={lang('product.sku_placeholder')} />
                          <Input type="text"
                                 label={lang('product.stock')}
                                 name="stocks"
                                 valueLink={this.linkStateDeep('stock.stocks')}
                                 validations="isNumeric"
                                 validationError={lang('product.stock_invalid')}
                                 placeholder={lang('product.stock_placeholder')} />
                        </div>
                        <div className="col-md-4">
                          <div className="stock-cover">
                          <a href="javascript:;" onClick={this.scrollTo.bind(this, '#coverSelector')}>
                            <Image src={_.get(this.state, 'stock.cover.file.file_path')} size={[150, 150]}/>
                          </a>
                          </div>
                          <Input type="text"
                                 addonBefore="&yen;"
                                 label={lang('product.price')}
                                 name="price"
                                 labelClassName="hide"
                                 validations="isNumeric"
                                 validationError={lang('product.price_invalid')}
                                 valueLink={this.linkStateDeep('stock.price')}
                                 placeholder={lang('product.price_placeholder')} />
                        </div>
                      </div>
                    </div>
                    <div id="coverSelector" className="scroll-page">
                      <ul className="list-unstyled photo-list">
                        {this.props.photos.map((photo, i)=>{
                          var checked = false;
                          if (photo.id == this.state.stock.cover_id) {
                            checked = true;
                          };
                          return (<li key={i}>
                                    <Radio name="cover_id" checked={checked} value={photo.id} onChange={this.changeCover}>
                                      <Image src={photo.file.file_path} size="medium" />
                                    </Radio>
                                  </li>);
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {goback}
                <button type="button" onClick={this.props.onHide} className="btn btn-default pull-left">{lang('cancel')}</button>
                <button type="submit" className="btn btn-primary">{lang('confirm')}</button>
              </div>
            </Formsy.Form>
          </Modal>
        );
    }
});
