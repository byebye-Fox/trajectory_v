import React from "react"
import ReactDOM from "react-dom"

import Fileupload from "../../components/FileUpload"

class DataFileUpload extends React.Component{

    render(){
        return (
            <Fileupload name={"1"} action='http://127.0.0.1:8000/write/'></Fileupload>
        )
    }
}
export default DataFileUpload