import React from "react";
import { Row, Col } from "antd";

function Center({ children }) {
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ width: "100%", backgroundColor: "blue", textAlign: "center", alignContent: "center" }}
    >
      <Col span={24}>{children}</Col>
    </Row>
  );
}

export default Center;
