import React from 'react'
import "leaflet/dist/leaflet.css"

import {LMap , MapProps} from "../../components/LMap"
// import '../../less/tailoredSet.less'
// import '../../less/antdSet.less'
import DetailDraw from '../DetailDraw'
import VisiableBar from '../../components/VisiableBar'


interface gridsDetail{
    lefttop:{lat:number , lng:number}
    offsetlat:number;
    offsetlng:number;
    netdatas:Array<Array<number>>;
    color0:[number , number , number];
    color1:[number , number , number];
    opacity:number;
    
}


interface MapcontaionerProps{
    container:string;
    center:[number,number];
    zoom:number;
    mapData:any;
}
//markers:firt string,the popup stuff,use the html element;second:纬度,third:经度

export class MapContainer extends React.Component<MapcontaionerProps,MapcontaionerProps>{
    constructor(props:MapcontaionerProps){
        super(props)
        this.state = {
            container:props.container,
            center:props.center,
            zoom:props.zoom,
            mapData:props.mapData,
        }
    }
    idlist : Array<[string , boolean]>=[];

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

    getlayerlist = (layerlist:Array<[string,boolean]>)=>{
        this.idlist = layerlist
        console.log("the id list")
        console.log(this.idlist)
    }


    render()
    {
        let layerlist:Array<[string , boolean]> = []
        for(let i  = 0 ; i < this.state.mapData.length ; i++)
        {
            let onelayer = this.state.mapData[i]
            layerlist.push([onelayer.name + "layer" + i , true])
        }
        this.idlist = layerlist
        return(
            <>
                <div className="relativeeles">
                        <VisiableBar idlist = {this.idlist} sendidlist = {this.getlayerlist}></VisiableBar>
                        <DetailDraw/>
                    </div>    
                <div id = {this.state.container} className="Mapcontaioner">
                    <a href='http://127.0.0.1:8080'>the jump</a>
                </div>
                <LMap center={this.state.center} zoom={this.state.zoom} container={this.state.container} mapData={this.state.mapData} />
            </>
                
            
        )
    }
}


export default MapContainer