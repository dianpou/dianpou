var Wrapper = React.createClass({
    render: function () {
        return (
            <section className="content">
              <div className="box">
                {this.props.children}
              </div>
            </section>);
    }
});
var Header = React.createClass({
    render: function () {
        return (<div className="box-header row">
                  <div className="col-md-3">
                    <h3 className="box-title">{this.props.title}</h3>
                  </div>
                  <div className="col-md-9 table-menus">
                    {this.props.children}
                  </div>
                </div>);
    }
});
module.exports = {
    Wrapper: Wrapper,
    Header: Header
};
