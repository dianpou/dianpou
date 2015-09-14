var {update} = React.addons;
export class Row extends React.Component {
  static contextTypes = {
    cols: React.PropTypes.any.isRequired,
  }
  static defaultProps = {
      data: {},
      empty: false,
  }
  render(){
    var {data, empty, ...other} = this.props;
    var cols = this.context.cols;
    return (
      <tr {...other}>
        {empty ? <td style={{textAlign:"center"}} colSpan={cols.length}>empty</td> : React.Children.map(cols, (col, i)=>{
          return (
            <td key={i} {...col.props}>
              {col.props.children(data)}
            </td>
          );
        })}
      </tr>
    );
  }
}

export class Column extends React.Component {
  static defaultProps = {
    title: 'Title',
    children: function(){},
  }
  render(){
    var {title, ...other} = this.props;
    return (
      <th {...other}>{this.props.title}</th>
    );
  }
}

export class Table extends React.Component {
  static defaultProps = {
      rows:[]
  }
  static childContextTypes = {
    cols: React.PropTypes.any,
  }
  getChildContext(){
    return {
      cols: this.props.children
    };
  }
  render(){
    var {rows, rowKey, children, ...other} = this.props;
    return (
      <table {...other}>
        <thead>
          <tr>
            {children}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, i)=>{
            return <Row key={rowKey ? row[rowKey] : i} data={row} ref={"row" + i} />
          }) : <Row empty /> }
        </tbody>
      </table>
    );
  }
}
