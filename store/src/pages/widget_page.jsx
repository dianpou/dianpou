import scriptjs from 'scriptjs';
import config from 'config';
import {Topnav} from 'pages/components/layout';
import ScrollMagic from 'scrollmagic';

export default class WidgetPage extends Topnav {
  static loadWidgets(s, t, cb){
      if (!$('link[rel=stylesheet][href$="plugins.css"]').length) {
        loadCSS(config.api.endpoint + '/assets/css/widgets.css', $(document.head).children().get(-1));
      }
      scriptjs(config.api.endpoint + '/assets/js/widgets.js', cb);
  }
  constructor(...args){
    super(...args);
    this.scrollmagic = null;
  }
  componentWillMount(){
    this.loadPage(this.props.location.pathname);
    return super.componentWillMount();
  }
  loadPage(pathname){
    pathname = pathname[0] == '/' ? pathname.substr(1) : pathname;
    this.api.pages.read(pathname ? pathname : 'index').done((data)=>{
      this.setState(data.settings);
    }).error(this.handleError.bind(this));
  }
  componentWillReceiveProps(p, s){
    if (p.location.navigationType == 'PUSH' && (p.location.pathname != this.props.location.pathname||p.location.query!=this.props.location.query)) {
      this.loadPage(p.location.pathname);
    }
  }
  componentDidMount(){
    this.initEffect();
    super.componentDidMount();
  }
  componentWillUpdate(){
    if ($.fn.fullpage.destroy) {
      $.fn.fullpage.destroy('all');
    }
    if (this.scrollmagic) {
      this.scrollmagic.destroy();
    }
  }
  componentDidUpdate(){
    this.initEffect();
  }
  initEffect(){
    if (this.state.effect) {
      var {name, ...options} = this.state.effect;
      switch (name) {
        case 'fullpage':
          $('#widgets_container').fullpage({
            ...options,
            css3:true,
            navigation:true,
            navigationPosition:'right',
            sectionSelector:".widget",
            fixedElements:".offical.header",
            afterRender: function () {
              $('.offical.header').addClass('fixed');
            },
            // onLeave: function(index, nextIndex, direction){
            //   var leavingSection = $(this);
            //   //after leaving section 2
            //   if(index == 1 && direction =='down'){
            //     $('.main-header').slideUp();
            //     $('.offical.header').animate({ top:0 });
            //   } else if(index == 2 && direction == 'up'){
            //     $('.main-header').slideDown();
            //     $('.offical.header').animate({ top:50 });
            //   } else if(index == 4 && direction == 'down'){
            //   }
            // }
          });
          break;
        case 'scrollmagic':
          this.scrollmagic = new ScrollMagic.Controller();
          options.pins.forEach((pin, i)=>{
            var {element, scene, settings} = pin;
            new ScrollMagic.Scene(scene)
            .setPin(element, settings).addTo(this.scrollmagic) // pins the element for the the scene's duration
          });
          // var scene = new ScrollMagic.Scene({
          //   // pushFollowers:false,
          //   offset: 50      // start this scene after scrolling for 50px
          // })
          // .setPin("#product_header", {pushFollowers:false}).addTo(this.scrollmagic) // pins the element for the the scene's duration
          // scene.addIndicators();
          break;
        default:

      }
    }
  }

  get initialState(){
    return {
      effect:false,
      widgets:[],
    };
  }
}
