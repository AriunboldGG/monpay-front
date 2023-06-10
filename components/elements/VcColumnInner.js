import React, { Component } from "react";
import RenderElements, { RenderElementWrapper } from "components/elements/RenderElements"

export default class VcColumnInner extends Component {
    render() {
        const $content = this.props.content;
        const $contentType = typeof $content;
        let $atts = this.props.atts;

        switch ($atts.width) {
            case '1/1':
                $atts.element_atts.class.push('col');
                break;
            case '11/12':
                $atts.element_atts.class.push('col-lg-11');
                break;
            case '5/6':
                $atts.element_atts.class.push('col-lg-10');
                break;
            case '3/4':
                $atts.element_atts.class.push('col-lg-9');
                break;
            case '2/3':
                $atts.element_atts.class.push('col-lg-8');
                break;
            case '7/12':
                $atts.element_atts.class.push('col-lg-7');
                break;
            case '1/2':
                $atts.element_atts.class.push('col-lg-6');
                break;
            case '5/12':
                $atts.element_atts.class.push('col-lg-5');
                break;
            case '1/3':
                $atts.element_atts.class.push('col-lg-4');
                break;
            case '1/4':
                $atts.element_atts.class.push('col-lg-3');
                break;
            case '1/6':
                $atts.element_atts.class.push('col-lg-2');
                break;
            case '1/12':
                $atts.element_atts.class.push('col-lg-1');
                break;
            case '1/5':
                $atts.element_atts.class.push('tw-1-5');
                break;
            case '2/5':
                $atts.element_atts.class.push('tw-2-5');
                break;
            case '3/5':
                $atts.element_atts.class.push('tw-3-5');
                break;
            case '4/5':
                $atts.element_atts.class.push('tw-4-5');
                break;
            default:
                $atts.element_atts.class.push('col');
        }
        return (
            <RenderElementWrapper atts={$atts}>
                {$contentType === 'object' && <RenderElements elements={$content} />}
            </RenderElementWrapper>
        );
    }
}