import React, { useState } from 'react'
import { Form, Button, Typography } from 'antd';
import { AddressInput } from "./components"
import { Transactor } from "./helpers"
import { useContractLoader } from "./hooks"

export default function SendInkForm(props) {

  const [sending, setSending] = useState(false)
  const [form] = Form.useForm();

  const writeContracts = useContractLoader(props.injectedProvider);
  const tx = Transactor(props.injectedProvider)

  const sendInk = async (values) => {
    setSending(true)
    console.log('Success:', props.address, values, props.tokenId);
    await tx(writeContracts["NFTINK"].safeTransferFrom(props.address, values['to'], props.tokenId))
    form.resetFields();
    props.setSends(props.sends+1)
    setSending(false)
  };

  const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
  };

  let output = (
  <Form
  form={form}
  layout={'inline'}
  name="sendInk"
  initialValues={{ tokenId: props.tokenId }}
  onFinish={sendInk}
  onFinishFailed={onFinishFailed}
  >
  <Form.Item
  name="to"
  rules={[{ required: true, message: 'Which address should receive this artwork?' }]}
  >
  <AddressInput
    ensProvider={props.mainnetProvider}
    placeholder={"to address"}
  />
  </Form.Item>

  <Form.Item >
  <Button type="primary" htmlType="submit" loading={sending}>
    Send
  </Button>
  </Form.Item>
  </Form>
)

  return output
}
