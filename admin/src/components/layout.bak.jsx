var mixin = require('../libraries/util').mixin;
var Table = React.createClass({
    componentDidMount: function(){
    },
    render: function(){
        var breadcrumb, table_title, filter, menus, table, batchactions, pager;
        this.props.children.map((item, i)=>{
          eval(item.ref + ' = item');
        });

        return (<div className="content-wrapper">
                  {breadcrumb}
                  <section className="content">
                    {alert}
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="box">
                          <div className="box-header">
                            {table_title}
                          </div>
                          <div className="box-body">
                            <div className="row">
                              <div className="col-sm-8">
                                {filter}
                              </div>
                              <div className="col-sm-4 text-right">
                                {menus}
                              </div>
                            </div>
                            {table}
                            <div className="row">
                              <div className="col-sm-6">
                                {batchactions}
                              </div>
                              <div className="col-sm-6 text-right">
                                {pager}
                              </div>
                            </div>
                          </div> {/*box-body*/}
                        </div> {/*box*/}
                      </div> {/*col*/}
                    </div>{/*row*/}
                  </section>
                </div>);
    }
});

var Breadcrumb = require('./breadcrumb'),
    Alert      = require('./alert'),
    Link       = ReactRouter.Link,
    Input      = require('./formsy/input');

var TableComponent = React.createClass({
  mixins: [ReactRouter.State],
  getInitialState (){
    return {
      title: 'Title',
      subtitle: 'Sub Title',
      table_title: 'Table Title',
      items: []
    };
  },
  renderTable () {
    return ('hehe');
  },
  render () {
    console.log(this.renderTable.toString());
    return (<div className="content-wrapper">
              <Breadcrumb title={this.state.title} subtitle={this.state.subtitle} ref="breadcrumb">
                <li><Link to="products"><i className="fa fa-tags"></i>产品列表</Link></li>
                <li className="active">欢迎</li>
              </Breadcrumb>
              <section className="content">
                <Alert ref="alert" />
                <div className="row">
                  <div className="col-xs-12">
                    <div className="box">
                      <div className="box-header">
                        <h3 className="box-title" ref="table_title">{this.state.table_title}</h3>
                      </div>
                      <div className="box-body">
                        <div className="row">
                          <div className="col-sm-8">
                            <Formsy.Form onValidSubmit={this.handleFilter} className="form-inline" ref="filter">
                              <Input name="status" type="select" labelClassName="hide">
                                <option>产品状态</option>
                                <option value="on">上架</option>
                                <option value="off">下架</option>
                              </Input>
                              &nbsp;&nbsp;
                              <Input name="keywords" type="text" labelClassName="hide" className="form-control" placeholder="关键词" />
                              &nbsp;&nbsp;
                              <button type="submit" className="btn btn-flat btn-default"><i className="fa fa-filter"></i>&nbsp;过滤</button>
                            </Formsy.Form>
                          </div>
                          <div className="col-sm-4 text-right">
                            <div className="text-right" ref="menus">
                              <Link className="btn btn-primary" to="product_create"><i className="fa fa-plus"></i>&nbsp;创造</Link>
                            </div>
                          </div>
                        </div>
                        {this.renderTable()}
                        {/*table*/}
                        <div className="row">
                          <div className="col-sm-6">
                            {/*batchactions*/}
                          </div>
                          <div className="col-sm-6 text-right">
                            {/*pager*/}
                          </div>
                        </div>
                      </div> {/*box-body*/}
                    </div> {/*box*/}
                  </div> {/*col*/}
                </div>{/*row*/}
              </section>
            </div>);
  }
});

module.exports ={Table, TableComponent};
