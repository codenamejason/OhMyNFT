import React, { useState } from "react";
import { Form, Col, Row, Button, Image, List, Divider, Input, Card, DatePicker, Slider, Space, Switch, Progress, Spin, Upload, message } from "antd";
//import ImgCrop from 'antd-img-crop';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import mergeImages from 'merge-images';
import sampleImage from '../images/scaffold-eth.png';

const { BufferList } = require('bl');
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require('ipfs-http-client');
const Hash = require('ipfs-only-hash');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

let STARTING_JSON_NFT = {
    "description": "",
    "external_url": "",// <-- this can link to a page for the specific file too
    "image": "",
    "name": "",
    "attributes": [
        {
            "trait_type": "",
            "value": ""
        }
    ]
}

const CreateNFT = ({ address, readContracts, writeContracts, tx }) => {
    const [loading, setLoading] = useState(true);
    const [b64Image, setb64Image] = useState(null);
    const [imageHash, setImageHash] = useState();
    const [imageUri, setImageUri] = useState();
    const [nftJsonHash, setNftJsonHash] = useState();
    
    const uploadJsonToIpfs = async(item) => {
        console.log('Image', item.name)
        await mergeImages([
            { src: sampleImage }
        ], {}).then(b64 => {
            setb64Image(b64);        
            let imageBuffer = Buffer.from(b64.split(',')[1], 'base64');
            
            const imageResult = ipfs.add(imageBuffer)
                .then((res) => {
                    STARTING_JSON_NFT.description = 'Testing out minting';
                    STARTING_JSON_NFT.image = 'https://ipfs.io/ipfs/' + res.path;
                    STARTING_JSON_NFT.external_url = 'https://ipfs.io/ipfs/' + res.path;
                    STARTING_JSON_NFT.name = 'Scaffold-Eth'
                    STARTING_JSON_NFT.attributes[0] = { 'trait_type': 'Gender', 'value': 'Male' }
                    //setImageHash(res.path);
                    //setImageUri('https://ipfs.io/ipfs/' + res.path);
                    console.log('image result', res)

                    ipfs.add(JSON.stringify(STARTING_JSON_NFT))
                        .then((hash) => {
                            console.log('JSON hash', hash);
                        });
                });                
        });
    }
    
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const props = {
        name: 'file',
        action: (file) => {
            console.log(file);
            ipfs.add(file)
                .then((res) => {
                    console.log('IPFS Response: ', res);
                    setImageHash(res.path);
                    setImageUri(`https://ipfs.io/ipfs/${res.path}`);
                    setLoading(false);
                });
        },
        showUploadList: false,
    };

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState([]);
    
    const updateJsonToIpfs = () => {
        STARTING_JSON_NFT.description = description;
        STARTING_JSON_NFT.image = imageUri;
        STARTING_JSON_NFT.external_url = imageUri;
        STARTING_JSON_NFT.name = name;
        // todo: need a foreach loop to go through each attribute if more than one
        STARTING_JSON_NFT.attributes[0] = { 'trait_type': 'Gender', 'value': 'Male' }

        ipfs.add(JSON.stringify(STARTING_JSON_NFT))
            .then((res) => {
                console.log(res);
                setNftJsonHash(res.path);
                setLoading(false);
            })
    }

    return (
        <div style={{ margin: 10, marginLeft: 50 }}>
        <h3>Create An NFT</h3>
        {/* <Button onClick={getTotalSupply}>Get Total Supply</Button> */}        
        <Divider />
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
            {/* Name and description section, also display uploaded image to the right --> */}
            <Row gutter={24}>
                <Col span={6}>  
                    <label>Name of your NFT</label>                 
                    <Input type='text' 
                        onChange={(event) => { 
                            console.log(event.target.value); 
                            setName(event.target.value);
                        }}
                    />                   
                </Col>
                <Col span={10}>
                    
                </Col>
            </Row><br />
            <Row gutter={24}>
                <Col span={6}>
                    <label>Description of your NFT</label>                
                    <Input.TextArea type='text' 
                        onChange={(event) => { 
                            console.log(event.target.value); 
                            setDescription(event.target.value);
                        }} 
                    />                   
                </Col>
                <Col span={10}>
                    <Row>
                        <Col span={16}>
                            <Space size={12}>
                            <Image
                                width={200}
                                src={imageUri}
                                placeholder={
                                <Image
                                    preview={false}
                                    src={imageUri}
                                    width={200}
                                />
                                }
                            />                        
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={16}>
                            {name} 
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={16}>
                            {description}
                        </Col>
                    </Row>
                    
                </Col>
            </Row><br />
            <Row>
                <Col>
                    <label>Choose Chain: </label><br />               
                    <span>Matic Mumbai</span>&nbsp;&nbsp;<Switch disabled/>&nbsp;&nbsp;<span>Mainnet ETH</span>                  
                </Col>
            </Row>
        
         {/* Attributes section */}
        <Row 
            style={{ margin: 15, textAlign: 'center', alignContent: 'center' }}
            gutter={24}>
                <Col span={15}>
                    <Form name="dynamic_form_nest_item" autoComplete="off">
                        <Form.List name="users">
                            {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                    {...field}
                                    name={[field.name, 'trait_type']}
                                    fieldKey={[field.fieldKey, 'trait_type_key']}
                                    rules={[{ required: true, message: 'Missing trait type' }]}
                                    >
                                    <Input placeholder="trait type" />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'last']}
                                        fieldKey={[field.fieldKey, 'last']}
                                        rules={[{ required: true, message: 'Missing value' }]}
                                    >
                                        <Input placeholder="value" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                                ))}
                                <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Attribute(s)
                                </Button>
                                </Form.Item>
                            </>
                            )}
                        </Form.List>
                        <Form.Item>
                        <Button disabled={loading} onClick={() => {
                                updateJsonToIpfs();
                                tx( writeContracts.YourCollectible.mintItem(nftJsonHash) )
                            }}>Mint NFT</Button>
                        </Form.Item>
                    </Form>
                </Col>                
            </Row>     
        
        </div>
    )
}

export default CreateNFT;