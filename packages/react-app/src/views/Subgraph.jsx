import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { MailOutlined } from "@ant-design/icons";
import { Row, Col, Button, List, Tabs, Menu, Select, Typography, Table, Input } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';

const { Title } = Typography;

const { Option } = Select;

  const highlight = { marginLeft: 4, marginRight: 8, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }

function Subgraph(props) {

  function graphQLFetcher(graphQLParams) {
    return fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  const EXAMPLE_GRAPHQL = `
    {
      addrs(where:{allowed: true}) {
        id
      }
    }
  `
  const EXAMPLE_GQL = gql(EXAMPLE_GRAPHQL)
  const { loading, error, data } = useQuery(EXAMPLE_GQL,{pollInterval: 2500});



  return (
      <>
          <div style={{ margin: 32, marginTop: 32, margin: "auto" }}>
            You will find that parsing/tracking events with the <span style={highlight}>useEventListener</span> hook becomes a chore for every new project.
          </div>
          <div style={{ margin: 32, marginTop: 32, margin: "auto" }}>
            Instead, you can use <a href="https://thegraph.com/docs/introduction" target="_blank">The Graph</a> with 🏗 scaffold-eth by following these steps:
          </div>

          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>📡</span>
            Spin up a local graph node by running
            <span style={highlight}>
              yarn graph-run-node
            </span>
            <span style={{ marginLeft: 4}}> (requires <a href="https://www.docker.com/products/docker-desktop" target="_blank"> Docker</a>) </span>
          </div>

          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>📝</span>
            Create your <b>local subgraph</b> by running
            <span style={highlight}>
              yarn graph-create-local
            </span>
            (only required once!)
          </div>

          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>🚢</span>
            Deploy your <b>local subgraph</b> by running
            <span style={highlight}>
              yarn graph-ship-local
            </span>
          </div>

          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>🖍️</span>
            Edit your <b>local subgraph</b> in
            <span style={highlight}>
              packages/subgraph/src
            </span>
             (learn more about subgraph definition <a href="https://thegraph.com/docs/define-a-subgraph" target="_blank">here</a>)
          </div>

          <div style={{ margin: 32 }}>
            <span style={{ marginRight: 8 }}>🤩</span>
            Deploy your <b>contracts and your subgraph</b> in one go by running
            <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
              yarn deploy-and-graph
            </span>
          </div>

          <div style={{width:780, margin: "auto", paddingBottom:64}}>

            <div style={{margin:32, height:400, border:"1px solid #888888", textAlign:'left'}}>
              <GraphiQL fetcher={graphQLFetcher} docExplorerOpen={true} query={EXAMPLE_GRAPHQL}/>
            </div>

          </div>

          <div style={{padding:64}}>
          ...
          </div>
      </>
  );
}

export default Subgraph;
