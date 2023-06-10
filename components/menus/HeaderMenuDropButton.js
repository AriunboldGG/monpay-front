import { useState } from 'react'
import { useRouter } from 'next/router'
import { DropdownButton } from "react-bootstrap";
import HeaderMenuDrop  from "components/menus/HeaderMenuDrop"
import { ictTrimSlashes, ictRmMultiSlashes } from 'lib/Functions'

function HeaderMenuDropButton(props) {
    const { sub_item } = props;
    const [show, setShow] = useState(false);
    const showDropdown = () => {setShow(true)}
    const hideDropdown = () => {setShow(false)}

    /* Active */
    const { asPath } = useRouter()
    const $asPath = '/'+ictTrimSlashes( ictRmMultiSlashes( asPath ) )+'/'
    let active = false
    let customActiveLink = sub_item.custom_active_link && sub_item.custom_active_link.length ? sub_item.custom_active_link : []
    if ( sub_item.link ) {
        customActiveLink.push( sub_item.link )
    }
    customActiveLink.map( crLink => {
        let crrHref = '/'+ictTrimSlashes( ictRmMultiSlashes( crLink ) )+'/'
        if ( $asPath.search( crrHref ) >= 0 ) {
            active = true
        }
    })

    return (
        <DropdownButton
            renderMenuOnMount
            className={'dropdown-item' + ( active ? ' active' : '' )}
            drop={`right`}
            title={sub_item.text}
            show={show}
            onMouseEnter={showDropdown} 
            onMouseLeave={hideDropdown}
        >
            {sub_item.sub_items.map( (dropdown_sub_item,i) => <HeaderMenuDrop key={i} sub_item={dropdown_sub_item}/>)}
        </DropdownButton>
    )
}
export default HeaderMenuDropButton