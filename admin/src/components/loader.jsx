export default class Loader extends React.Component {
  render(){
    var loader = (
      <div className={classNames("loading-bar", this.props.className)}>
        <span className="loading">loading...</span>
      </div>
    );
    return this.props.loaded ? this.props.children : loader;
  }
}
Loader.defaultProps = {
  loaded: false
};
