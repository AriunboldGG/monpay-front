import React from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import uniqid from 'uniqid';
import Link from 'next/link';
//Wordpress-н TwHeading element-г харуулж буй хэсэг
const TwHeading = (props) => {
    const $content = props.content;
    const $contentType = typeof $content;

    let $atts = props.atts;
    let $output = [];

    $atts.element_atts.class.push($atts.title_align);
    $atts.element_atts.class.push($atts.title_size);
    $atts.element_atts.class.push($atts.heading_bg);
    $atts.element_atts.class.push($atts.flipbox_line);

    if ($atts.sub_title) {
        $output.push(
            <h5
                key={uniqid()}
                className="heading-sub-title"
                dangerouslySetInnerHTML={{
                    __html: $atts.sub_title,
                }}
            />
        );
    }

    if ($atts.title) {
        $output.push(
            React.createElement(
                `${$atts.heading_tag}`,
                {
                    key: uniqid(),
                    className: `heading-title`,
                },
                $atts.title
            )
        );
    }

    if ($content && $contentType === 'string') {
        $output.push(
            <div
                key={uniqid()}
                className="heading-desc"
                dangerouslySetInnerHTML={{ __html: '<p>' + $content + '</p>' }}
            ></div>
        );
    }

    if ($atts.button_url && $atts.image) {
        $output.push(
            <div className="heading-link" key={uniqid()}>
                <a href={$atts.button_url} className="mp-clints">
                    <>
                        <div className="heading-icon">
                            <img src={$atts.image} />
                        </div>
                        <span>{$atts.button_title}</span>
                    </>
                </a>
            </div>
        );
    }

    return <RenderElementWrapper atts={$atts}>{$output}</RenderElementWrapper>;
};

export default TwHeading;
