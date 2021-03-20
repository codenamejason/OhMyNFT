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
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('')
    const [form] = Form.useForm();
    const [image, setImage] = useState(null);
    const [b64Image, setb64Image] = useState(null);
    const [imageHash, setImageHash] = useState();
    const [imageUri, setImageUri] = useState();
    const [file, setFile] = useState();
    const [fileList, setFileList] = useState([])
    const [images, setImages] = useState([]);

    // const addImageToIpfs = async (uploadedImages) => {
    //     console.log('item', uploadedImages)
    //     await mergeImages([
    //         { src: sampleImage }
    //     ], {}).then(b64 => {
    //         let imageBuffer = Buffer.from(b64.split(',')[1], 'base64');
    //         const imageResult = ipfs.add(imageBuffer)
    //             .then((res) => {
    //                 setImageHash(res.path);
    //                 setImageUri('https://ipfs.io/ipfs/' + res.path);
    //             })
    //     })
    //     // get image and send to ipfs
    //     uploadedImages.map((item, index) => {
    //         console.log(index, item)
    //     })

        
    //     // merge if more than one image and convert to base64
        
    // }

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
                    setImageHash(res.path);
                    setImageUri('https://ipfs.io/ipfs/' + res.path);
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
        action: uploadJsonToIpfs,
        showUploadList: false,
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
            setFile(info.file);
            setFileList(info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
    };

    // const getTotalSupply = async () => {
    //     const reslutOfTotalSupply = await rinkebyZora.totalSupply()
    //         .then(() => console.log(reslutOfTotalSupply));
    //     //console.log(reslutOfTotalSupply);
    // }

    const onDrop = (uploadedImages) => {
        setImages(uploadedImages);
        uploadJsonToIpfs(uploadedImages);
    }

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    return (
        <div style={{ margin: 10 }}>
        <h3>Create An NFT</h3>
        {/* <Button onClick={getTotalSupply}>Get Total Supply</Button> */}
        
        <Divider />
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
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
                    <img src={b64Image} style={{ maxWidth: 150 }} />
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
                    <Button onClick={() => {
                            tx( writeContracts.YourCollectible.mintItem('QmZKpLrKUdx9h14Rio3YXwQz3GjijtdbKvo4kwf85EQtPs') )
                        }}>Mint NFT</Button>
                    </Form.Item>
                    </Form>
                </Col>                
            </Row>     
        
        {fileList.map((item, index) => {
            console.log(index, item.name, item.type, item.size)
        })}
        </div>
    )
}

export default CreateNFT;