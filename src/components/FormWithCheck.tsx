import React from 'react';
import { Form, Input, Button } from 'antd';

import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';

export interface FormCheckProps{
    name:string;
    label:string;
    axiosRequest:string
}

const layout = {
    wrapperCol: { span: 20 },
  };
  const tailLayout = {
    wrapperCol: {  span: 4 , offset:8},
  };
  
class FormWithCheck extends React.Component<FormCheckProps , FormCheckProps>{
    constructor(Props:FormCheckProps){
        super(Props);
        this.state = {
            axiosRequest:Props.axiosRequest,
            name :Props.name,
            label:Props.label
        }
    }
    onFinish = async (values:any) =>{
        let res =await axios.post(`${this.state.axiosRequest}` , values)
        console.log(res)
      }

    render(){
        return(
            <div>
                <Form
                    {...layout}
                    layout='inline'
                    onFinish={this.onFinish}
                    method="post"
                >
                    <Form.Item 
                        name= { this.state.name}
                        label={this.state.label}
                        rules = {
                            [
                                {
                                    required:true,
                                },
                                {
                                    validator(rule , value){
                                        let translate = Number(value)
                                         if (translate > 300|| translate <0 || !translate)
                                        {
                                            return Promise.reject('the number must between 0 to 300')
                                        }
                                        else
                                        {
                                            return Promise.resolve()
                                        }
                                    }

                                }
                            ]
                        }
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button htmlType='submit'>Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default FormWithCheck



