module.exports = React.createClass({
  mixins: [Formsy.Mixin],
  getInitialState: function () {
    return {touched:false};
  },
  getDefaultProps: function () {
      return {
        onChange: function(){}
      };
  },
  changeValue: function (onChange, newValue) {
    this.touch();
    this.setValue(newValue);
    onChange(newValue);
  },
  touch: function () {
    this.setState({touched:true})
  },
  render: function(){
      var label, errorMessage = this.getErrorMessage();
      var localProps = {
          value: this.getValue(),
          onChange: _.wrap(this.props.onChange || function(value){}, (f, v)=>{this.changeValue(f, v);})
      };
      if (this.props.label) {
         label=(<label className={"control-label" + (this.props.labelClassName ? ' ' + this.props.labelClassName : '')}>
                    {this.isRequired() ? '* ' : null}{this.props.label}
                    <span className="message">
                      {errorMessage ? '(' + errorMessage + ')' : null}
                    </span>
            </label>);
      };
      var requiredProps = {
        onBlur: _.wrap(this.props.onBlur || function(e){}, (f, e)=>{this.touch();f(e);}),
        className: ((this.state.touched && this.showRequired()) || this.showError()) ? 'error' : null
      };
      return (
        <div className={"form-group" + (this.props.groupClassName ? ' ' + this.props.groupClassName : '')}>
          {label}
          <window.ReactSelect {...this.props} {...localProps} {...requiredProps}  />
        </div>
      );
  }
});
