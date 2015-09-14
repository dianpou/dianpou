var Alert = ReactBootstrap.Alert;
module.exports = React.createClass({
    aliases: {
        'success': 'success',
        'ok': 'success',
        'error': 'danger',
        'err': 'danger',
        'wrong': 'danger',
        'warn': 'warning',
        'warning': 'warning',
        'info': 'info',
        'message': 'info',
    },
    getInitialState: function () {
        return {message:this.initMessage(this.props.message)};
    },
    handleDismiss: function () {
        this.setState({message:null});
    },
    show: function (message_type, message_content, dismissAfter) {
        var message = message_type;
        if (arguments.length > 1) {
            message = {
                bsStyle: message_type,
                message: message_content,
                dismissAfter
            };
        }
        this.setState({message});
    },
    success: function (message, dismissAfter) {
        dismissAfter = dismissAfter || 5000;
        return this.show('success', message, dismissAfter);
    },
    error: function (message, dismissAfter) {
        return this.show('danger', message, dismissAfter);
    },
    warn: function (message, dismissAfter) {
        return this.show('warning', message, dismissAfter);
    },
    info: function (message, dismissAfter) {
        return this.show('info', message, dismissAfter);
    },

    initMessage: function (message) {
        if (!message) {
            return null;
        }

        var bsStyle  = 'info',
            dismissAfter,
            message_content = message;

        if (_.isObject(message)) {
            bsStyle = message.type ? this.aliases[message.type] : 'info';
            dismissAfter = message.dismissAfter;
            message_content = message.message;
        }

        return {
            bsStyle: bsStyle,
            message: message_content,
            dismissAfter: dismissAfter
        };
    },

    render: function () {
        var {message, ...other} = this.props;
        var alert;
        if (this.state.message) {
            alert = (<Alert bsStyle={this.state.message.bsStyle} dismissAfter={this.state.message.dismissAfter} onDismiss={this.handleDismiss} {...other}>
                        {this.state.message.message}
                     </Alert>);
        }
        return (<div>{alert}</div>);
    }
});
