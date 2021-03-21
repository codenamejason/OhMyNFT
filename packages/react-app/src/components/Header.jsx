import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/codenamejason/OhMyNFT/tree/buyer-mints-nft" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🖼 Oh My NFT"
        subTitle="Mint NFT's"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
