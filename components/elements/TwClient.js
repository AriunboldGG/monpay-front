import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н MpClient element-г харуулж буй хэсэг
const MpClient = (props) => {
  const $atts = props.atts;
  const $content = props.content;
  const $contentType = typeof $content;

  return (
    <RenderElementWrapper atts={$atts}>
      {$contentType === 'object' &&
        $content.map((contItem, i) => (
          <div key={i}>
            {$atts.column && (
              <div>
                {(contItem.atts.title ? contItem.atts.image : '') && (
                  <div>
                    <img src={contItem.atts.image} />
                    <span>{contItem.atts.title}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </RenderElementWrapper>
  );
};

export default MpClient;
