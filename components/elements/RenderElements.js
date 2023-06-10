import React, { Component } from 'react';

import TwImage from 'components/elements/TwImage';
import TwHeading from 'components/elements/TwHeading';
import TwSlider from 'components/elements/TwSlider';
import TwButton from 'components/elements/TwButton';
import TwPostCarousel from 'components/elements/TwPostCarousel';
import TwStore from 'components/elements/TwStore';
import TwMap from 'components/elements/TwMap';
import TwMenup from 'components/elements/TwMenup';
import TwSimple from 'components/elements/TwSimple';
import TwMenuBottom from 'components/elements/TwMenuBottom';
import TwClient from 'components/elements/TwClient';
import TwQr from 'components/elements/TwQr';
import TwSocial from 'components/elements/TwSocial';
import TwBlogCats from 'components/elements/TwBlogCats';
import TwHereglegch from 'components/elements/TwHereglegch';
import TwText from 'components/elements/TwText';
import TwLogin from 'components/elements/TwLogin';
import VcAccordion from 'components/elements/VcAccordion';
import VcColumn from 'components/elements/VcColumn';
import VcRow from 'components/elements/VcRow';
import VcRowInner from 'components/elements/VcRowInner';
import VcSection from 'components/elements/VcSection';
import VcTabs from 'components/elements/VcTabs';
import VcColumnInner from 'components/elements/VcColumnInner';
import MpPayment from 'components/elements/MpPayment';
import MpOntsloh from 'components/elements/MpOntsloh';
import MpIntroduction from 'components/elements/MpIntroduction';
import MpCounterup from 'components/elements/MpCounterup';
import MpTeam from 'components/elements/MpTeam';
import MpIconBox from 'components/elements/MpIconBox';
import MpPartners from 'components/elements/MpPartners';
import TwNavigation from 'components/elements/TwNavigation';
// import TwRegister from "components/elements/TwRegister";
import MpIconBoxItem from 'components/elements/MpIconBoxItem';

/*** Render Elements ***/

export default class RenderElements extends Component {
    render() {
        const elements = this.props.elements;
        const element_components = {
            tw_image: TwImage,
            tw_heading: TwHeading,
            tw_button: TwButton,
            tw_post_carousel: TwPostCarousel,
            tw_qr: TwQr,
            tw_navigation: TwNavigation,
            vc_accordion: VcAccordion,
            vc_section: VcSection,
            vc_row: VcRow,
            vc_row_inner: VcRowInner,
            vc_column_inner: VcColumnInner,
            vc_column: VcColumn,
            vc_tabs: VcTabs,
            tw_map: TwMap,
            tw_client: TwClient,
            tw_menu_bottom: TwMenuBottom,
            tw_menup: TwMenup,
            tw_text: TwText,
            tw_hereglegch: TwHereglegch,
            tw_blog_cats: TwBlogCats,
            // tw_register:        TwRegister,
            tw_slider: TwSlider,
            tw_social: TwSocial,
            tw_simple: TwSimple,
            tw_store: TwStore,
            tw_login: TwLogin,
            mp_payment: MpPayment,
            mp_partners: MpPartners,
            mp_ontsloh: MpOntsloh,
            mp_team: MpTeam,
            mp_iconbox: MpIconBox,
            mp_counterup: MpCounterup,
            mp_taniltsuulga: MpIntroduction,
            tw_iconbox: MpIconBoxItem,
        };

        if (elements) {
            if (typeof elements === 'string') {
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: '<p>' + elements + '</p>',
                        }}
                    ></div>
                );
            } else if (typeof elements === 'object' && elements.length) {
                return (
                    elements.length &&
                    elements.map((row, index) => {
                        const Tag = element_components[row.name];
                        return Tag ? (
                            <Tag
                                key={index}
                                atts={{ key: index, ...row.atts }}
                                content={row.content}
                            />
                        ) : (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{
                                    __html: '<p>[' + row.name + ']</p>',
                                }}
                            ></div>
                        );
                    })
                );
            }
        }

        return null;
    }
}

/**
 * Render Element's Wrapper
 */
export class RenderElementWrapper extends Component {
    render() {
        const atts = this.props.atts;
        const Tag = atts.tag || 'div';
        let output = [];
        let el_atts = [];

        if (atts.element_atts && typeof atts.element_atts === 'object') {
            Object.entries(atts.element_atts).forEach(function (item) {
                let key = item[0] === 'class' ? 'className' : item[0];
                let val = item[1];
                if (key === 'style') {
                    el_atts[key] = val;
                } else {
                    if (key === 'className') {
                        val = val.filter(
                            (valItem, i) => val.indexOf(valItem) === i
                        );
                    }
                    el_atts[key] = val.join(' ');
                }
            });
        }

        /* Class */
        if (!el_atts.className) {
            el_atts.className = '';
        }

        /* Custom Class */
        if (atts.custom_class) {
            el_atts.className +=
                (el_atts.className ? ' ' : '') + atts.custom_class;
        }
        if (this.props.className) {
            el_atts.className +=
                (el_atts.className ? ' ' : '') + this.props.className;
        }

        /* Elem */
        if (atts.uk_light) {
            el_atts.className += ' uk-light';
        }
        if (atts.style) {
            el_atts.className += ' ' + atts.style;
        }

        // if ( atts.desktop )       { el_atts.className += ' ict-hidden-desktop' ; }
        // if ( atts.tablet )        { el_atts.className += ' ict-hidden-tablet' ; }
        // if ( atts.mobile )        { el_atts.className += ' ict-hidden-mobile' ; }

        /* custom attributes */
        if (atts.custom_id) {
            el_atts['id'] = atts.custom_id;
        }
        if (atts.button_url) {
            el_atts['href'] = atts.button_url;
        }
        if (atts.button_target) {
            el_atts['target'] = atts.button_target;
        }

        /* Background Video */
        // if ( atts.bg_video ) {
        //     el_atts.className += ' data-uk-cover-container';
        //     output.push( <div className="ict-background-video" data-uk-cover="" data-video-embed={atts.bg_video} /> );
        // }

        /* Content */
        if (this.props.children) {
            output.push(this.props.children);
        }

        return (
            <Tag key={atts.key} {...el_atts}>
                {output}
            </Tag>
        );
    }
}
