import Component from './component';

export default class Breadcrumb extends Component {
  static get defaultProps(){
    return {
      title: 'Title',
      subtitle: 'Subtitle',
      paths:[]
    };
  }

  render(){
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
                return <li key={index}><Link to={item.href}><i className={item.icon}></i>{item.text}</Link></li>;
                }
              })}
              {this.props.children}
            </ol>
          </section>
        );
      }
    }
