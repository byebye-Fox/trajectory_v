import React from 'react'
import {Menu , Dropdown , Switch, Checkbox} from 'antd'
import { DownOutlined } from '@ant-design/icons'
//@ts-ignore
import $ from 'jquery'

interface VisiableBarProps {
    idlist:Array<string>
}

function onVisiableChange(id:string){
}

class VisiableBar extends React.Component<VisiableBarProps , VisiableBarProps>
{
    constructor(Props:VisiableBarProps){
        super(Props)

        this.state={
            idlist: Props.idlist
        }
    }

    _genElement = (values:Array<string>)=>{
    return values.map((value:any , index:any) => {
        return this._addEle(value , index)
        })
    } 

    _addEle= (value:any , index:any)=>{
        return <Menu.Item key={index}>{value} <Switch defaultChecked onChange ={function(){
            let selectid = '#' + value
             if (!$(selectid).attr('opacity')){
                $(selectid).attr('opacity' , 0)
            }
            else if($(selectid).attr('opacity')=== '1'){
                $(selectid).attr('opacity' , 0)
            }else{
                $(selectid).attr('opacity' , 1)
            }
        }}/></Menu.Item>
    }

    buildMenu = (idList:Array<string>) =>{
        console.log("the function")
        console.log(this._genElement(idList))
        return <Menu>{this._genElement(idList)}</Menu>
    }

    render(){
        return <div>
            {this.buildMenu(this.state.idlist)}
        </div>
    }      
}

export default VisiableBar





