var {Button, Modal} = ReactBootstrap;

export class Message extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      type: 'default',
      title: 'Title',
      message: 'Message',
      cancelButton: false,
      onCancel: this.defaultOnCancel,
      onOK: this.defaultOnOK,
      props:{
        backdrop:true
      },
    };
  }
  defaultOnCancel(hide){
    hide();
  }
  defaultOnOK(hide){
    hide();
  }
  confirm(message, onOK){
    this.setState({
      show:true,
      cancelButton:true,
      title: '请确认',
      message: message,
      onOK: onOK,
    });
  }
  error(message, onOK = null){
    onOK = onOK || this.defaultOnOK;
    this.setState({
      show:true,
      cancelButton:false,
      title: (<span><i className="fa fa-warning"></i>&nbsp;错误</span>),
      message: message,
      onOK: onOK
    });
  }
  handleShow(){
    this.setState({ show:true });
  }
  handleHide(){
    this.setState({show:false});
  }
  handleCancel(onCancel, e){
    this.state.onCancel(this.handleHide.bind(this));
  }
  handleOK(e){
    this.state.onOK(this.handleHide.bind(this));
  }
  render(){
    return (
        <Modal show={this.state.show} bsStyle={this.state.type || 'info'} onHide={this.handleHide.bind(this)} {...this.props} {...this.state.props}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.message}
          </Modal.Body>
          <Modal.Footer>
            <Button className={classNames('pull-left', this.state.cancelButton ? '' : 'hide')} onClick={this.handleCancel.bind(this)}>取消</Button>
            <Button bsStyle="primary" onClick={this.handleOK.bind(this)}><i className="fa fa-check"></i>&nbsp;&nbsp;确定</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
