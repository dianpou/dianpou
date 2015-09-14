import config from '../config';
import {Auth} from '../libraries/api';
import {Page} from '../components/component';
import {Form, Input, Button} from '../components/form';

class Signin extends Page {
  constructor(props, context) {
    super(props, context);
    this.state = {pending:false, error: false};
  }
  handleError(invalidate, err) {
    invalidate({username:'wrong', password:'wrong'});
    $(React.findDOMNode(this)).find('.login-box-body').height(223).effect('shake', null, 500, function(){
      $(this).height(183);
    });
    this.setState({pending:false, error: true});
  }
  handleSignin(account, reset, invalidate) {
    this.refs.form.touch();
    this.setState({pending: true});
    Auth.create(_.extend({
      "grant_type": "password",
      "client_id": config.api.client_id,
      "client_secret": config.api.client_secret,
      "user_type": "admin"
    }, account)).done((session, status, xhr)=>{
      localStorage.setItem('session', JSON.stringify(session));
      this.setState({pending:false, error:false});
      window.location.href = this.context.router.makeHref('index');
    }).error(this.handleError.bind(this, invalidate));
  }
  render() {
      return (
        <div className="login-box">
          <div className="login-logo">
            <a href="index2.html"><b>Dian</b>pou</a>
          </div>
          <div className="login-box-body">
            <p className="login-box-msg">{lang('session.signin_tips')}</p>
            <Form onSubmit={this.handleSignin.bind(this)} ref="form">
              <Input name="username" type="text" placeholder="Email" validations="isEmail" required groupClassName="has-feedback">
                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
              </Input>
              <Input name="password" type="password" placeholder="Password" required groupClassName="has-feedback">
                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
              </Input>
              <div className="row">
                <div className="col-xs-8">
                  <div className="checkbox">
                    <label>
                    </label>
                  </div>
                </div>
                <div className="col-xs-4">
                  <Button type="submit" bsStyle="primary" className="btn-block btn-flat" pending={this.state.pending}>{lang('signin')}</Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      );
  }
}

class Signout extends Page {
  static willTransitionTo(transition, params, query, cb){
    localStorage.removeItem('session');
    transition.redirect('signin');
    cb();
  }
  render(){
    return;
  }
}

export default {Signin, Signout};
