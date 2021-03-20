import React, { useState } from "react";
import { Form, Col, Row, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';
import { SyncOutlined, InboxOutlined, UploadOutlined, StarOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

const { Dragger } = Upload;


const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    async onPreview (file) {
        let src = file.url;
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
      },
  };

const CreateNFT = ({ address, readContracts, writeContracts }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        ]);

        const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        };

        return (
            <>
            <h3>Create An NFT</h3>
            <Form
                form={form}
                name='nft_info'
                className='nft-info-form'
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={7}>
                        <Form.Item
                            name={`Attribute`}
                            label={`Attribute`}
                            rules={[
                            {
                                required: false,
                                message: 'Input something!',
                            },
                            ]}
                        >
                            <Input placeholder="key" />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            name={`Attribute`}
                            rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                            ]}
                        >
                            <Input placeholder="value" />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button>+</Button>
                    </Col>
                </Row>
            </Form>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
                </p>
            </Dragger>
            {fileList.map((item, index) => {

            })}
            </>
        )
}

export default CreateNFT;