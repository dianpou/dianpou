module.exports = React.createClass({
    // Add the Formsy Mixin
    mixins: [Formsy.Mixin, React.addons.LinkedStateMixin],

    getInitialState: function () {
      return {touched:false};
    },
    componentWillReceiveProps: function (nextProps, nextState) {
      if (nextProps.valueLink) {
        if (nextProps.valueLink.value != this.getValue()) {
          this.setValue(nextProps.valueLink.value);
        };
      };
    },
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue: function (onChange, newValue) {
      this.touch();
      this.setValue(newValue);
      onChange(newValue);
    },
    touch: function () {
      this.setState({touched:true})
    },

    render: function () {
      // Set a specific className based on the validation
      // state of this component. showRequired() is true
      // when the value is empty and the required prop is
      // passed to the input. showError() is true when the
      // value typed is invalid
      var label, bsStyle, errorMessage = this.getErrorMessage(), localProps, requiredProps;
      if (this.props.label) {
        label = (<div>
                    {this.isRequired() ? '* ' : null}{this.props.label}
                    <span className="message">
                      {errorMessage ? '(' + errorMessage + ')' : null}
                    </span>
                </div>);
      }

      requiredProps = {
        label: label,
        onBlur: _.wrap(this.props.onBlur || function(e){}, (f, e)=>{this.touch();f(e);}),
        bsStyle:((this.state.touched && this.showRequired()) || this.showError()) ? 'error' : null
      };

      if (this.props.valueLink) {
        this.props.valueLink.requestChange = _.wrap(this.props.valueLink.requestChange, this.changeValue);
      } else {
        localProps = {
          value: this.getValue(),
          onChange: _.wrap(this.props.onChange || function(value){}, (f, e)=>{this.changeValue(f, e.currentTarget.value);})
        };
      }

      return (<ReactBootstrap.Input {...this.props} {...localProps} {...requiredProps} />);
    }
});