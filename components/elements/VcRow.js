import React, { Component } from 'react';
import RenderElements, {
    RenderElementWrapper,
} from 'components/elements/RenderElements';

export default class VcRow extends Component {
    render() {
        const $content = this.props.content;
        const $contentType = typeof $content;
        // const news = this.props.news;
        let $atts = this.props.atts;
        var $output = '';
        if ($atts.content_width === 'container-fluid') {
            $atts.content_width += ' overflow-hidden';
        }

        $output = (
            <div
                className={
                    $atts.content_width ? $atts.content_width : 'container'
                }
            >
                {$contentType === 'object' && (
                    <div className="row">
                        <RenderElements elements={$content} />
                    </div>
                )}
            </div>
        );

        return (
            <RenderElementWrapper atts={$atts}>{$output}</RenderElementWrapper>
        );
    }
}
