export default class Loader extends React.Component {
  static defaultProps = {
    className: 'loading-bar',
  };
  renderLoader(props){
    return (
      <div {...props}>
        <span className="loading">loading...</span>
      </div>
    );
  }
  render(){
    var {loaded, children, ...other} = this.props;
    if (loaded) {
      return <div>{children}</div>;
    } else {
      return this.renderLoader({...other});
    }
  }
}
