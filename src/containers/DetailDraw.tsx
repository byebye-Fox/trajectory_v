import React, { DetailedHTMLFactory }  from 'react'

import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';

import { CodeSandboxOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

class DetailDraw extends React.Component {
  state = { visible: false };
  details:any;

  showDrawer = (e:any) => {
    console.log(e)
    console.log(Gloabl_detail)
    this.details = Gloabl_detail.toString()
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type="primary" id="thedetailshow" about = '' onClick={this.showDrawer.bind(this)}>
          <PlusOutlined /> New account
        </Button>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
         <p>{this.details}</p>
        </Drawer>
      </>
    );
  }
}

export default DetailDraw