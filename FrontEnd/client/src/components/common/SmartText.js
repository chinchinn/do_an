import { Tooltip, Typography } from 'antd';
import React, { Component } from "react";
const { Text } = Typography;


// Usage example
function SmartText({ text, maxLength }) {
    if (text.length > maxLength) {
      return (
        <Tooltip title={text}>
          <Text ellipsis>{text}</Text>
        </Tooltip>
      );
    }
    
    return <Text>{text}</Text>;
  }
  
  export default SmartText