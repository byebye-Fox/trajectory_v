import React from 'react'
import {Divider , Card, Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import axios from 'axios'

import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
interface stateProps {
    datasets:Array<string>
}

class Datacleaning extends React.Component<{},stateProps>{

    constructor(props:any){
        super(props)
        // axios({
        //     url:'http://127.0.0.1:8000/getdatalist/',
        //     method:'post',
        //     data:{
        //         carlicense:"8293458"
        //     }
        // })
        // .then(res =>{   

        // })
        //请求得到数据列表,获取整体的结果,生成对应的dropdown,之后进行生成,最后把结果展示在对应的位置上
        this.state={
            datasets : [],
        }        
    }

    componentDidMount(){
            if(localStorage.currentuser)
            {   
                let datalist = localStorage.Usersets.split(',')
                //@ts-ignore
                let setlist = eval(datalist)
                this.setState({
                    datasets:setlist
                })
            }
            else{
                alert("There is no alaviable datasets , Please try again after login")
            }
             
    }

    _genElement = (values:Array<string>)=>{
        return values.map((value:any , index:any) => {
            return this._addEle(value , index)
            })
        } 
    
    _addEle= (value:any , index:any)=>{
        return <Option  key={index} value={value}>{value}</Option>
    }

    buildOp = (setlist:Array<string>) =>{
        //@ts-ignore
        return <Select placeholder="Please choose one dataset">{this._genElement(setlist)}</Select>
    }


    onFinish = async(values:any) =>{
        //@ts-ignore
        let res = await axios.post(`${this.state.selected}`,values)
        console.log(res)
    }

    render()
    {
        return (
            <div>
                 <Row className="height100row">
                    <Col offset = {2} span={20}>
                        <Card className="height100row">
                            <Form layout="vertical" hideRequiredMark onFinish={this.onFinish} method="post">
                                <h2>Select Datasets</h2>
                                <Row gutter = {20}>
                                    <Col span={12}> 
                                        <Form.Item
                                            name="datasets"
                                            label="Select one dataset"
                                            rules={[{ required: true, message: 'Please choose one dataset' }]}
                                            >
                                            {this.buildOp(this.state.datasets)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <h2>Noise level</h2>
                                <Row gutter={20}>
                                <Col span={12}>
                                    <Form.Item
                                    name="noiselevel"
                                    label="Nosie level"
                                    rules={[{ required: true, message: 'Please enter user name' }]}
                                    >
                                    <Input placeholder="recommend between 3-5" />
                                    </Form.Item>
                                </Col>
                                </Row>
                                <h2>Declare the stop points</h2>
                                <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                    name="distance"
                                    label="Distance"
                                    rules={[{ required: true, message: 'The max distance' }]}
                                    >
                                    <Input placeholder="recommend between 200 - 300m" />
                                    </Form.Item>
                                </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                        name="timedis"
                                        label="Time"
                                        rules={[{ required: true, message: 'The max time' }]}
                                        >
                                        <Input placeholder="recommend between 10-20 min" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Item>
                                        <Button htmlType='submit' >Start</Button>
                                    </Form.Item>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row> 
            </div>
        )
    }
}

export default Datacleaning

