import {SidePage, SideTablePage, Modal} from './components/layout';
import {Button} from './components/form';
import {Table, Column} from 'lib/table';

export default class Profile extends SidePage {
  componentWillMount(){
    this.props.parent.breadcrumb({
      subtitle:lang('home.profile'),
      paths:[
        {text:lang('home.title'), icon:"fa fa-home", href:"/home"},
        {text:lang('home.profile'), href:"/home/profile"},
      ]
    });
    this.api.profile.read().done(model=>this.setState({model})).error(this.handleError.bind(this));
  }
  handleBasicSubmit(){
    this.refs.basic_form.touch();
  }
  handleBasicValidSubmit(model, reset, invalid){
    console.log(model);
    this.api.profile.update(model).done((data)=>{
      this.props.parent.refs.notifier.addNotification({
        message:lang('edit_successfully'),
        level:"success"
      });
    }).error(this.handleError.bind(this));
  }
}
