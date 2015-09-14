module.exports = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render(){
    return (
        <div className={"form-group has-feedback" + (this.props.groupClassName ? ' ' + this.props.groupClassName : '')}>
          <input {...this.props} value={this.getValue()} onChange={this.changeValue} />
          <span className={this.props.feedbackClassName}></span>
        </div>
      );
  }
});