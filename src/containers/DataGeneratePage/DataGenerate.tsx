import React from 'react'
import {Layout , Menu } from 'antd'
//@ts-ignore
import {BrowserRouter as Router , Route , Link } from 'react-router-dom'
import MenuItem from 'antd/lib/menu/MenuItem'


import FileStation from './FileStation'
import OriStation from './OriStation'
import SelfChargeStation from './SelfChargeStation'



const {Header , Content , Footer} = Layout

class DataGenerate extends React.Component{
  state = {
    current:'ori'
  }

  handleClick = (e:any) =>{
    this.setState({current : e.key})
  }

  render(){
      return(
        <Router>
          <Layout className='DataGenerateContainer'>
              <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" >
                  <MenuItem key='ori'>
                    <Link to="/datageneration/">Ori Stations</Link>
                  </MenuItem>
                  <MenuItem key='file'>
                     <Link to='/datageneration/filestation'> File Staitions</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to='/datageneration/selfchargestation'>Self Charge Stations</Link>
                  </MenuItem>
              </Menu>
            <Content className="datagenerateContainer">
              <Route exact path='/datageneration/' component = {OriStation}></Route>
              <Route exact path='/datageneration/filestation' component = {FileStation}></Route>
              <Route exact path='/datageneration/selfchargestation' component = {SelfChargeStation}></Route>
            </Content>

          </Layout>
        </Router>
        )
    }            
}

export default DataGenerate