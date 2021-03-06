import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {Row} from 'antd'
//@ts-ignore
import {BrowserRouter as Router,Route , Link , Switch} from 'react-router-dom'



import DataGenerate from "./DataGeneratePage/DataGenerate"
import Dataprocessing from "./DataProcessing/DataProcessing"
import DataDisplay from "./DataDisplay/DataDisplay"
import DataFileUpload from "./DataFileUpload/DataFileUpload"
import Introduction from './Login/Login'

const {Header , Content , Footer} = Layout

class Mainrouter extends React.Component{
    render(){
        return(
            <Router>
            <Layout className='BaseContainer'>
                    <Header>
                        <Row justify="end">
                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys = {['1']}>
                                 <Menu.Item key="0">
                                    <Link to="/Introduction">Introduction</Link>
                                </Menu.Item>
                                <Menu.Item key="1">
                                    <Link to="/FileUpload">FileUpload</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/DataProcessing/datacleaning">Data Processing</Link>
                                </Menu.Item> 
                                <Menu.Item key="3">
                                    <Link to='/datadisplay'>Data Display</Link>
                                </Menu.Item>    
                                <Menu.Item key="4">
                                    <Link to = '/datageneration'>Data Generation</Link>
                                </Menu.Item>
                            </Menu>
                        </Row> 
                    </Header>
                    <Content>
                        <Switch>
                            <Route exact path='/Introduction' component={Introduction}/>
                            <Route exact path='/DataProcessing/datacleaning' component={Dataprocessing}/>
                            <Route exact path='/datadisplay'  component={DataDisplay}/>
                            <Route exact path='/datageneration' component = {DataGenerate}/>
                            <Route exact path='/FileUpload' component={DataFileUpload}></Route>
                        </Switch>

                    </Content>
                    <Footer>

                    </Footer>
                </Layout>
            </Router>
        )
    }
}

export default Mainrouter