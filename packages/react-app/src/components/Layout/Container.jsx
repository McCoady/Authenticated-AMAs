import React from "react";
import { Row, Col } from "antd";

function Container({ children, mt }) {
  return (
    <Row justify="center" align="middle" style={{ width: "100%", marginTop: mt }}>
      <Col xs={22} sm={20} md={18} lg={14} xl={10}>
        {children}
      </Col>
    </Row>
  );
}

export default Container;
