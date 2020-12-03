import React from 'react'
import ReactDOM from 'react-dom'
//@ts-ignore
import {connect} from 'react-redux'

import {Divider , Card, Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import axios from 'axios'

//@ts-ignore
import $ from 'jquery'

class Login extends React.Component{
    constructor(props:any){
        super(props)   
        console.log(typeof(props))
        console.log(props) 
    }
    onFinish = async (value:any)=>{
        await axios.post(`http://127.0.0.1:8000/login/`,value)
        .then(
            res=>{
                localStorage.clear()
                let theRes =eval(res.data)
                localStorage.setItem("currentuser" , theRes.currentuser)
                localStorage.setItem("Usersets" , theRes.Usersets)
                
                $("#login").empty()
                ReactDOM.render(
                <div>Welcome , user {localStorage.currentuser}</div> , document.getElementById('login')
                )
                
            }
        )
    }
    render(){
        return (
            <Row className="height100row">
            <Col offset = {2} span={20}>
                <Card className="height100row" id="login">
                    <Form layout="vertical" hideRequiredMark onFinish={this.onFinish} method="post">  
                       <Row>
                           <Form.Item
                                name="username"
                                label="Name"
                                rules={[{ required: true, message: 'user name' }]}
                                >
                                <Input placeholder="input the name of the user" />
                            </Form.Item>
                        </Row> 
                        <Row>
                           <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'password' }]}
                                >
                                <Input placeholder="password" />
                            </Form.Item>
                        </Row> 
                        <Row>
                            <Form.Item>
                                <Button htmlType='submit' >Login</Button>
                            </Form.Item>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </Row> 
        )
    }
}

export default Login