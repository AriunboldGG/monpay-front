import React, { Component } from 'react';
import RenderElements, {
    RenderElementWrapper,
} from 'components/elements/RenderElements';
import { Accordion, Card } from 'react-bootstrap';
// import Accordion from 'react-bootstrap/Accordion'
import uniqid from 'uniqid';

//Wordpress-н VcAccordion element-г харуулж буй хэсэг
export default class VcAccordion extends Component {
    render() {
        const $content = this.props.content;
        const $atts = this.props.atts;

        return (
            <RenderElementWrapper atts={$atts}>
                {$content && (
                    <Accordion>
                        {$content.map((item, index) => {
                            const $itemKey = uniqid();
                            return (
                                <Accordion.Item eventKey={$itemKey} key={index}>
                                    <Accordion.Header as={Card.Header}>
                                        {item.atts.title}
                                    </Accordion.Header>
                                    <Accordion.Body eventKey={$itemKey}>
                                        {/* <Card.Body> */}
                                        {
                                            <RenderElements
                                                elements={item.content}
                                            />
                                        }
                                        {/* </Card.Body> */}
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                )}
            </RenderElementWrapper>
        );
    }
}
