import React, { Component } from "react";
import RenderElements, { RenderElementWrapper } from "components/elements/RenderElements" 
import { Col, Nav, Row, Tab } from "react-bootstrap";
export default class VcTabs extends Component {
  render() {
    const $content = this.props.content
    const $atts    = this.props.atts

    return(
        <RenderElementWrapper atts={$atts}>
            <Tab.Container defaultActiveKey={0}>
                <Row>
                    <Col md={4} lg={3}>
                        <Nav variant="pills" className="tw-flex-md-direction h-100 tw-tab-left-side">
                            {
                                $content.map( (tabItem, i) => {
                                    return (
                                        <Nav.Item key={i}>
                                            <Nav.Link eventKey={i}>{tabItem.atts.title}</Nav.Link>
                                        </Nav.Item>
                                    )
                                })
                            }
                        </Nav>
                    </Col>
                    <Col md={8} lg={9}>
                        <Tab.Content className="tw-tab-right-side">
                            {
                                $content.map( (tabItem, i) => {
                                    return (
                                        <Tab.Pane eventKey={i} key={i}>
                                            {<RenderElements elements={tabItem.content} />}
                                        </Tab.Pane>
                                    )
                                })
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </RenderElementWrapper>
    );
  }
}