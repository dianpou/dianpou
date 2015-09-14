var Breadcrumb = require('../../components/breadcrumb'),
    Input      = require('../../components/formsy/input'),
    Alert      = require('../../components/alert'),
    GlobalMixin   = require('../../libraries/globalmixin'),
    DynamicLoader = require('../../libraries/dynamicloader'),
    FormMixin     = require('../../libraries/formmixin'),
    OptionEditor  = require('./form_option'),
    PhotoEditor   = require('./form_photo'),
    StockList     = require('./form_stock_list'),
    Button        = ReactBootstrap.Button,
    Modal  = ReactBootstrap.Modal,
    update        = React.addons.update,
    Link          = ReactRouter.Link;

import {Select} from '../../components/form';
import {Products, ProductPhotos, ProductStocks, Categories, api} from '../../libraries/api';
import {makeTree} from '../../libraries/utils';
import Combinatorics from 'js-combinatorics';


module.exports = React.createClass({
    mixins: [GlobalMixin, ReactRouter.Navigation, DynamicLoader, ReactBootstrap.OverlayMixin, FormMixin, React.addons.LinkedStateMixin],
    depends: ['http://cdn.ckeditor.com/4.5.3/standard/ckeditor.js', 'http://cdn.ckeditor.com/4.5.3/standard/adapters/jquery.js'],
    dynamicAsyncLoad: false,
    onAllLoaded(){
      $('textarea[name=product_desc]').on('blur', function(){console.log('haha');}).ckeditor();
    },
    getInitialState: function () {
      return {
        product: {},
        stocks: [{id:_.uniqueId('local_')}],
        photos: [],
        saving: false,
        error: null,
        isOptionEditorOpen:false
      };
    },
    componentWillMount: function () {
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
              categories: options
            }, cb);
          }).error(cb);
        },
        (cb)=>{
          if (this.props.params.id) {
            Products.read(this.props.params.id).done((data, status, xhr)=>{
              data.categories = _.pluck(data.categories, 'id').join(',');
              // console.log(data, StockList);
              this.setState({product:data});
            });
            ProductPhotos.read(this.props.params.id).done((data, status, xhr)=>{
              this.setState({photos:data});
            });
            ProductStocks.read(this.props.params.id).done((data, status, xhr)=>{
              this.setState({stocks:data});
            });
          }
        }
        ]);
    },
    componentDidMount: function () {
      $(React.findDOMNode(this.refs.statusToggle)).bootstrapSwitch({
        state: this.state.product.status == 'available',
        size:'mini',
        onText: lang('product.enable'),
        offText: lang('product.disable')
      }).on('switchChange.bootstrapSwitch', this.handleStatusChange);
    },
    componentDidUpdate: function (prevProps, prevState) {
      if (prevState.product.status != this.state.product.status) {
        $(React.findDOMNode(this.refs.statusToggle)).bootstrapSwitch('state', this.state.product.status == 'available');
      }
      if (prevState.product.product_desc != this.state.product.product_desc) {
        $('textarea[name=product_desc]').val(this.state.product.product_desc);
      }
    },
    componentWillUpdate: function (nextProps, nextState) {
      console.debug("New state. Product: %o, Stocks: %o, Photos: %o", nextState.product, nextState.stocks, nextState.photos);
    },
    handleStatusChange: function (e, state) {
      this.setState(_.set(this.state, 'product.status', (state ? 'available' : 'unavailable')));
    },
    handlePhotoMove: function  (draggedId, targetId) {
      var photos = this.state.photos;
      var photo  = photos.filter(photo => photo.id === draggedId)[0];
      var afterPhoto = photos.filter(photo => photo.id === targetId)[0];
      var photoIndex = photos.indexOf(photo);
      var afterIndex = photos.indexOf(afterPhoto);
      var newState = update(this.state, {
        photos: {
          $splice: [
            [photoIndex, 1],
            [afterIndex, 0, photo]
          ]
        }
      });
      newState.photos = this.resortPhotos(newState.photos);

      this.setState(newState);
    },
    handlePhotoDelete: function (photo, e) {
      if (photo.product_id) {
        ProductPhotos.del(photo.product_id, photo.id).error(this.handleError).done((data, status, xhr)=>{
          var newPhotos = _.remove(this.state.photos, (item)=>{return item.id != photo.id;});
          this.setState({photos:newPhotos});
        });
      } else {
        var newPhotos = _.remove(this.state.photos, (item)=>{return item.id != photo.id;});
        this.setState({photos:newPhotos});
      }
    },
    handlePhotoCreate: function (files, e) {
      _.each(files, (file, index)=>{
        var reader = new FileReader();
        reader.onload =  (event) => {
          var newPhotos = this.state.photos;
          newPhotos.push({id:_.uniqueId('local_'), file:{file_name:file.name, file_path:event.target.result}, sort_index:newPhotos.length});
          this.setState({photos: newPhotos});
        };
        reader.readAsDataURL(file);
      });
    },
    resortPhotos: function (photos) {
      photos.forEach((photo, index)=>{
        photos[index].sort_index = index;
      });

      return photos;
    },
    saveProduct: function (product) {
      if (this.state.product.id) {
        return Products.update(this.state.product.id, product);
      } else {
        return Products.create(product);
      }
    },
    savePhotos: function (product, photos, done) {
      var mapping = {};
      var savePhoto = (photo, cb)=>{
        if (_.startsWith(photo.id, 'local')) {
          var local_id = photo.id;
          var postData = _.clone(photo);
          delete postData['id'];
          ProductPhotos.create(product.id, postData).done((data, status, xhr)=>{
            mapping[local_id] = data.id;
            var oldIndex = _.findIndex(this.state.photos, {id:local_id});
            photos[oldIndex] = data;
            cb();
          }).error(cb);
        } else {
          var postData = _.clone(photo);
          delete postData['file'];
          ProductPhotos.update(product.id, photo.id, postData).done((data, status, xhr)=>{cb();}).error(cb);
        }
      };
      async.each(photos, savePhoto, (err)=>{
        done(err, photos, mapping);
      });
    },
    saveStocks: function (product, photoIdMapping, stocks, done) {
      var picked = ['price', 'sku', 'cover_id', 'stocks', 'option'];
      var saveStock = (stock, cb)=>{
        if (_.startsWith(_.get(stock, 'cover_id'), 'local')) {
          stock.cover_id = photoIdMapping[stock.cover_id];
        }
        if (_.startsWith(stock.id, 'local')) {
          var local_id = stock.id;
          ProductStocks.create(product.id, _.pick(stock, picked)).error(cb).done((data, status, xhr)=>{
            var oldIndex = _.findIndex(stocks, {id:local_id});
            stocks[oldIndex] = _.extend(stocks[oldIndex], data);
            cb();
          });
        } else {
          ProductStocks.update(product.id, stock.id, _.pick(stock, picked)).error(cb).done((data, status, xhr)=>{ cb(); });
        }
      };
      async.each(stocks, saveStock, (err)=>{
        this.setState({stocks}, function () {
          done(err, stocks);
        });
      });
    },
    handleSubmit: function (model, reset, invalid) {
      this.formTouched(this.refs.form);
    },
    handleValidSubmit: function (model, reset, invalidate) {
      var product = _.pick(_.extend(this.state.product, model, {
        product_desc: $('textarea[name=product_desc]').val()
      }), ['product_name', 'product_desc', 'status', 'options', 'categories']);
      var isNew = !_.isNumber(this.state.product.id);
      // return console.log(this.state.stocks);
      this.setState({saving: true});
      async.waterfall([

        // Save Product
        (cb)=>{
          this.saveProduct(product).error(cb).done((data, status, xhr)=>{
            cb(null, data);
            console.log('Product:', data);
          });
        },

        // Save Photos
        (savedProduct, cb) => {
          this.savePhotos(savedProduct, this.state.photos, (err, savedPhotos, idMapping)=>{
            if (err) {
              return this.handleError(err);
            }
            console.log('Photos:', savedPhotos, idMapping);
            cb(null, savedProduct, savedPhotos, idMapping);
          });
        },

        // Save Stocks
        (savedProduct, savedPhotos, photoIdMapping, cb) => {
          this.saveStocks(savedProduct, photoIdMapping, this.state.stocks, (err, savedStocks)=>{
            if (err) {
              return this.handleError(err);
            }
            console.log('Stocks:', savedStocks);
            cb(null, savedProduct, savedPhotos, savedStocks);
          });
        }
      ],
        // All Done!
      (err, savedProduct, savedPhotos, savedStocks)=>{
        if (err) {
          return this.handleError(err);
        }
        this.refs.alert.success(lang('submit_successfully'));
        this.setState({
          saving: false,
          product: _.extend(this.state.product, _.omit(savedProduct, 'categories')),
          photos: savedPhotos,
          stocks: savedStocks
        });
        if (isNew) {
          this.transitionTo('product_edit', {id:savedProduct.id});
        }
      });
    },
    handleError: function (err) {
      this.setState({saving: false});
      console.debug(err);
      this.refs.alert.error(err.responseJSON.message);
    },
    handleToggleOptionEditor: function () {
      this.setState({
        isOptionEditorOpen: !this.state.isOptionEditorOpen
      });
    },
    regenerateStocks: function (options, base_stock) {
      var cp_items = [];
      options.forEach(function(option){
        cp_items.push(option.options);
      });
      return _.map(Combinatorics.cartesianProduct.apply(null, cp_items).toArray(), (stock_option, i)=>{
        return base_stock ? _.extend({id:_.uniqueId('local_'),
                                      sku:this.generateSKU(),
                                      option: stock_option,
                                      cover_id:0}, base_stock) : stock_option;
      });
    },
    handleOptionSubmit: function (options) {
      console.debug('Submit option', options, _.get(this.state, 'product.options'));
      if (options.length > 0) {
        var stocks = this.state.stocks;
        var cover_mode = options.length > _.get(this.state, 'product.options', []).length;
        var base_stock = {
          price: _.get(this.state, 'stocks[0].price', 9999),
          stocks: _.get(this.state, 'stocks[0].stocks', 0),
        };

        this.regenerateStocks(options, base_stock).forEach((stock, i)=>{
          if (cover_mode) {
            if (stocks[i]) {
              // console.debug("Cover", i, stocks, stock, stocks[i]);
              stocks[i].option = stock.option;
              stocks[i].sku    = _.isUndefined(stocks[i].sku) ? stock.sku : stocks[i].sku;
              stocks[i].price    = _.isUndefined(stocks[i].price) ? stock.price : stocks[i].price;
              stocks[i].stocks    = _.isUndefined(stocks[i].stocks) ? stock.stocks : stocks[i].stocks;
            } else {
              stocks.push(stock);
            }
          } else {
            // 查找库存是否存在
            var existsIndex = _.findIndex(stocks, {option:stock.option});
            if (existsIndex === -1) {
              stocks.push(stock);
            }
          }
        });
        this.setState(_.extend(_.set(this.state, 'product.options', options), {stocks:stocks}), ()=>{
          // console.debug("Stocks", this.state.stocks, this.state.product.options);
          this.handleToggleOptionEditor();
        });
      } else {
        this.handleToggleOptionEditor();
      }
    },
    handleOptionDestroy: function () {
      this.setState(_.set(this.state, 'product.options', null));
    },
    generateSKU: function (k, e) {
      var sku = 'S' + moment().format('YYYYMMDD') + _.random(1000, 9999);
      if (k) {
        this.setState(_.set(this.state, k, sku));
      } else {
        return sku;
      }
    },
    removeStock: function(stock, cb){
      var removeStockFromLocal = (stock) => {
        var stocks = this.state.stocks;
        _.remove(stocks, (item)=>{return item.id==stock.id;});
        this.setState({stocks}, cb);
      };

      if (_.startsWith(stock.id, 'local')) {
        removeStockFromLocal(stock);
      } else {
        ProductStocks.del(stock.product_id, stock.id).error(cb).done((data, status, xhr)=>{
          console.debug("Removed:", data, status, xhr);
          if (xhr.status == 204) {
            removeStockFromLocal(stock);
          }
        });
      }
    },
    editStock: function (stock, localIndex, cb) {
      var original = this.state.stocks[localIndex];
      if (!original) {
        return cb();
      }
      var editStockFromLocal = (stock) => {
        var stocks = this.state.stocks;
        stocks[localIndex] = _.extend(stocks[localIndex], stock);
        this.setState({stocks});
        cb();
      };

      console.debug("Editing...", original, localIndex, stock, this.state.stocks);
      if (_.startsWith(original.id, 'local')) {
        editStockFromLocal(stock);
      } else {
        ProductStocks.update(original.product_id,
                             original.id,
                             _.pick(stock, ['price',
                                            'sku',
                                            'cover_id',
                                            'stocks',
                                            'option']))
                      .error(cb)
                      .done((data, status, xhr)=>{
                        console.debug("Edited:", data, status, xhr);
                        if (xhr.status == 200) {
                          editStockFromLocal(data);
                        }
        });
      }
    },
    updateProduct: function (update_data, cb) {
      var saveState = (product)=>{
        this.setState({product:_.extend(this.state.product, product)}, cb);
      };
      if (_.get(this.state, 'product.id')) {
        Products.update(this.state.product.id, update_data).error(cb).done((data, status, xhr)=>{
          console.debug("Product updated. Received: %o, Status: %o, XHR: %o", data, status, xhr);
          saveState(data);
        });
      } else {
        saveState(update_data);
      }
    },
    handleBeforeOptionRemove: function (groupIndex, option) {
      var before  = _.get(this.state, 'product.options[' + groupIndex + '].options', []);
      var removed = _.isArray(option) ? option : [option];
      if (before.length === 0) {
        return true;
      }
      console.debug("Before option remove. Before: %o, Removed: %o, Options: %o", before, removed, this.state.product.options);
      if (_.intersection(before, removed).length == before.length) {
        // delete whole group
        var all = _.clone(this.state.product.options), reserved, matched;
        delete all[groupIndex];
        if (_.filter(all).length > 0) {
           reserved = this.regenerateStocks(all, {});
           matched  = _.slice(this.state.stocks, reserved.length);
        } else {
           reserved = _.clone({option:null});
           matched  = _.slice(this.state.stocks, 1);
        }
        if (matched.length > 0) {
          var matched_stocks = matched.map((stock)=>{
            return "--   " + stock.option.join(' ');
          }).join("\n");
          console.debug("Reserved:%o Matched:%o", reserved, matched);
          var result = confirm(lang('product.delete_option_group_confirm') + matched_stocks);
          // console.log(reserved, matched);
          // return false;
          if (result) {
            setTimeout(()=>{
              async.waterfall([
                (cb)=>{
                  async.each(matched, this.removeStock, cb);
                },
                (cb)=>{
                  // var stocks = this.state.stocks.map((stock)=>{
                  //   delete stock.option[groupIndex];
                  //   stock.option=_.filter(stock.option);
                  //   return stock;
                  // });
                  // async.forEachOf(stocks, this.editStock, cb);
                  async.forEachOf(reserved, this.editStock, cb);
                },
                (cb)=>{
                  var options = _.clone(this.state.product.options);
                  delete options[groupIndex];
                  this.updateProduct({options:_.filter(options)}, cb);
                }
              ], (err)=>{
                if (err) {
                  this.handleError(err);
                }
              });
            }, 0);
            return true;
          } else {
            return false;
          }
        }

      } else {
        var matched = _.filter(this.state.stocks, (stock)=>{
          var current = _.get(stock, 'option[' + groupIndex + ']');
          return (_.indexOf(option, current) !== -1);
        });
        if (_.isArray(matched) && matched.length > 0) {
          var matched_stocks = matched.map((stock)=>{
            return "--   " + stock.option.join(' ');
          }).join("\n");
          var result = confirm(lang('product.delete_option_confirm') + matched_stocks);
          if (result) {
            setTimeout(()=>{
              matched.forEach((stock)=>{
                this.removeStock(stock);
              });
            }, 0);
            return true;
          } else {
            return false;
          }
        }
      }
      return true;
    },
    handleStockEditSubmit: function (stock, cb) {
      var stocks = this.state.stocks;
      var index  = _.findIndex(stocks, 'id', stock.id);
      stocks[index] = stock;
      console.debug('Stock edited:', stock);
      this.setState({stocks}, cb);
    },
    renderOverlay: function () {
      if (!this.state.isOptionEditorOpen) {
        return <span/>;
      }
      return <OptionEditor options={this.state.product.options}
                           onHide={this.handleToggleOptionEditor}
                           onDestroy={this.handleOptionDestroy}
                           onSubmit={this.handleOptionSubmit}
                           beforeOptionRemove={this.handleBeforeOptionRemove}
                           beforeGroupRemove={this.handleBeforeOptionRemove} />;
    },
    render: function  () {
        var data = this.state.item ? this.state.item.data() : {}, alert;
        var stock = (<div className="box-body">
                        <Input type="text" name="stock.price"
                                           addonBefore="&yen;"
                                           label={lang('product.price')}
                                           validations="isNumeric"
                                           required
                                           validationError={lang('product.price_invalid')}
                                           valueLink={this.linkStateDeep('stocks[0].price')}
                                           placeholder="0.00" />
                        <Input type="text" name="stock.sku"
                                           buttonAfter={<Button title={lang('product.sku_button')}
                                                                onClick={this.generateSKU.bind(this, 'stocks[0].sku')}>
                                                                <i className="fa fa-barcode"></i>
                                                        </Button>}
                                           label="SKU"
                                           required
                                           ref="default_stock"
                                           valueLink={this.linkStateDeep('stocks[0].sku')}
                                           placeholder={lang('product.sku_placeholder')} />
                        <Input type="text" name="stock.stocks"
                                           required
                                           label={lang('product.stock')}
                                           valueLink={this.linkStateDeep('stocks[0].stocks')}
                                           placeholder={lang('product.stock_placeholder')} />
                     </div>);
        if (_.get(this.state, 'product.options.length', 0) > 0) {
          stock = (<div className="box-body">
                     <StockList options={this.state.product.options || []}
                                photos={this.state.photos}
                                stocks={this.state.stocks}
                                onEditSubmit={this.handleStockEditSubmit}
                                onError={this.handleError} />
                    </div>);
        }

        return (
          <div className="content-wrapper">
            <Breadcrumb title={lang('product.create')} subtitle={lang('product.create_subtitle')}>
              <li><Link to="products"><i className="fa fa-tags"></i>{lang('product.title')}</Link></li>
              <li className="active">{lang('product.create')}</li>
            </Breadcrumb>
            <section className="content">
              <Alert ref="alert" message={this.state.error} />
              <Formsy.Form onSubmit={this.handleSubmit} onValidSubmit={this.handleValidSubmit} ref="form">
                <div className="row">
                  <div className="col-md-8">
                    <div className="box box-default">
                      <div className="box-header">
                        <h3 className="box-title">
                          {lang('product.form.basic')}
                          </h3>
                      </div>
                      <div className="box-body">
                        <Input type="text"
                               name="product_name"
                               label={lang('product.name')}
                               required
                               valueLink={this.linkStateDeep('product.product_name')}
                               placeholder={lang('product.form.name_placeholder')} />
                             <Input type="textarea" name="product_desc" label={lang('product.form.desc')} rows="12" value={this.state.product.product_desc} placeholder={lang('product.form.desc_placeholder')} />
                        <Select
                          name="categories"
                          label={lang('product.category')}
                          multi={true}
                          options={this.state.categories}
                          valueLink={this.linkStateDeep('product.categories')}
                          valueRenderer={(option)=>{return option.name;}}
                          placeholder={lang('product.category_placeholder')} />
                      </div>
                    </div>
                    <div className="box">
                      <div className="box-header">
                        <h3 className="box-title">
                          {lang('product.gallery')}
                        </h3>
                      </div>
                      <div className="box-body">
                        <PhotoEditor photos={this.state.photos} onMove={this.handlePhotoMove} onDelete={this.handlePhotoDelete} onDrop={this.handlePhotoCreate} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="box">
                      <div className="box-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label htmlFor="product_status">
                              {lang('product.status')}
                            </label>
                          </div>
                          <div className="col-md-6">
                            <div className="pull-right">
                              <input type="checkbox" ref="statusToggle" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-footer">
                        <div className="clearfix"></div>
                        <Button bsStyle="primary" bsSize='large' className={this.state.saving ? "btn-disabled":""} disabled={this.state.saving} type="submit" block><i className="fa fa-save"></i>&nbsp;&nbsp;{this.state.saving ? lang('savning'):lang('save')}</Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="box">
                      <div className="box-header">
                        <h3 className="box-title" style={{display:"block"}}>
                          {lang('product.form.price_and_stock')}
                          <a href="javascript:;" title={lang('product.form.edit_options')} onClick={this.handleToggleOptionEditor} style={{fontSize:"0.8em"}} className="pull-right"><i  className="fa fa-gear"></i></a>
                        </h3>
                      </div>
                      {stock}
                    </div>
                  </div>
                </div>
              </Formsy.Form>
            </section>
          </div>
        );
    }
});
