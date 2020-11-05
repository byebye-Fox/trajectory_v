import React from 'react'
//@ts-ignore
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet.motion/dist/leaflet.motion.min.js"

//@ts-ignore
import {antPath} from "leaflet-ant-path"

import logo from "../marker.jpg"

//@ts-ignore
import * as d3 from 'd3'

// import '../less/tailoredSet.less'
// import '../less/antdSet.less'

//@ts-ignore
import $ from 'jquery'

interface layerDetail{
    markers?:Array<[string,number,number]>;
    polylines?:Array<Array<[number,number]>>;
    data?:any;
}
//markers:firt string,the popup stuff,use the html element;second:纬度,third:经度

interface gridsDetail{

}
interface aggregationDetail{

}

export interface MapProps{
    container:string;
    center:[number,number];
    zoom:number;
    mapData?:Array<layerDetail>;
    grids?:Array<gridsDetail>;
    aggregation?:Array<aggregationDetail>;
    polylinesClick?:Function;
    markerClick?:Function;
    PolylinesDbclick?:Function;

}
export class LMap extends React.Component<MapProps,MapProps>{
    constructor(Props:MapProps){
        super(Props);
        this.state = {
            container:Props.container,
            center:Props.center,
            zoom:Props.zoom,
            mapData:Props.mapData
        }
    }
    mymap:any;

    controlBar:any;
    
    
    componentDidMount()
    {
       this.mymap =  DrawMap(this.state , this.mymap)
     
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
        return null    
    }
    componentDidUpdate(){
        this.mymap.remove()
        this.mymap = DrawMap(this.state , this.mymap)
    }


    
     render()
    { 
        return( //这里(不能写到下一行，否则react认为render中没有返回任何内容  
        <div></div>        
        )
    }

}

function drawmarkers(markers:Array<[string,number,number]>){
    let thelayer = new L.LayerGroup();
    var reactIcon = L.icon({
        iconUrl:logo,
        iconSize:[50,50]
    })

    var reactIcon2 = L.icon({
        iconUrl:logo,
        iconSize:[30,30]
    })
    for(let i = 0 ; i < markers.length ; i ++)
    {
        let lnglat = [markers[i][1],markers[i][2]]
        let the_marker = L.marker(lnglat,{icon:reactIcon}).bindPopup('<b>' + markers[0] + '</b>').addTo(thelayer)
        the_marker.on("click" , function(e : any){
            the_marker.remove();
            the_marker = L.marker(lnglat,{icon:reactIcon2}).bindPopup('<b>' + markers[0] + '</b>').addTo(thelayer)
        })   
    }
    return thelayer;
}

function drawlines(lines:Array<Array<[number,number]>> , colorindex:number){
    let colors = [
        ["#330099" , "#66ff66"],
        ["#4876FF" , "#FFFFFF"],
        ["#ff0000" , "#ffff00"],
    ]
    
    let thelayer = new L.LayerGroup();
    for(let i = 0 ; i <lines.length; i ++)
    {   
        let thepath = antPath(lines[i] , {
            "delay": 800,
            "dashArray": [
                10,
                40
            ],
            "weight": 4,
            "color": colors[colorindex][0],
            "pulseColor":colors[colorindex][1],
            "paused": false,
            "reverse": false,
            "hardwareAccelerated": false
        }).addTo(thelayer)

        thepath.on("click",function(e:any){
            alert(lines)
        })
    }
    return thelayer;
}

function DrawMap(Props:MapProps , mymap:any){
        // var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        //     maxZoom: this.state.zoom,
        //     minZoom: this.state.zoom
        // });

        var normalm = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets', 
            maxZoom: Props.zoom+3,
            minZoom: Props.zoom/2
        })
        
        // 这是链接控制地图展示部分和地图对应的层级之间相互链接的语句，前者表示对应，命名，后者表示对应连接的层的名称。
        var normal = L.layerGroup([normalm]);
        mymap =new L.Map(Props.container,
        {
            center: Props.center,
            zoom: Props.zoom,
            layers: [normal],
            zoomControl: false
        })

        L.control.zoom({
                    zoomInTitle: 'Zoom in',
                    zoomOutTitle: 'Zoom out'
                }).addTo(mymap);
                
        var thelayers = []
        var descripts = []
        if(Props.mapData)
        {
            for(let i = 0 ; i < Props.mapData.length ; i ++)
            {
                let onelayer = Props.mapData[i]
                if(onelayer.markers && onelayer.polylines)
                {
                    let layersgroup = new L.LayerGroup()
                    drawmarkers(onelayer.markers).addTo(layersgroup)
                    drawlines(onelayer.polylines,i).addTo(layersgroup)
                    thelayers.push(layersgroup)
                }
                else if(onelayer.markers)
                {
                    thelayers.push(drawmarkers(onelayer.markers))
                }
                else if(onelayer.polylines)
                {
                    thelayers.push(drawlines(onelayer.polylines , i))
                }
                if(onelayer.data){
                    descripts.push(onelayer.data)
                }
                else{
                    let defaultmessage = "Layer " + i.toString()
                    descripts.push(defaultmessage)
                }
            }
        }
        let controlBar:any = {
        }

        for(let i = 0 ; i < thelayers.length; i ++)
        {
            //@ts-ignore
            thelayers[i].addTo(mymap)
            controlBar[descripts[i]] = thelayers[i]
        }

        DrawNet("","",mymap)
       
        L.control.layers({"base map":normal},controlBar).addTo(mymap); 

        return mymap
}

function DrawNet(data:any , style:any , mymap:any)
{
    let circleData = [
        {"lat" : "22.5338071" , "lng" : "114.0116598"},
        {"lat": "22.5338873" , "lng" :"114.0107086" }
    ]
    let lefttop = {"lat" :22.569486 , "lng" : 113.9403}
    let offsetlat =0.003
    let offsetlng = 0.004

    var netData = new Array(100)
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

//    DrawCircle(circleData , mymap)
//    DrawRectSets(netData , mymap , lefttop , offsetlat , offsetlng)
}

function DrawCircle(rectData : any , mymap:any)
{   
    var theone = D3Container(mymap , "circlesForTest")
    
    var svg = theone[0]
    var g = theone[1]

    var defs = svg.append("defs");
    // 添加模糊滤镜
    var filterBlur = defs.append('filter')
    .attr('id', 'filterBlur')
    .attr('x', -1.2)
    .attr('y', -1.2)
    .attr('width', 4)
    .attr('height', 4);
    // 添加辅助滤镜
    filterBlur.append('feOffset')
    .attr('result', 'offOut')
    .attr('in', 'SourceGraphic')
    .attr('dx', 4)
    .attr('dy', 5);
    // 添加模糊滤镜
    filterBlur.append('feGaussianBlur')
    .attr('result', 'blurOut')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 2);
    // 添加辅助滤镜
    filterBlur.append('feBlend')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blurOut')
    .attr('mode', 'multiply');

    var jsonCircles = new Array();
    rectData.forEach(function(d:any) {
        jsonCircles.push({ "x_axis": d.lat, "y_axis": d.lng, "radius": 50, "color": "green" });
    });

    var t = g.selectAll("circle")
        .data(jsonCircles);
    var circleAttributes =
        t
        .enter()
        .append("circle")
        .attr("cx", function(d:any) {  return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x; })
        .attr("cy", function(d:any) { return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y; })
        .attr("r", function(d:any) { return d.radius; })
        .style("fill", function(d:any) { return d.color; });

    function adjustCircle() {
        d3.selectAll("circle")
            .attr('cx', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x)
            .attr('cy', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).y);
    }
    //鼠标缩放操作
    function onMapZoom() {
        adjustCircle();
    }
    mymap.on('zoom', onMapZoom);
    d3.selectAll("circle").on('click' , function(d:any){
        console.log(d)
        svg.style('filter', 'url(#filterBlur')
    })
   
}

function D3Container(mymap :any , id:string){
    var svg = d3.select(mymap.getPanes().overlayPane).append("svg:svg").attr("class", ["leaflet-zoom-hide"]),
    g = svg.append("g");

    svg.attr("viewBox" ,function(){return '0,0,'+mymap.getSize().x + ',' + mymap.getSize().y})
        .attr("id" , id)
        .attr("width" , mymap.getSize().x)
        .attr("height" , mymap.getSize().y)
    
    var targetNode = $('.leaflet-map-pane')[0]
    var config = {attributes:true , childList: false, subtree: false }

    var callback = function(mutationsList:any, observer:any) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type == 'attributes') {
                if(mutation.attributeName == "style"){
                    svg.style("transform" , mutation.target.style.transform)
                    let viewboxneed = (mutation.target.style.transform).toString()
                    let transformsplit = viewboxneed.replace('translate3d','').replace(/px/g , '').replace('(','').replace(')','').split(",")

                    let newviewbos = -transformsplit[0] + ' ' +  -transformsplit[1] + ' ' + mymap.getSize().x + ' ' + mymap.getSize().y
                    let newtransform = 'translate3d(' +  -transformsplit[0] + 'px,' + -transformsplit[1] + 'px,' + -transformsplit[2] + 'px)'
                    svg.attr('viewBox' , newviewbos)
                        .attr('width',mymap.getSize().x)
                        .attr('height', mymap.getSize().y)
                        .style('transform' , newtransform)
                    // 元素的viewBox和transform改变的另一个标准,就是获取到底图的对应变化发生的时候,这部分也需要进行更改,当时想到antpath可以获取mymap的对应属性来改变,就像知道具体是哪个
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    return [svg,g]
}

function DrawRectSets(netdatas:any , mymap:any , lefttop:any , offsetlat:number , offsetlng:number){
    function color16(){//十六进制颜色随机
        var r = Math.floor(Math.random()*256);
        var g = Math.floor(Math.random()*256);
        var b = Math.floor(Math.random()*256);
        var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
        return color;
    }
    
    var a = d3.rgb(0,0,0)                 //红色
    var b = d3.rgb(255,255,255)                 //绿色
    var compute = d3.interpolate(a,b)


    let result = []
    for(let i = 0 ; i < netdatas.length ; i++){
        for(let j = 0 ; j <netdatas[i].length ; j++){
            let thelat = lefttop.lat - i*offsetlat
            let thelng = lefttop.lng + j*offsetlng
            let thedata = netdatas[i][j]
            result.push({
                "lat":thelat,
                "lng":thelng,
                "thedata":thedata,
                "color" : compute(thedata)
            })
        }
    }
    console.log("the result")
    console.log(result)

    var theone = D3Container(mymap , "rectForTest")
    
    var svg = theone[0]
    var g = theone[1]

    let baseXY = mymap.latLngToLayerPoint([lefttop.lat , lefttop.lng])
    console.log([lefttop.lat , lefttop.lng])
    console.log([lefttop.lat + offsetlat, lefttop.lng+offsetlng ])
    let offsetXY = mymap.latLngToLayerPoint([lefttop.lat + offsetlat, lefttop.lng+offsetlng ])
    console.log(baseXY)
    console.log(offsetXY)

    let width = baseXY.y - offsetXY.y
    let height = offsetXY.x - baseXY.x

    var t = g.selectAll("rect")
    .data(result);
    var rectAttribute =
        t
        .enter()
        .append("rect")
        .attr("x", function(d:any) {return mymap.latLngToLayerPoint(L.latLng(d.lat, d.lng)).x; })
        .attr("y", function(d:any) {return mymap.latLngToLayerPoint(L.latLng(d.lat, d.lng)).y; })
        .attr("width",height)
        .attr("height" ,width)
        .style("fill", function(d:any) { return d.color;})
        // .style("fill-opacity"  , 0)
        .style('stroke',function(d:any) { return d.color;})
        .style('stroke-width',2)

    function adjustCircle() {
        let baseXY = mymap.latLngToLayerPoint([lefttop.lat , lefttop.lng])
        let offsetXY = mymap.latLngToLayerPoint([lefttop.lat + offsetlat, lefttop.lng+offsetlng ])
        let width = baseXY.y - offsetXY.y
        let height = offsetXY.x - baseXY.x

        d3.selectAll("rect")
        .attr("x", function(d:any) {return mymap.latLngToLayerPoint(L.latLng(d.lat, d.lng)).x; })
        .attr("y", function(d:any) {return mymap.latLngToLayerPoint(L.latLng(d.lat, d.lng)).y; })
        .attr("width",height)
        .attr("height" ,width)
    }
    //鼠标缩放操作
    function onMapZoom() {
        adjustCircle();
    }
    mymap.on('zoom', onMapZoom);
    
    var defs = svg.append("defs");
    // 添加模糊滤镜
    var filterBlur = defs.append('filter')
    .attr('id', 'filterBlur')
    .attr('x', -1.2)
    .attr('y', -1.2)
    .attr('width', 4)
    .attr('height', 4);
    // 添加辅助滤镜
    filterBlur.append('feOffset')
    .attr('result', 'offOut')
    .attr('in', 'SourceGraphic')
    .attr('dx', 4)
    .attr('dy', 5);
    // 添加模糊滤镜
    filterBlur.append('feGaussianBlur')
    .attr('result', 'blurOut')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 20);
    // 添加辅助滤镜
    filterBlur.append('feBlend')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blurOut')
    .attr('mode', 'multiply');

    var defs2 = svg.append("defs")
    var filterBlur2 = defs2.append("filter")
    .attr("id" , "filterBlur2")
    filterBlur2.append("feGaussianBlur")
    .attr("in" , "SourceGraphic")
    .attr("stdDeviation" , 20)

    //  svg.style('filter', 'url(#filterBlur2')


    function test1() 
    {
     console.log("the no 1")   
    }
    function test2()
    {
        console.log("the no 2")
    }
    let functionlist = [test1 ,test2]
    function onZoom()
    {
        for(let i = 0 ; i < 2 ; i ++ )
        {
            functionlist[i]()
        }
    }
    onZoom()

    // g.selectAll("rect").on("click" , function(){
    //     //@ts-ignore
    //     d3.select(this)
    //         // .transition()
    //         // .duration(500)
    //         .style('opacity',0)
    // })
    // g.selectAll("rect").on("mouseover" , function(){
    //     //@ts-ignore
    //     d3.select(this)
    //         .attr("width" , function(d:any){})
            
    // })
}

export default  LMap
