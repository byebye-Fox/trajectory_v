import React from 'react'
import FileUpload from '../../components/FileUpload'

class FileStation extends React.Component{
    render(){
        return(
            <div>
                <FileUpload name="asdfa" action="http://127.0.0.1:8000/write/"></FileUpload>
            </div>
        )
    }            
}

export default FileStation