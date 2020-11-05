import React from 'react';
import {Upload,message } from 'antd';

interface fileProps{
  name:string;
  action:string;
}

const { Dragger } = Upload;

class Fileupload extends React.Component<fileProps,{}>{
    constructor(props:fileProps){
      super(props)
      this.state = {
          name : props.name,
          action : props.action,
          onChange(info:any) {
            const { status } = info.file;
            if (status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (status === 'done') {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
          progress: {
            strokeColor: {
              '0%': '#108ee9',
              '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent:any) => `${parseFloat(percent.toFixed(2))}%`,
          },
      }
    }
    render(){
      return (
        <div>
        <Dragger {...this.state}>
        <p className="ant-upload-drag-icon"></p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </Dragger>
      </div>
      );
    }      
}
export default Fileupload