import React from 'react'

import Datacleaning from './Datacleaning'
import RoadMapMatching from './RoadMapMatching'

import {Layout , Menu } from 'antd'
//@ts-ignore
import {BrowserRouter as Router , Route , Link } from 'react-router-dom'
import MenuItem from 'antd/lib/menu/MenuItem'


const {Header , Content , Footer} = Layout


class DataProcessing extends React.Component{
    state = {
        current:'cleaning'
    }
    handleClick = (e:any) =>{
        this.setState({current : e.key})
    }

    render()
    {
        return (
          <Router>
          <Layout className='DataProcessingContainer'>
              <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" >
                  <MenuItem key='cleaning'>
                    <Link to="/DataProcessing/datacleaning">Data Cleaning</Link>
                  </MenuItem>
                  <MenuItem key='roadmapmatching'>
                     <Link to='/DataProcessing/roadmapmatching'>Road Map Matching</Link>
                  </MenuItem>
              </Menu>
            <Content className='DataProcessingContainer'>
              <Route exact path='/DataProcessing/datacleaning' component = {Datacleaning}/>
              <Route exact path='/DataProcessing/roadmapmatching' component = {RoadMapMatching}/>
            </Content>

          </Layout>
        </Router>
        )
    }
}

export default DataProcessing