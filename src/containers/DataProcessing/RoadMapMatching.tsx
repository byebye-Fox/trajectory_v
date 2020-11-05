import React from 'react'
import ReactDOM from 'react-dom'
import {Divider , Card, Drawer, Form, Button, Col, Row, Input, Select, DatePicker , Spin } from 'antd';
import axios from 'axios'

import MapContainer from '../Map/Mapcontainer'


const { Option } = Select;

class RoadMapMatching extends React.Component<{} ,{datasets:Array<string>,isloading :boolean}>{

    constructor(props:any){
        super(props)
        this.state = {
            datasets:[],
            isloading:false
        }
        
    }

    componentDidMount(){
        axios({
            url:'http://127.0.0.1:8000/getsetlist/',
            method:'post',
        })
        .then(res =>{   
            //@ts-ignore
            let setlist = eval(res.data.datalist)
            console.log(typeof(setlist))
            console.log(setlist)
            this.setState({
                datasets:setlist
            })
        })
    }

    _genElement = (values:Array<string>)=>{
        return values.map((value:any , index:any) => {
            return this._addEle(value , index)
            })
        } 
    
    _addEle= (value:any , index:any)=>{
        return <Option key={index} value={value} >{value}</Option>
    }

    buildselect = (setlist:Array<string>) =>{
        //@ts-ignore
        return <Select placeholder="Please choose one dataset">{this._genElement(setlist)}</Select>
    }

    onFinish = async(values:any) =>{
        this.setState({
            isloading:true
        })

        console.log(values)
        await axios.post(`http://127.0.0.1:8000/roadmapmatching/`,values)
        .then(res=>{
            this.setState({
                isloading:false
            })
            let reslines = eval(res.data)
            let resline:any = []
            for (let i = 0 ; i < reslines.length ; i++)
            {
                let message = ""
                if(i === 0 )
                {
                    message = "Raw Data Trajectory"
                }
                else if(i ===1)
                {
                    message = "Ori Data Trajectory"
                }
                else{
                    message = "Road Map Matching"
                }
                resline.push({
                    polylines:[reslines[i]],
                    data:message 
              })
            }

            let resultshow = <MapContainer center={[22.53500,114.007]} zoom={14} container="filestationtest" mapData={resline}></MapContainer>   
            ReactDOM.render(resultshow ,document.getElementById("resultshow") )          
            console.log(resline)
        })


    }

    render()
    {
        return (
                <Spin spinning={this.state.isloading} size="large"  className="height100row">
                    <Row className="height100row" >
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
                                            {this.buildselect(this.state.datasets)}
                                        </Form.Item>
                                    </Col>
                                </Row> 
                                <Row>
                                    <Form.Item>
                                        <Button htmlType='submit' >Start</Button>
                                    </Form.Item>
                                </Row>
                            </Form>
                            <div id="resultshow">

                            </div>
                        </Card>
                    </Col>

                </Row>
                </Spin>
        )
    }
}

export default RoadMapMatching