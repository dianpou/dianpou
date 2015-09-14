var Column = React.createClass({
  getContent: function () {
    if (this.props.checkable) {
      return <input type="checkbox" title="Check/Uncheck All" className="checkable-all" />;
    } else if (this.props.sortable) {
      var order, current_sort, current_order;
      current_sort  = this.props.current.sort;
      current_order = this.props.current.order;
      if (current_sort== this.props.sortable) {
        order = current_order;
      }
      if (this.props.default && !current_sort) {
        order = _.isString(this.props.default) ? this.props.default : 'asc';
      }
      var handleClick = (e)=>{
        this.props.onSort.call(this,
          this.props.sortable,
          (order == 'desc' ? 'asc' : 'desc'),
          e);
      };
      current_sort = order ? <i className={'fa fa-sort-' + order}></i> : null;
      return ( <a href="javascript:;" className="sortable-title" onClick={handleClick}>
                {this.props.head}
                {current_sort}
                </a>);
    } else {
      return this.props.head;
    }
  },
  render: function() {
    return (<th {...this.props}>{this.getContent()}</th>);
  }
});

var ColumnContent = React.createClass({
    statics: {
      field: function (field_name, trans) {
        return (function (field_name, trans, item) {
          var contents = trans ? trans.call(this, _.get(item, field_name)) : _.get(item, field_name);
          return <span>{contents}</span>;
        }).bind(null, field_name, trans);
      }
    },
    getContent: function(){
      var {checkable, row, children, ...other} = this.props;
      if (checkable) {
        return <input type="checkbox" name={'checkable_' + checkable} value={row[checkable]} className="checkable-item" />;
      } else if(_.isFunction(children)){
        return children.call(this, this.props.row);
      } else {
        return children;
      }
    },
    render: function  () {
      return (<td {...this.props}>{this.getContent()}</td>);
    }
});


var Row = React.createClass({
  render: function(){
    var {empty, columns} = this.props;
    if (empty) {
      return (
        <tr className="empty text-center">
          <td colSpan={columns.length}>Empty</td>
        </tr>
      );
    } else {
      return (
        <tr className={classNames(this.props.className)}>
          {React.Children.map(this.props.columns, (item, i)=>{
            return React.createElement(ColumnContent, _.extend({key:i, row:this.props.row}, item.props));
          }, this)}
        </tr>
      );
    }
  }
});

class Table extends React.Component {
  static get propTypes(){
    return {
      children: (props, propName, componentName)=>{
        props.children.map((child)=>{
          if (child.type.displayName != 'Column') {
            return new Error('Only Columns can be placed!');
          }
        });
      }
    };
  }
  getCheckedRows() {
    var $dom    = $(React.findDOMNode(this));
    var checked = [];
    $dom.find('.checkable-item:checked').each((index, item)=>{
      checked.push(item.value);
    });

    return checked;
  }

  componentDidMount() {
    var $dom    = $(React.findDOMNode(this));
    $dom.find('.checkable-all').click((e)=>{
      $dom.find('.checkable-item, .checkable-all').prop('checked', e.target.checked);
    });
    $dom.find('.checkable-item').click((e)=>{
      if (!e.target.checked) {
        $dom.find('.checkable-all').prop('checked', e.target.checked);
      }
    });
  }

  render() {
    var rows;
    if (_.isArray(this.props.rows) && !this.props.rowParsed) {
      if (this.props.rows.length === 0) {
        rows = <Row empty columns={this.props.children} />;
      } else {
        rows = this.props.rows.map((item, i)=>{
                  var rowClass = this.props.row ? this.props.row : Row;
                  return React.createElement(rowClass, {key:i, className:this.props.rowClassName, columns:this.props.children, row:item, parentProps:this.props});
               }, this);
      }
    } else if (_.isFunction(this.props.rows)) {
      rows = this.props.rows.call(this, this.props.children);
    } else {
      rows = this.props.rows;
    }
    return (<table {...this.props}>
              <thead>
                {this.props.children}
              </thead>
              <tbody>
              {rows}
              </tbody>
              <tfoot>
                {this.props.children}
              </tfoot>
            </table>);
  }
}

module.exports = {Table, Column, ColumnContent, Row};
