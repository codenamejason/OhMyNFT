import { PageHeader } from "antd";
import React from "react";

export default function Header(props) {
  return (
    <div
      onClick={() => {
        window.open("https://github.com/austintgriffith/scaffold-eth");
      }}
    >
      <PageHeader
        className="header"
        title="🏗 scaffold-eth"
        subTitle="forkable Ethereum dev stack focused on fast product iteration"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
