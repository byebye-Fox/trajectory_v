import React from 'react'
import {Row , Col , Card } from 'antd'
import FormWithCheck from '../../components/FormWithCheck'
import axios from 'axios'
import VisiableBar from '../../components/VisiableBar'

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';


class OriStation extends React.Component{

    
    datas=[[1,'A01',114.007401,22.535500,1,112],[2,'FN0002',114.009001,22.534233,1,6],[3,'N04',113.987547,22.560519,1,40],[4,'D08',114.088303,22.562599,1,20],[5,'LJDL',114.361504,22.678499,2,16],[6,'D10',114.074406,22.559000,1,16],[7,'B04',113.922977,22.546375,1,20],[8,'D01',114.123241,22.562538,1,12],[9,'C01',114.101748,22.582541,1,52],[10,'E11',114.068837,22.573326,1,20],[11,'A02',114.023404,22.542650,1,16],[12,'E01',114.023902,22.619512,1,16],[13,'F02',113.817750,22.650682,1,8],[14,'A08',113.944128,22.506854,1,14],[15,'A09',113.941642,22.527053,1,16],[16,'A10',113.962844,22.528519,1,14],[17,'BN0002',113.814932,22.651322,2,12],[18,'D06',114.304419,22.600844,1,16],[19,'N02',114.032902,22.524276,1,16],[20,'F07',113.858390,22.579457,1,8],[21,'A03',113.995054,22.547247,1,16],[22,'E04',114.003978,22.636233,2,10],[23,'D09',114.045125,22.551410,1,10],[24,'F08',113.838486,22.609576,1,16],[25,'F10',114.043404,22.601,1,12],[26,'F11',113.985199,22.547701,2,12],[27,'F12',113.8134,22.624201,1,100],[28,'F13',114.135002,22.544001,1,100],[29,'PSBYD',114.353401,22.679399,1,12],[30,'S1',113.8564,22.616899,1,100],[31,'F15',114.031502,22.5252,1,100],[32,'S2',114.1798,22.5585,1,100]]

    getMapdata = (thedata:any)=>{
        let mapdata:Array<[string,number,number]> = []
        let lines : Array<[number,number]> = []
        for(let i = 0 ; i < thedata.length ; i++)
        {
            let oneTip = thedata[i][0] + thedata[i][4].toString()
            mapdata.push([oneTip.toString() , thedata[i][3] , thedata[i][2]])
            lines.push([thedata[i][3] , thedata[i][2]])
        }
        console.log(mapdata)
        let res = [{markers:mapdata},{polylines:[lines]}]
        return res
    }

    render(){

        return(


                <Row className="height100row">
                    <Col offset = {2} span={20}>
                         <Card className="height100row">
                            <FormWithCheck name="oridatageneration" label="Number of the Vehicles" axiosRequest="http://127.0.0.1:8000/oridatastation"></FormWithCheck>
                            {/* <MapContainer center={[22.53500,114.007]} zoom={14} container="oriStationDes" mapData={this.getMapdata(this.datas)}></MapContainer> */}
                             </Card>
                    </Col>

                </Row>    
        )
    }            
}

export default OriStation