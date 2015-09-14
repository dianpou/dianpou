module.exports = React.createClass({
    sizeMapping: {
        mini:[48, 48],
        small:[64, 64],
        medium:[128, 128],
        large:[256, 256]
    },
    componentDidMount: function () {
        if (!this.props.src) {
            Holder.run();
        }
    },
    componentDidUpdate: function () {
        if (!this.props.src) {
            Holder.run();
        }
    },
    getDefaultProps: function () {
        return {
            size: 'medium',
            placeholder: "No image",
            inlineStyle:{}
        };
    },
    render: function () {
        var { size, placeholder, className, imgClassName, inlineStyle, ...other } = this.props;
        var custom_size, size_name;
        var [ width, height ] = _.isArray(size) ? size : _.get(this.sizeMapping, size, [64, 64]);
        if (_.isArray(size)) {
            custom_size = {
                width: width + 'px',
                height: height + 'px',
                lineHeight: height + 'px'
            };
        } else {
            size_name = 'x-' + size;
        }
        var placeholder = "holder.js/"+width+"x"+height+"?text=" + placeholder;

        return (<div className={classNames("aspect-ratio-image", size_name, className)} style={custom_size}>
                    <img data-src={this.props.src ? null : placeholder}
                         {...other}
                         className={classNames(imgClassName)} />
                </div>
                );
    }
});