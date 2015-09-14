module.exports = React.createClass({
    getDefaultProps: function () {
        return { onChange: function(){}};
    },
    render: function () {
        var classes = classNames('react-radio', this.props.className);
        return (
            <label className={classes}>
                <input type="radio" {...this.props} onChange={this.props.onChange} />
            </label>
        );
    }
});