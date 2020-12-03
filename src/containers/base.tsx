import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {Row} from 'antd'
//@ts-ignore
import {BrowserRouter as Router,Route , Link , Switch , Redirect} from 'react-router-dom'

import {createBrowserHistory} from 'history'

//@ts-ignore
import {Provider} from 'react-redux'

import '../less/antdSet.less'
import '../less/tailoredSet.less'
import '../less/leafletSet.less'



import Introduction from "./Introduction/Introduction"
import Mainrouter from './mainrouter'
import Login from './Login/Login'

const {Header , Content , Footer} = Layout

const history = createBrowserHistory();

class BaseContainer extends React.Component{
    constructor(props:any){
        super(props)
      
    }
    render(){
        return ( 
            <Mainrouter></Mainrouter>
            // <Provider>
            //     <div>
            //         <Login></Login>
            //         <Link to="/main"></Link>
            //     </div>
            //     <Router history = {history}>
            //         <Switch>
            //             <Route exact path='/' component = {Introduction}></Route>
            //             <Route exact path = '/main'  component = {Mainrouter}></Route>
            //             <Redirect to="/"></Redirect>
            //         </Switch>
            //     </Router>
            // </Provider>
        )
    }
}

export default BaseContainer





