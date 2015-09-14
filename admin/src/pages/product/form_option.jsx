var {Modal} = ReactBootstrap;
var OptionGroup = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {
        return {
            name: this.props.option.name,
            options: this.props.option.options
        };
    },
    getDefaultProps: function () {
        return {
            removeButtonDisabled: true,
            onChange: function (index, option) { console.log(index, option); }
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps.option);
    },
    handleNameChange: function () {
        this.setState({
            name: this.refs.name.getValue()
        }, ()=>{
            this.props.onChange(this.state);
        });
    },
    handleOptionChange: function (options, changed) {
        this.setState({
            options
        }, ()=>{
            this.props.onChange(this.state);
        });
    },
    beforeTagRemove: function (tag) {
        return this.props.beforeOptionRemove(this.props.groupId, tag);
    },
    handleRemove: function (a, b, c) {
        return false;
    },
    render: function () {
        var remove_button;
        if (this.props.removeButtonDisabled) {
            remove_button = (
                        <a href="javascript:;"
                           className="remove-item-button pull-right remove-button-disabled">
                           <i className="fa fa-minus-circle"></i>
                        </a>
            );
        } else {
            remove_button = (
                        <a href="javascript:;"
                           className="remove-item-button pull-right"
                           onClick={this.props.onRemove}>
                           <i className="fa fa-minus-circle"></i>
                        </a>
            );
        }
        return (
                <div className="row">
                    <div className="col-xs-3">
                        <ReactBootstrap.Input onChange={this.handleNameChange} value={this.state.name} ref="name" type="text" name="name" labelClassName="hide" placeholder={lang('product.option.name')} />
                    </div>
                    <div className="col-xs-9">
                        {remove_button}
                        <ReactTagsInput addKeys={[13, 188]} onChange={this.handleOptionChange} value={this.state.options} ref="options" beforeTagRemove={this.beforeTagRemove} placeholder={lang('product.option.options')} />
                    </div>
                </div>
        );
    }
});
module.exports = React.createClass({
    getInitialState: function () {
        return {
            options: _.clone(this.props.options) || [{name:'', options:[]}]
        };
    },
    getDefaultProps: function () {
        return {
            onDestroy: function(){},
            beforeGroupRemove: function(){ return true; },
            beforeOptionRemove: function(){ return true; },
            onSubmit: function (options) { console.log(options); }
        };
    },
    getOptions: function () {
        return _.filter(this.state.options, (option)=>{
            return (option.name && option.options.length > 0);
        });
    },
    handleAdd: function () {
        var options = this.state.options;
        options.push({name:'', options:[]});
        this.setState({
            options: options
        });
    },
    handleOptionChange: function (index, option) {
        var options = this.state.options;
        options[index] = option;
        this.setState({options});
    },
    handleRemove: function (i) {
        if (!this.props.beforeGroupRemove(i, this.state.options[i].options)) {
            return;
        };
        var options = this.state.options;
        _.remove(options, (v, k)=>{return k == i;});
        this.setState({options});
    },
    handleDestroy: function (e) {
        this.props.onDestroy();
        this.props.onHide(e);
    },
    handleSubmit: function () {
        this.props.onSubmit(this.getOptions());
    },
    render: function () {
        return (
          <Modal {...this.props} title={lang('product.option.edit')} backdrop={false} animation={true}>
              <div className='modal-body option-editor'>
                    {this.state.options.map((item, i)=>{
                        return <OptionGroup key={i}
                                            groupId={i}
                                            onChange={this.handleOptionChange.bind(this, i)}
                                            option={item}
                                            // removeButtonDisabled={this.state.options.length === 1 ? true : false}
                                            removeButtonDisabled={false}
                                            beforeOptionRemove={this.props.beforeOptionRemove}
                                            onRemove={this.handleRemove.bind(this, i)} />
                    })}
                <div className="row">
                    <div className="col-md-12 option-add">
                        <a href="javascript:;" ref="add_button" onClick={this.handleAdd}><i className="fa fa-plus"></i>&nbsp;&nbsp;{lang('product.option.create')}</a>
                    </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.props.onHide} className="btn btn-default pull-left">
                    <i className="fa fa-remove"></i>
                    &nbsp;{lang('close')}
                </button>
                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}><i className="fa fa-check"></i>&nbsp;{lang('confirm')}</button>
              </div>
          </Modal>
        );
    }
});
