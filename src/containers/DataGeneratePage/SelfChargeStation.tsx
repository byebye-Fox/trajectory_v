import React from 'react'
import axios from 'axios'
import {Button , Row,Col,Card} from 'antd'

import MapContainer from '../../containers/Map/Mapcontainer'


class SelfChargeStation extends React.Component{

    state = {
        theline:[]
    }

    onclickgetpol = () =>{
        axios({
            url:'http://127.0.0.1:8000/file/',
            method:'post',
            data:{
                carlicense:"8293458"
            }
        })
        .then(res =>{
            console.log(res.data)
            console.log(eval(res.data))
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
            this.setState({
                theline: resline
            })
            console.log("after the")
            console.log(this.state)
        })
    }
    render(){
        return(

                <Row className="height100row">
                    <Col offset = {2} span={20}>
                         <Card className="height100row"> 
                            This is SelfChargeStation
                            <Button onClick= {this.onclickgetpol}> get file</Button>
                            <MapContainer center={[22.53500,114.007]} zoom={14} container="filestationtest" mapData={this.state.theline}></MapContainer>            
                        </Card>
                    </Col>

                </Row> 
        )
    }            
}

export default SelfChargeStation

