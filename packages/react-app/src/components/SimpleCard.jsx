import React from "react";
import { Card } from "antd";

// displays a page header

export default function Header() {
    return (
        <Card title="AMA Title" extra={<a href="#">More</a>} style={{ width: 300 }}>
            <p>TokenName (contract)</p>
            <p>User</p>
        </Card>
    );
}