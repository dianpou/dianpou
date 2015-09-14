import {TableLayoutPage, ModalFormLayoutPage} from '../components/layout';
import {Files} from '../libraries/api';
import {Table, Column, ColumnContent} from '../components/table';
import {Select, Input, Button} from '../components/form';
import Image from 'components/image';
import Pager from 'components/pager';
import Dropzone from 'react-dropzone';
import CopyToClipboard from 'react-copy-to-clipboard';
import async from 'async';

var update = React.addons.update;
var {Link, RouteHandler} = ReactRouter;

class Index extends TableLayoutPage {
  get breadcrumb(){
    return {
      title: lang('file.title'),
      subtitle: lang('file.subtitle'),
      paths: [
        {text:lang('index'), icon:'fa fa-home', href:this.context.router.makeHref('index')},
        {text:lang('file.title')}
      ]
    };
  }
  get model(){
    return {
      routeName: 'files',
      api:       Files,
    };
  }
  handleUpload(files){
    async.each(files, (file, cb)=>{
      var reader = new FileReader();
      reader.onload =  (event) => {
        this.model.api.create({
          file_name: file.name,
          file: event.target.result
        }).done(data=>cb()).error(cb);
      };
      reader.readAsDataURL(file);
    }, (err)=>{
      if (err) {
        this.handleError(err);
      } else {
        this.refreshWithMessage(lang('file.upload_successfully'));
      }
    });
  }
  renderContent(){
    return (
      <div className="box">
        <div className="box-body files">
          <Dropzone onDrop={this.handleUpload.bind(this)} style={{}}>
            {lang('drop_here_to_upload')}
          </Dropzone>
          <div className="list">
            {this.state.table.rows.map((row, i)=>{
              return (
                <div key={row.id} className="file">
                  <Image className="image-with-caption" src={row.file_path}>
                    <div className="caption caption-center">
                      <CopyToClipboard text={row.file_path} onCopy={()=>{alert(lang('file.copied', {path:row.file_path}))}}>
                        <a href="javascript:;" title={lang('file.copy_path')}><i className="fa fa-clipboard"></i></a>
                      </CopyToClipboard>&nbsp;
                      <a href="javascript:;" onClick={this.handleRowDeleteClick.bind(this, row)} title={lang('delete')}><i className="fa fa-trash"></i></a>
                    </div>
                  </Image>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            {this.renderTablePager()}
          </div>
        </div>
      </div>
    );
  }
}

export default {Index};
