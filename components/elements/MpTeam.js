import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
//Wordpress-н MpTeam element-г харуулж буй хэсэг
const MpTeam = (props) => {
    const $atts = props.atts;

    return (
        <RenderElementWrapper atts={$atts}>
            {$atts && $atts.image && $atts.name && $atts.positoin && (
                <div className="mp-team-item">
                    <img className="image" src={$atts.image} />
                    <div className="content">
                        <h5 className="title">{$atts.name}</h5>
                        <span className="position">{$atts.positoin}</span>
                    </div>
                </div>
            )}
        </RenderElementWrapper>
    );
};

export default MpTeam;
