import React, { Component } from "react";
import RenderElements, { RenderElementWrapper } from "components/elements/RenderElements"

export default class VcRowInner extends Component {
  render() {
    const $content     = this.props.content;
    const $contentType = typeof $content;
    const $atts        = this.props.atts;
    let   $output      = '';

    $output = $contentType==='object'&&<div className="row"><RenderElements elements={$content} /></div>;
    return(
      <RenderElementWrapper atts={$atts}>
        {$output}
      </RenderElementWrapper>
    );
  }
}