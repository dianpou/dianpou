import ReactIntl from 'react-intl';
import {formatPattern} from 'react-router/lib/URLUtils';
import Component from './component';

export default class Page extends Component {
  get meta() {
    return {
      resource:null,
    };
  }
  get model(){
    return this.meta.resource ? this.api[this.meta.resource] : this.api;
  }
  getTemplate(fileName = null){
    return require('../templates/' + fileName);
  }
  get template(){
    return this.getTemplate(this.constructor.name.toLowerCase());
  }
  refresh(){

  }
  renderChildren(){
    if (this.props.children) {
      return React.cloneElement(this.props.children, {parent:this});
    }
  }
  handleError(err){
    console.error(err);
  }
}
