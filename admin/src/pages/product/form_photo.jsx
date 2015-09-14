import {DragSource, DropTarget, DragDropContext} from 'react-dnd';
var HTML5 = require('react-dnd/modules/backends/HTML5');

var OverlayTrigger  = ReactBootstrap.OverlayTrigger,
    update          = React.addons.update,
    Popover         = ReactBootstrap.Popover,
    Image           = require('../../components/image');



var zoneTarget  = {
    drop: function (props, monitor, component) {
        props.onDrop(monitor.getItem().files);
    }
};
var zoneTargetConnect = function (connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
};

var Dropzone    = DropTarget(HTML5.NativeTypes.FILE, zoneTarget, zoneTargetConnect)(React.createClass({
    render: function () {
        var connectDropTarget = this.props.connectDropTarget;
        return connectDropTarget(<div className="drop-zone" onClick={this.props.onClick}><i className="fa fa-photo fa-lg"></i>&nbsp;{lang('product.form.drop_here_to_upload')}</div>);
    }
}));
var DropPlace   = DropTarget(HTML5.NativeTypes.FILE, zoneTarget, zoneTargetConnect)(React.createClass({
    render: function () {
        var connectDropTarget = this.props.connectDropTarget;
        return connectDropTarget(
                    <div className="drop-place x-medium" onClick={this.props.onClick}>
                        <i className="fa fa-plus"></i>
                    </div>
);
    }
}));

var photoSource = {
    beginDrag: function (props) {
        return props.item;
    }
};

var photoSourceConnect = function (connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
  };
};

var photoTarget = {
    hover: function (props, monitor) {
        var draggedId = monitor.getItem().id;
        if (draggedId !== props.item.id) {
            props.onMove(draggedId, props.item.id);
        };
    }
};
var photoTargetConnect = function (connect) {
    return {
          connectDropTarget: connect.dropTarget()
    };
}

var Photo = DropTarget('photo', photoTarget, photoTargetConnect)(DragSource('photo', photoSource, photoSourceConnect)(React.createClass({
    render: function () {
        var connectDragSource = this.props.connectDragSource,
            connectDropTarget = this.props.connectDropTarget,
            isDragging        = this.props.isDragging,
            opacity           = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <li style={{opacity}}>
                <Image className="image-with-caption" src={this.props.item.file.file_path}>
                  <div className="caption caption-center">
                    <ul className="list-unstyled">
                        <li>
                          <a href={this.props.item.file.file_path} target="_blank"><i className="fa fa-lg fa-eye"></i></a>
                        </li>
                        <li>
                          <a href="javascript:;" onClick={this.props.onDelete}><i className="fa fa-lg fa-trash-o"></i></a>
                        </li>
                    </ul>
                  </div>
                </Image>
            </li>
        ));
    }
})));


          // <div className="photo" style={{opacity:opacity}}>
          //   <div className="image-with-caption">
          //     <span className="vertical-align-helper"></span>
          //     <img src={this.props.item.file.file_path} alt={this.props.item.file.file_name} />
          //   </div>
          // </div>

module.exports = DragDropContext(HTML5)(React.createClass({
    handleMove: function  (draggedId, targetId) {
        this.props.onMove(draggedId, targetId);
    },
    handleDelete: function (item, e) {
        e.preventDefault();
        this.props.onDelete(item);
    },
    handleDrop: function (files) {
        this.props.onDrop(files);
    },
    handleAdd: function () {
        var $input = $(React.findDOMNode(this.refs['new_file']));
        $input.click();
    },
    handleUploadChange: function (e) {
        var onDrop = this.props.onDrop || function(files){};
        onDrop(e.target.files);
    },
    render: function () {
        var contents;
        if (this.props.photos.length > 0) {
            contents = (
                <ul className="list-unstyled photos">
                    {this.props.photos.map((item, i)=>{
                        return <Photo key={item.id} item={item} onMove={this.handleMove} onDelete={this.handleDelete.bind(this, item)} />;
                    })}
                    <li><DropPlace onDrop={this.handleDrop} onClick={this.handleAdd} /></li>
                </ul>);
        } else {
            contents = <Dropzone onDrop={this.handleDrop} onClick={this.handleAdd} />;
        }
        return (
            <div>
                <div className="hide">
                    <input type="file" multiple onChange={this.handleUploadChange} ref="new_file" />
                </div>
                {contents}
            </div>
        );
    }
}));
