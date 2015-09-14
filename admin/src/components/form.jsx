module.exports = {};

var FormsyInput = React.createClass({
  mixins: [Formsy.Mixin, React.addons.LinkedStateMixin],
  getInitialState(){
    return {touched: false};
  },
  componentWillReceiveProps: function (nextProps, nextState) {
    if (nextProps.valueLink) {
      if (nextProps.valueLink.value != this.getValue()) {
        this.setValue(nextProps.valueLink.value);
      }
    }
  },
  touch(){
    this.setState({touched: true});
  },
  wrapTouch(func){
    return _.wrap(func || function(){}.bind(this), (f, ...args)=>{
        this.touch();
        f(...args);
    });
  },
  render(){ return; }
});

class Form extends Formsy.Form {
  touch(){
    _.forIn(this.inputs, function(v, k) {
      if (typeof (v.touch) == 'function') {
        v.touch();
      }
    });
  }
}

class Select extends FormsyInput {
  render(){
    var {value, valueLink, onChange, onBlur, label, labelClassName, groupClassName, ...other} = this.props;
    var labelHTML;

    if (valueLink) {
      onChange = onChange ? _.wrap(onChange, (f, ...args)=>{
        valueLink.requestChange(...args);
        f(...args);
      }) : valueLink.requestChange;
    }

    if (label) {
      labelHTML = (
        <label className={classNames('control-label', labelClassName)}>
          {this.isRequired() ? '* ' : ''}{label}
          <span className="message">{this.getErrorMessage()}</span>
        </label>
      );
    }

    var hasError = ((this.state.touched && this.showRequired()) || this.showError()) ? 'has-error' : null;

    onChange = _.wrap(this.wrapTouch(onChange), (f, v, options)=>{
      this.setValue(v);
      f(v, options);
    });

    return (
      <div className={classNames("form-group", groupClassName, hasError)}>
        {labelHTML}
        <window.ReactSelect
          value={this.getValue()}
          onBlur={this.wrapTouch(onBlur)}
          onChange={onChange}
          {...other} />
      </div>
    );
  }
}

class Input extends FormsyInput {
  render(props = {}){
    var {type, value, valueLink, onChange, onBlur, label, labelClassName, ...other} = this.props;
    var baseProps = {onChange}, labelHTML;

    baseProps.type = type;

    if (valueLink) {
      baseProps.onChange = valueLink.requestChange;
    }

    if (label) {
      baseProps.label = (
        <label className={classNames('control-label', labelClassName)}>
          {this.isRequired() ? '* ' : ''}{label}
          <span className="message">{this.getErrorMessage()}</span>
        </label>
      );
    }
    baseProps.bsStyle = ((this.state.touched && this.showRequired()) || this.showError()) ? 'error' : null;
    baseProps.onChange = _.wrap(this.wrapTouch(baseProps.onChange), (f, e)=>{
      this.setValue(e.currentTarget.value);
      f(e.currentTarget.value, e);
    });

    baseProps.onBlur=this.wrapTouch(onBlur);
    baseProps.value = this.getValue();

    props = Object.assign(baseProps, {...other}, props);

    return (
      <ReactBootstrap.Input {...props} />
    );
  }
}
class DateRangePicker extends Input {
  static get defaultProps(){
    return {
      delimiter:' - ',
      options:{
        locale:{
          format:'YYYY/MM/DD'
        }
      },
      addonBefore:(<i className="fa fa-calendar" style={{cursor:"pointer"}}></i>),
      addonAfter:(<span className="caret" style={{cursor:"pointer"}}></span>),
    };
  }
  componentDidMount(){
    var $dom = $(React.findDOMNode(this));
    var value = this.getValue() || [];
    var options = Object.assign({
      startDate: _.get(value, 0),
      endDate: _.get(value, 1),
    }, this.props.options);
    $dom.daterangepicker(options, (start, end)=>{
      this.touch();
      var format = _.get(this.props.options, 'locale.format', 'YYYY/MM/DD');
      super.setValue([start.format(format), end.format(format)]);
    });
  }
  setDate(v){
    return this.setValue(v.split(this.props.delimiter));
  }
  getDate(){
    var v = this.getValue()||[];

    if (this.props.options.singleDatePicker) {
      return _.first(v);
    } else {
      return v.join(this.props.delimiter);
    }
  }
  render(){
    return super.render({value:this.getDate(), type:'text', onChange:(e)=>{
      this.touch();
      this.setDate(e.target.value);
    }});
  }
}
class Button extends React.Component {
  render(){
    var {className, children, pending, ...other} = this.props;
    var text, disabled;
    if (pending) {
      disabled = "disabled";
      text     = 'Pending...';
    } else {
      disabled = null;
      text     = children;
    }
    return <ReactBootstrap.Button className={classNames(className, disabled)} {...other}>{text}</ReactBootstrap.Button>;
  }
}

export default {Form, Select, Input, Button, DateRangePicker};
