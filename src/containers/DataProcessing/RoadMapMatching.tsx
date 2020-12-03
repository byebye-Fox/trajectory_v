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

            let grids = [{
                lefttop:lefttop,
                offsetlat:offsetlat,
                offsetlng:offsetlng,
                netdatas:netData,
                color0:[0,0,0],
                color1:[245,234,123],
                opacity:0.5,
            }
            ]   
            //注意此处grids的整体数量,如果整体数量很大的话,不建议将结果放到同一个位置进行展示,如果非要这样做的话,基本结果就是内存爆炸,问题是这个内存爆炸不是因为我们绘图的问题,而是增量渲染的问题, 每个网格中包含其自身对应的消息,解决方法是有的,每次进行渲染不记录其中超多的数据,使用图形编码,记录其所点击的对应关系,进而数据被map所记录并进行操作,根据索引来进行检索事件,进而降低图形变化所带来的极大的前端压力.
            resline.push({'grids':grids ,name:"thegrids"})
            resline.push({
                data:"this is the second data",
                name:"test3",
                polylines:[reslines[2]],
                polylinestyle:"lines",
                polylinesfill:"red",
            })
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