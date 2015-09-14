var Breadcrumb = React.createClass({
    getDefaultProps(){
      return {
        title: 'Default title',
        subtitle: 'Default subtitle',
        paths: []
      }
    },
    render: function () {
        return (
            <section className="content-header">
              <h1>
                {this.props.title}
                <small>{this.props.subtitle}</small>
              </h1>
              <ol className="breadcrumb">
                {this.props.paths.map((item, index)=>{
                  if (index + 1 == this.props.paths.length) {
                    return <li key={index} className="active"><i className={item.icon}></i>{item.text}</li>;
                  } else {
                    return <li key={index}><a href={item.href}><i className={item.icon}></i>{item.text}</a></li>;
                  }
                })}
                {this.props.children}
              </ol>
            </section>
        );
    }
});

module.exports = Breadcrumb;
