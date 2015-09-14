import Component from './component';
export default class Pager extends Component {
  get defaultPerPage(){
    return 10;
  }
  getUrl(page) {
    return this.context.router.makeHref(this.props.location.pathname, Object.assign(_.clone(this.props.location.query)||{}, {page}));
  }
  render(){
    var {perPage, total, current, location, ...other} = this.props;
    other.className = classNames('pagination', other.className);
    if (parseInt(total) === 0) {
      return (<ul {...other}><li></li></ul>);
    } else {
      var total, start, end, collspan = {left:null, right:null}, current, prev, next, first, latest, tmp;
      total = Math.ceil(total / (perPage || this.defaultPerPage));
      current = (current = Number(current)) > total ? total : current || 1;
      start = (tmp = current - 3) > 3 ? (total > 6 && (tmp > total - 6) ? total - 6 : tmp) : 1;
      end   = (tmp = current + 2) < total - 2 ? ((total > 6 && tmp < 6 ? 6 : tmp)) : total;
      prev  = (tmp = current - 1) > 0 ? tmp : 1;
      next  = (tmp = current + 1) < total ? tmp : total;

      if ((tmp = start - 1) > 0 ) {
        first  = (<li className="paginate-button">
          <Link to={this.getUrl(1)} data-dt-idx={1} tagIndex={1}>{1}</Link>
          </li>);
        collspan.left = (<li className="paginate-button">
          <Link to={this.getUrl(tmp)} data-dt-idx={tmp} tagIndex={tmp}>...</Link>
          </li>);
      }
      if ((tmp = end + 1) < total) {
        collspan.right = (<li className="paginate-button">
          <Link to={this.getUrl(tmp)} data-dt-idx={tmp} tagIndex={tmp}>...</Link>
          </li>);
        latest = (<li className="paginate-button">
          <Link to={this.getUrl(total)} data-dt-idx={total} tagIndex={total}>{total}</Link>
          </li>);
      }

      return (<ul {...other}>
                <li className="paginate-button previous" id="example1_previous">
                    <Link to={this.getUrl(prev)} data-dt-idx={prev} tagIndex={prev}><i className="fa fa-angle-double-left"></i></Link>
                </li>
                {first}
                {collspan.left}
                {_.seq(start, end).map(function (i) {
                    return (<li key={i} className={i == current ? "paginate-button active" : "paginate-button"}>
                              <Link to={this.getUrl(i)} data-dt-idx={i} tagIndex={i}>{i}</Link>
                            </li>);
                }, this)}
                {collspan.right}
                {latest}
                <li className="paginate-button next" id="example1_next">
                    <Link to={this.getUrl(next)} data-dt-idx={next} tagIndex={next}><i className="fa fa-angle-double-right"></i></Link>
                </li>
              </ul>);
      }
  }
}
