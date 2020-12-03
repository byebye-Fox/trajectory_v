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

import {EnvironmentFilled}  from '@ant-design/icons'

interface MarkerProps{
    latlng:Array<[number , number]>,
    attribute:string,
}

interface layerDetail{
    markers?:Array<MarkerProps>;
    markerstyle?:string;
    markerfill?:string;
    markerclick?:Function;

    polylines?:Array<Array<[number,number]>>;
    polylinestyle?:string;
    polylinesfill?:string;
    polylinesclick?:Function;

    aggregation?:Array<aggregationDetail>;
    grids?:Array<gridsDetail>;

    name:any;
}
//markers:firt string,the popup stuff,use the html element;second:纬度,third:经度

export interface gridsDetail{
    lefttop:{lat:number , lng:number}
    offsetlat:number;
    offsetlng:number;
    netdatas:Array<Array<number>>;
    color0:Array<number>;
    color1:Array<number>;
    opacity:number; 
}
interface aggregationDetail{   
    aggredata:Array<{
        lat:number;
        lng:number;
        count:number
    }>;
    radius:number;
    color0:Array<number>;
    color1:Array<number>;
    opacity:number;

}

export interface MapProps{
    container:string;
    center:[number,number];
    zoom:number;
    //基础,进行地图展示所需要的基础类型,需要容器,中心点,zoom等级

    mapData?:Array<layerDetail>;
    //基础地图数据
}

export interface MapStates{
    container:string;
    center:[number,number];
    zoom:number;
    //基础,进行地图展示所需要的基础类型,需要容器,中心点,zoom等级

    mapData?:Array<layerDetail>;
}


export class LMap extends React.Component<MapProps,MapStates>{
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
    
    layerlist:any=[];
    

    componentDidMount()
    {
       this.mymap =  _drawMap(this.props , this.mymap)
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
        this.mymap = _drawMap(this.props , this.mymap)
        // this.props.sendidlist(this.layerlist)
    }

     render()
    { 
        return( //这里(不能写到下一行，否则react认为render中没有返回任何内容  
        <div></div>        
        )
    }

}

function _drawmaker(markers:Array<MarkerProps> , markerstyle:string,markerfill:string , svg:any , g:any , mymap:any )
{
    switch(markerstyle){
        case("image"):{

        }
        case("circle"):{
            var jsonCircles = new Array();
            markers.forEach(function(d:any) {
                jsonCircles.push({ "x_axis": d.latlng[0], "y_axis": d.latlng[1], "radius": d.attribute, "color": markerfill });
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
        }
    }

    function adjustCircle() {
        g.selectAll("circle")
            .attr('cx', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x)
            .attr('cy', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).y);
    }

    //鼠标缩放操作
    function onMapZoom() {
        adjustCircle();
    }

    g.selectAll("circle").on("click" , function (){
        //@ts-ignore
        global.Gloabl_detail = d3.select(this)._groups[0][0].__data__
        //在别的地方调用已经完成声明的全局变量时,记得使用global来进行检查,使用global命名空间会使得在进行变量声明检索的过程中率先检索global空间.
        $('#thedetailshow').trigger('click')
    })
    
    mymap.on('zoom', onMapZoom);
}

function _drawlines(lines:Array<Array<[number , number]>>, polylinestyle:string , polylinesfill:string , svg:any , g:any , mymap:any){
    switch (polylinestyle){
        case("lines"):{
            let len = lines.length
            let jsonPath = new Array()


            for(let i = 0 ; i <len ; i++)
            {
                let element = lines[i]
                jsonPath.push({
                    "line":element,
                    "color":polylinesfill
                })
            }

            var t = g.selectAll("path")
            .data(jsonPath);
            var circleAttributes =
                t
                .enter()
                .append("path")
                .attr("d", function(d:any) { 
                    let templatlng = mymap.latLngToLayerPoint(L.latLng(d.line[0][0], d.line[0][1]));
                    let linedes = "M" + templatlng.x + " " + templatlng.y
                    for(let i =1 ; i < d.line.length ; i++ )
                    {
                        let temp = mymap.latLngToLayerPoint(L.latLng(d.line[i][0], d.line[i][1]));
                        linedes= linedes + "L" + temp.x + " " + temp.y
                    }
                    return linedes
                })
                .attr("stroke", function(d:any) { return d.color;})
                .attr("stroke-width" , "10") 
                .attr("fill" ,"none")
            }
        }

    function adjustCircle() {
        
        g.selectAll("path")
            .attr('d', function (d:any){
                let templatlng = mymap.latLngToLayerPoint(L.latLng(d.line[0][0], d.line[0][1]));
                let linedes = "M" + templatlng.x + " " + templatlng.y
                for(let i =1 ; i < d.line.length ; i++ )
                {
                    let temp = mymap.latLngToLayerPoint(L.latLng(d.line[i][0], d.line[i][1]));
                    linedes= linedes + "L" + temp.x + " " + temp.y
                }
                return linedes
            })
    }

    //鼠标缩放操作
    function onMapZoom() {
        adjustCircle();
    }
    g.selectAll("path").on("click" , function (){
        //@ts-ignore
        global.Gloabl_detail = d3.select(this)._groups[0][0].__data__
        //在别的地方调用已经完成声明的全局变量时,记得使用global来进行检查,使用global命名空间会使得在进行变量声明检索的过程中率先检索global空间.
        $('#thedetailshow').trigger('click')
    })
    
    mymap.on('zoom', onMapZoom);
}

function _drawMap(Props:MapProps , mymap:any) {
    var normalm = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
        id: 'mapbox.streets', 
        
        style: 'mapbox://styles/mapbox/streets-v12',
        maxZoom: Props.zoom+3,
        minZoom: Props.zoom/2
    })
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

    console.log("Props") 
    console.log(Props)
    if(Props.mapData){
        for(let i = 0; i <Props.mapData.length ; i ++)
        {
            let onelayer = Props.mapData[i]
            let theone = D3Container(mymap , (onelayer.name + "layer" + i))
            let svg = theone[0]
            let g = theone[1]

            if(onelayer.grids)
            {
                for(let i = 0 ; i < onelayer.grids.length ; i++)
                {
                    _drawgrids(onelayer.grids[i].netdatas , mymap ,onelayer.grids[i].lefttop ,onelayer.grids[i].offsetlat,
                        onelayer.grids[i].offsetlng , onelayer.grids[i].color0 , onelayer.grids[i].color1 , onelayer.grids[i].opacity ,svg,g)
                }
            }else if(onelayer.aggregation)
            {
                for(let i = 0 ; i < onelayer.aggregation.length ; i++)
                {   
                    _drawaggregation(onelayer.aggregation[i].aggredata ,onelayer.aggregation[i].radius ,onelayer.aggregation[i].color0,
                        onelayer.aggregation[i].color1,onelayer.aggregation[i].opacity,svg,g,mymap)
                }
            }
            else if(onelayer.polylines && onelayer.polylinesfill && onelayer.polylinestyle)
            {
                _drawlines(onelayer.polylines , onelayer.polylinestyle , onelayer.polylinesfill ,svg,g,mymap)
            }else if(onelayer.markers && onelayer.markerstyle && onelayer.markerfill)
            {
                _drawmaker(onelayer.markers , onelayer.markerstyle, onelayer.markerfill ,svg , g ,mymap)
            }
        
        }
    }
    // DrawNet("11" , "123" ,mymap)
    return mymap
}


//针对热力图的结果，需要进行以下的数据处理，首先因为轨迹数据问题，重叠问题是暂时无法解决的，最好的处理办法是进行连通性检查，根据连通性重新绘制path，之后再进行径向渐变。而这种层叠行驶的话，
function _drawaggregation( aggredata:Array<{lat:number;lng:number;count:number}>, radius:number, color0:Array<number>,
    color1:Array<number>, opacity:number,svg:any,g:any , mymap:any){
    //热力图是每个aggredata的count代表着实际的含义
    let jsondata = new Array() 

    
    function compare(a:any , b:any ){
        return a.count - b.count
    }

    let thedata = aggredata.sort(compare)

    var a = d3.rgb(color0[0],color0[1] , color0[2])
    var b = d3.rgb(color1[0] , color1[1] , color1[2])
    var compute = d3.interpolate(a,b)

    for(let i = 0 ; i < thedata.length ; i++)
    {
        let caculateradius = radius
        //辐射半径计算需要另行进行计算,其计算方法按下不表,先使用简单的方法进行.
        jsondata.push({
            "x_axis":thedata[i].lat,
            "y_axis":thedata[i].lng,
            "radius":caculateradius,  
            "fill": compute(thedata[i].count/100)
        })
    }

    var grads = svg.append("defs").selectAll("radialGradient")
    .data(jsondata)
    .enter()
    .append("radialGradient")
    .attr("gradientUnits", "objectBoundingBox")
    .attr("r", "100%")
    .attr("id", function(d:any, i:any) { return color1.toString() + color0.toString() + "grad" + i; })

   
    grads.append("stop")
        .attr("offset", "0%")
        .style("stop-color", function(d:any){
            return d.fill;
        })
        .style("stop-opacity" , 1)

    
    grads.append("stop")
        .attr("offset", "80%")
        .style("stop-color", "white")
        .style("stop-opacity" , 0)

    var t = g.selectAll('circle').data(jsondata)
    var rectAttribute =
        t
        .enter()
        .append("circle")
        .attr("cx", function(d:any) {  return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).x; })
        .attr("cy", function(d:any) { return mymap.latLngToLayerPoint(L.latLng(d.x_axis, d.y_axis)).y; })
        .attr("r", function(d:any) { return d.radius; })
        // .style("fill", function(d:any,i:any) { return d.fill;});
        .style("fill",   function(d:any , i :any){
            return "url(#" +  color1.toString() + color0.toString() + "grad" + i + ")"; 
        });

        // var defs = svg.append("defs");
        // // 添加模糊滤镜
        // var filterBlur = defs.append('filter')
        // .attr('id', 'filterBlur')
        // .attr('x', -1.2)
        // .attr('y', -1.2)
        // .attr('width', 4)
        // .attr('height', 4);
        // // 添加辅助滤镜
        // filterBlur.append('feOffset')
        // .attr('result', 'offOut')
        // .attr('in', 'SourceGraphic')
        // .attr('dx', 4)
        // .attr('dy', 5);
        // // 添加模糊滤镜
        // filterBlur.append('feGaussianBlur')
        // .attr('result', 'blurOut')
        // .attr('in', 'SourceGraphic')
        // .attr('stdDeviation', 20);
        // // 添加辅助滤镜
        // filterBlur.append('feBlend')
        // .attr('in', 'SourceGraphic')
        // .attr('in2', 'blurOut')
        // .attr('mode', 'multiply');
    
        // var defs2 = svg.append("defs")
        // var filterBlur2 = defs2.append("filter")
        // .attr("id" , "filterBlur2")
        // filterBlur2.append("feGaussianBlur")
        // .attr("in" , "SourceGraphic")
        // .attr("stdDeviation" , 20)
    
        // svg.style('filter', 'url(#filterBlur2')



        function adjustCircle() {
            g.selectAll("circle")
                .attr('cx', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).x)
                .attr('cy', (o:any) => mymap.latLngToLayerPoint([o.x_axis, o.y_axis]).y);
        }
    
        //鼠标缩放操作
        function onMapZoom() {
            adjustCircle();
        }
        g.selectAll("circle").on("mouseover" , function(){
            //@ts-ignore
            d3.select(this)
                .attr("r" , function(d:any){return (d.radius+3)})
                
        })
        g.selectAll("circle").on("mouseout" , function(){
            //@ts-ignore
            d3.select(this)
                .attr("r" , function(d:any){return (d.radius)})    
        })
        g.selectAll("circle").on("click" , function (){
            //@ts-ignore
            global.Gloabl_detail = d3.select(this)._groups[0][0].__data__
            //在别的地方调用已经完成声明的全局变量时,记得使用global来进行检查,使用global命名空间会使得在进行变量声明检索的过程中率先检索global空间.
            $('#thedetailshow').trigger('click')
        })
        mymap.on('zoom', onMapZoom);
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

function _drawgrids(netdatas:any , mymap:any , lefttop:any , offsetlat:number , offsetlng:number ,
    color0:Array<number> , color1:Array<number> , opacity:number ,svg:any,g:any){

    var a = d3.rgb(color0[0],color0[1] , color0[2])
    var b = d3.rgb(color1[0] , color1[1] , color1[2])
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
        .style('opacity' , opacity)

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

    g.selectAll("rect").on("click" , function (){
        //@ts-ignore
        global.Gloabl_detail = d3.select(this)._groups[0][0].__data__
        //在别的地方调用已经完成声明的全局变量时,记得使用global来进行检查,使用global命名空间会使得在进行变量声明检索的过程中率先检索global空间.
        $('#thedetailshow').trigger('click')
    })

    mymap.on('zoom', onMapZoom);
    
    
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

function drawmarkers(markers:Array<[string,number,number]>){
    let thelayer = new L.LayerGroup();
    var reactIcon = L.icon({
        iconUrl:EnvironmentFilled,
        iconSize:[50,50]
    })

    var reactIcon2 = L.icon({
        iconUrl:EnvironmentFilled,
        iconSize:[30,30]
    })

    for(let i = 0 ; i < markers.length ; i ++)
    {
        let lnglat = [markers[i][1],markers[i][2]]
        let the_marker = L.marker(lnglat,{icon:reactIcon}).bindPopup('<EnvironmentFilled />').addTo(thelayer)
        the_marker.on("click" , function(e : any){
            the_marker.remove();
            the_marker = L.marker(lnglat,{icon:reactIcon2}).bindPopup('<EnvironmentFilled />').addTo(thelayer)
        })   
    }
    return thelayer;
}
export default  LMap
