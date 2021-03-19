import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Button, Menu, Alert, Space, Card, Radio, Input, List, Form, InputNumber} from "antd";
import { formatEther, parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { Balance } from "../components";


function OptimisticETHBridge({ address, l1Provider, l2Provider, l1Network, l2Network, L1ETHGatewayContract, L2ETHGatewayContract, l1Tx, l2Tx }) {

    const onFinish = (values: any) => {
      console.log('Submitted:', values);
      if(values.action==='deposit'){
        console.log(values.amount.toString())
      l1Tx(L1ETHGatewayContract.deposit({
        value: parseEther(values.amount.toString())
      }));} else {
        l2Tx(L2ETHGatewayContract.withdraw(
          parseEther(values.amount.toString())
        ))
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    let bridgeForm = (
      <Form
        name="basic"
        layout="inline"
        initialValues={{action: 'deposit', amount: 0.1}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        <Form.Item name="action" rules={[{ required: true, message: 'Please select an action!' }]}>
          <Radio.Group>
            <Radio.Button value="deposit">Deposit</Radio.Button>
            <Radio.Button value="withdraw">Withdraw</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          rules={[{ required: true, message: 'Please enter an amount!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Bridge
          </Button>
        </Form.Item>
      </Form>
    );


  return (
          <Row justify="center" align="middle" gutter={16}>
            <Card title={"Optimistic ETH Bridge"} style={{ width: 600}}>
              <Space direction="vertical">
                <Balance address={address} provider={l1Provider} prefix={"L1"} color={l1Network.color}/>
                <Row justify="center">
                  {bridgeForm}
                </Row>
                <Balance address={address} provider={l2Provider} prefix={"L2"} color={l2Network.color}/>
              </Space>
            </Card>
          </Row>
  );

}

export default OptimisticETHBridge;
