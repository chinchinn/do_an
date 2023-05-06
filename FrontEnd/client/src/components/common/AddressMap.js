import React from 'react';
import { Row, Col } from 'antd';
const AddressMap = () => {
    return (
        <Row>
            <Col lg={{ span: 24 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d125435.42042848468!2d106.63989162831561!3d10.745511113547574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e0!4m0!4m5!1s0x317527e43dc63cff%3A0xc0a9013e9fa9ad36!2zUFBGRytYSFIgVGhlIFBlYWsgTTggTWlkdG93biwgxJAuIFPhu5EgMTUsIFTDom4gUGjDuiwgUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!3m2!1d10.7256944!2d106.728034!5e0!3m2!1svi!2s!4v1682520705844!5m2!1svi!2s" width="100%" height="350" style={{ border: 0 }} aria-hidden="false" ></iframe>
            </Col>
        </Row>
    );
}
export { AddressMap }