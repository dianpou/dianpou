import {Topnav} from './components/layout';
import config from 'config';
import {api} from 'lib/api';
import async from 'async';
import Bag from 'bag';

export function signout(s, t) {
    delete localStorage.access_token;
    delete window.User;
    t.to('/session/signin');
}

export function init(s, t, cb) {
  async.waterfall([
    (acb)=>{
      if (!localStorage.access_token) {
        Signin
             .getAccessToken({
               username:'guest',
               password:'guest',
               grant_type:'guest'})
             .then(t=>acb())
             .catch(acb);
      } else {
        acb();
      }
    },
    (acb)=>{
      if (!window.User) {
        Signin.getCurrentUser().then(t=>acb()).catch(acb);
      } else {
        acb();
      }
    }
  ], (err)=>{
    if (err && err.status == 401) {
      // 清空access_token 重新获取
      delete localStorage.access_token;
      init(s, t, cb);
    } else {
      err && console.error(err);
      cb(err);
    }
  });
}

export class Signin extends Topnav {
  static signedInRequired(s, t){
    var user = window.User;
    if (!user || user.guest) {
      t.to('/session/signin');
    }
  }

  static openid(s, t, cb){
    Signin.getAccessToken({
      grant_type:"openid",
      username:s.location.query.email,
      password:s.location.query.token,
    }).then((data)=>{
      Signin.getCurrentUser().then((data)=>{
        t.to('/');
        cb();
        // move bags to current user
        async.each(this.state.bags.items, (bag, acb)=>{
          this.api.bags.create(_.pick(bag, ['product_id', 'sku', 'quantity']))
                  .done(()=>{acb();})
                  .error(acb);
        }, (err)=>{
          err && console.error(err);
        });
      }).catch(cb);
    }).catch(cb);
  }

  static getAccessToken(user){
    user.grant_type = user.grant_type || 'password';
    return new Promise((resolve, reject)=>{
      api.auth.create('signin', Object.assign({
        client_id: config.api.client_id,
        client_secret: config.api.client_secret,
      }, user)).done((data, status, xhr)=>{
        localStorage.access_token = data.access_token;
        resolve(data);
      }).error(reject);
    });
  }
  static getCurrentUser(){
    return new Promise((resolve, reject)=>{
      api.session.read().done((data)=>{
        window.User = data;
        resolve(data);
      }).error(reject);
    });
  }
  constructor(...args){
    super(...args);
    this.state = Object.assign(this.state, {
      signingIn: false,
      signingUp: false,
    });
  }
  handleSignupSubmit(model, reset, invalid){
    this.setState({signingUp:true});
    console.log(model);
    setTimeout(()=>{
      this.setState({signingUp:false});
    }, 1000)
  }
  handleSigninSubmit(model, reset, invalid){
    var guest_token = localStorage.access_token;
    this.setState({signingIn:true});
    Signin.getAccessToken(model).then(()=>{
      this.setState({signingIn: false});
      Signin.getCurrentUser().then(()=>{
        // move bags to current user
        async.each(this.state.bags.items, (bag, cb)=>{
          this.api.bags.create(_.pick(bag, ['product_id', 'sku', 'quantity']))
                  .done(()=>{cb();})
                  .error(cb);
        }, (err)=>{
          err && console.error(err);
        })
        if (this.context.router.goBack()) {
          this.context.router.transitionTo('/');
        }
      }).catch(this.handleError.bind(this));
    }).catch((err)=>{
      this.setState({signingIn: false});
      invalid({username:"", password:""});
      this.handleError(err);
    });
  }
}

export class Openid extends Topnav {
  componentDidMount(){
    Signin.getAccessToken({
      grant_type:"openid",
      username:this.props.location.query.email,
      password:this.props.location.query.token,
    }).then((data)=>{
      Signin.getCurrentUser().then((data)=>{
        // move bags to current user
        async.each(this.state.bags.items, (bag, acb)=>{
          this.api.bags.create(_.pick(bag, ['product_id', 'sku', 'quantity']))
                  .done(()=>{acb();})
                  .error(acb);
        }, (err)=>{
          err && console.error(err);
        });
        // if (this.context.router.goBack()) {
        this.context.router.transitionTo('/');
        // }
      }).catch(this.handleError.bind(this));
    }).catch(this.handleError.bind(this));
  }
  render(){
    return (<div>redirecting...</div>);
  }
}
