var parse_filepath   = require('parse-filepath');

module.exports = Assets = React.createClass({
    getInitialState:function(){
        return {basePath:'/libs'};
    },
    render: function  () {
        return (
            <div className="hide">
            {this.props.items.map( (item, i) => {
                var path = this.state.basePath + '/' + item;
                var parsed = parse_filepath(item);
                if (_.last(parsed.extSegments) == '.js') {
                    return <script key={i} type="text/javascript" src={path}></script>;
                } else {
                    return <link key={i} href={path} rel="stylesheet" type="text/css" />;
                }
            })}
            </div>
        );
    }
});



