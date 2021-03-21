import React, { useState } from "react";
import { Form, Col, Row, Button, List, Divider, Input, Card, DatePicker, Slider, Space, Switch, Progress, Spin, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';
import { SyncOutlined, InboxOutlined, UploadOutlined, StarOutlined, PlusOutlined, LoadingOutlined, MinusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import mergeImages from 'merge-images';
import ImageUploader from 'react-images-upload';
/** Zora Integration */
//import { Zora } from '@zoralabs/zdk';
//import { Wallet } from 'ethers';

import sampleImage from '../images/scaffold-eth.png';

//const wallet = Wallet.createRandom();
//const rinkebyZora = new Zora(wallet, 4);
//console.log(rinkebyZora)
// The constructor can optionally accept two parameters to override the official supported Zora Protocol addresses.
//const localZora = new Zora(wallet, 50, 'media contract address', 'market contract address');
//const mainnetZora = new Zora(wallet, 1);

const { BufferList } = require('bl')
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require('ipfs-http-client');
const Hash = require('ipfs-only-hash')
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

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
    //const [imageUrl, setImageUrl] = useState('')
    //const [form] = Form.useForm();
    const [b64Image, setb64Image] = useState(null);
    const [imageHash, setImageHash] = useState();
    const [imageUri, setImageUri] = useState();
    const [nftJsonHash, setNftJsonHash] = useState()
    
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

    const updateJsonToIpfs = () => {
        STARTING_JSON_NFT.description = 'Testing out minting';
        STARTING_JSON_NFT.image = imageUri;
        STARTING_JSON_NFT.external_url = imageUri;
        STARTING_JSON_NFT.name = 'Scaffold-Eth'
        STARTING_JSON_NFT.attributes[0] = { 'trait_type': 'Gender', 'value': 'Male' }

        ipfs.add(JSON.stringify(STARTING_JSON_NFT))
            .then((res) => {
                console.log(res);
                setNftJsonHash(res.path);
                setLoading(false);
            })
    }

    const props = {
        name: 'file',
        action: (file) => {
            console.log(file)
            ipfs.add(file)
                .then((res) => {
                    console.log('hash', res);
                    setImageHash(res.path);
                    setImageUri(`https://ipfs.io/ipfs/${res.path}`);
                    setLoading(false);
                });
        },
        showUploadList: false,
    };

    // const getTotalSupply = async () => {
    //     const reslutOfTotalSupply = await rinkebyZora.totalSupply()
    //         .then(() => console.log(reslutOfTotalSupply));
    //     //console.log(reslutOfTotalSupply);
    // }

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null)
    
    return (
        <div style={{ margin: 10 }}>
        <h3>Create An NFT</h3>
        {/* <Button onClick={getTotalSupply}>Get Total Supply</Button> */}
        
        <Divider />
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {/* <input type='file' name='file' onChange={(event) => {
            console.log(event.target.value)
            console.log(event.target.files[0])
            const data = new FormData();
            data.append('file', selectedFile);
        }} /> */}
        {/* <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
        /> */}
        
            {/* Name and description section, also display uploaded image to the right --> */}
            <Row gutter={24}>
                <Col span={8}>  
                    <label>Name of your NFT</label>                 
                    <Input type='text' onChange={(event) => { console.log(event.target.value)}} />                   
                </Col>
                <Col span={8}>
                    Preview
                </Col>
            </Row><br />
            <Row gutter={24}>
                <Col span={8}>
                    <label>Description of your NFT</label>                
                    <Input.TextArea type='text' onChange={(event) => { console.log(event.target.value)}} />                   
                </Col>
                <Col span={8}>
                    <img src={imageUri} style={{ maxWidth: 150 }} />
                </Col>
            </Row><br />
            <Row>
                <Col>
                    <label>Choose Chain: </label><br />               
                    <span>Matic</span>&nbsp;&nbsp;<Switch/>&nbsp;&nbsp;<span>Mainnet</span>                  
                </Col>
            </Row>
        
         {/* Attributes section */}
        <Row 
            style={{ margin: 15, textAlign: 'center', alignContent: 'center' }}
            gutter={24}>
                <Col span={15}>
                    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
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