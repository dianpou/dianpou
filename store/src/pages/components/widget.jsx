import Component from './component';

export class Widget extends Component {
  get classns(){
    return 'widget';
  }
  static get defaultProps(){
    return {
      data:{},
      className:this.classns,
    };
  }
  handleError(err){
    console.error(err);
  }
  render(){
    var {data, className, index, ...other} = this.props;
    return (
      <div className={classNames(this.classns, className)} {...other}>
        {this.renderWidget(data, index)}
      </div>
    );
  }
  renderWidget(data, index){
    return <div dangerouslySetInnerHTML={{__html:data}}></div>;
  }
}
