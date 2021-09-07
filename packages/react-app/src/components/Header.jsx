import React from "react";
import { PageHeader, Space } from "antd";
import ThemeSwitcher from "./ThemeSwitch";

// displays a page header

export default function Header({ networkDisplay }) {
  return (
    <PageHeader
      title={<a href="/">🎙 Authenticated AMAs</a>}
      subTitle="Sign a message with your wallet to log in..."
      extra={[
        <Space>
          {networkDisplay}
          <ThemeSwitcher />
        </Space>,
      ]}
    />
  );
}
