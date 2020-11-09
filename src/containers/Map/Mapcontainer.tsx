import React from 'react'
import "leaflet/dist/leaflet.css"

import {LMap , MapProps} from "../../components/LMap"
// import '../../less/tailoredSet.less'
// import '../../less/antdSet.less'
import DetailDraw from '../DetailDraw'
import VisiableBar from '../../components/VisiableBar'

interface layerDetail{
    markers?:Array<[string,number,number]>;
    polylines?:Array<Array<[number,number]>>;
    data?:any;
}
interface newProps extends MapProps{
    idlist:Array<string>
}

interface MapcontaionerProps{
    container:string;
    center:[number,number];
    zoom:number;
    mapData:any;
}
//markers:firt string,the popup stuff,use the html element;second:纬度,third:经度

export class MapContainer extends React.Component<MapcontaionerProps,newProps>{
    constructor(props:MapcontaionerProps){
        super(props)
        this.state = {
            container:props.container,
            center:props.center,
            zoom:props.zoom,
            mapData:props.mapData,
            idlist:["test1layer0","test2layer1"]
        }
    }
    static getDerivedStateFromProps(nextProps:any , prevState:any){
        if (nextProps !== prevState){
            return {
                container:nextProps.container,
                center:nextProps.center,
                zoom:nextProps.zoom,
                mapData:nextProps.mapData
            }
        }
        console.log("map container has changed")
        console.log(nextProps)
        return null    
    }
    componentDidUpdate(){
        console.log("Map container has changed")
        console.log(this.state)
    }


    render()
    {
        return(
            <>
            <div className="relativeeles">
                <VisiableBar idlist = {this.state.idlist}></VisiableBar>
                <DetailDraw/>
                <div id = {this.state.container} className="Mapcontaioner">
                <a href='http://127.0.0.1:8080'>the jump</a>
            </div>
                
                
                <LMap center={this.state.center} zoom={this.state.zoom} container={this.state.container} mapData={this.state.mapData}/>
            </div>
            </>
                
            
        )
    }
}


export default MapContainer