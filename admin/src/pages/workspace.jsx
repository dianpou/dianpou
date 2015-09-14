var Breadcrumb = require('../components/breadcrumb');
var Link = ReactRouter.Link;
module.exports = React.createClass({
    render: function  () {
        return (
          <div className="content-wrapper">
            <Breadcrumb title="Title" subtitle="subtitle">
              <li><Link to="dashboard"><i className="fa fa-dashboard"></i> 首页</Link></li>
              <li className="active">欢迎</li>
            </Breadcrumb>
            <section className="content">
            </section>
          </div>
        );
    }
});