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
            let len1 = reslines[0].length
            let len2 = reslines[1].length
            let len3 = reslines[2].length

            let tempres1:any = []
            let tempres2:any = []
            let tempres3:any = []
        
            for(let i = 0 ; i < reslines[0].length ; i++)
            {   
                tempres1.push({latlng:[reslines[0][i][0] , reslines[0][i][1]] , attribute:5})
            }

            for(let i = 0 ; i < reslines[1].length ; i++)
            {   
                tempres2.push({latlng:[reslines[1][i][0] , reslines[1][i][1]] , attribute:5})
            }

            resline.push({
                markers:tempres1,
                data:"This is the raw data",
                name:"test1",
                markerstyle:"circle",
                markerfill:"red"
            })
            resline.push({
                markers:tempres2,
                data:"this is the second data",
                name:"test2",
                markerstyle:"circle",
                markerfill:"green"
            })

            resline.push({
                data:"this is the second data",
                name:"test3",
                polylines:[reslines[2]],
                polylinestyle:"lines",
                polylinesfill:"red",
            })

            let lefttop = {"lat" :22.569486 , "lng" : 113.9403}
            let offsetlat =0.003
            let offsetlng = 0.004

            var netData:Array<Array<number>> = new Array(100)
            for(var i = 0 ; i <100 ;i++)
            {
                netData[i] = new Array(100)
            }
            for(let i = 0 ; i <100 ; i++)
            {
                for(let j = 0 ; j < 100 ; j++)
                {
                    netData[i][j] = Math.random()
                }
            }


            let lefttop2 = {
                "lat" :24.569486 , "lng" : 115.9403
            }
            let grids = [{
                lefttop:lefttop,
                offsetlat:offsetlat,
                offsetlng:offsetlng,
                netdatas:netData,
                color0:[0,0,0],
                color1:[245,234,123],
                opacity:0.5,
            },
            {
                lefttop:lefttop2,
                offsetlat:offsetlat,
                offsetlng:offsetlng,
                netdatas:netData,
                color0:[1,2,3],
                color1:[23,234,123],
                opacity:0.5,
            },
            ]   
            resline.push({'grids':grids ,name:"thegrids"})
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