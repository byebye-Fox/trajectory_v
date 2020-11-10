import React from 'react'
import {Menu , Dropdown , Switch, Button} from 'antd'
//@ts-ignore
import $ from 'jquery'


import  {TagsOutlined}  from '@ant-design/icons'

interface VisiableBarProps {
    idlist:Array<[string,boolean]>
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

    _genElement = (values:Array<[string , boolean]>)=>{
    return values.map((value:any , index:any) => {
        let selectid = '#' + value[0]
            console.log("shock me ")
            console.log(value)
            if (value[1] == true){
                console.log("in")
                $(selectid).attr('opacity' , 1)    
            }else{
                $(selectid).attr('opacity' , 0)
            }
        return this._addEle(value , index)
        })
    } 

    _addEle= (value:any , index:any)=>{
        let that = this
        return <Menu.Item key={index}>{value} <Switch defaultChecked checked={value[1]} onChange ={function(){
            if (value[1] == true){
                let temp = that.state.idlist
                temp[index][1] = false
                that.setState({
                    idlist:temp
                })
            }else{
                let temp = that.state.idlist
                temp[index][1] = true
                that.setState({
                    idlist:temp
                })
            }
        }}/></Menu.Item>
    }

    buildMenu = (idList:Array<[string , boolean]>) =>{
        console.log("the function")

        let themenu =  <Menu>{this._genElement(idList)}</Menu>

        return <Dropdown overlay={themenu} arrow ><TagsOutlined /></Dropdown>
    }






    render(){
        return <div>
            {this.buildMenu(this.state.idlist)}
        </div>
    }      
}

export default VisiableBar





