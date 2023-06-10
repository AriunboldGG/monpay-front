import { useState } from 'react'
import { useRouter } from 'next/router'
import { NavDropdown } from "react-bootstrap";
import HeaderMenuMega       from "components/menus/HeaderMenuMega"
import HeaderMenuDrop       from "components/menus/HeaderMenuDrop"
import { ictTrimSlashes, ictRmMultiSlashes } from 'lib/Functions'

function HeaderMenuDropParent(props) {
    const { menuItem } = props;
    const [show, setShow] = useState(false);
    const showDropdown = () => {
        document.body.classList.add('tw-menu-dropdown-open')
        setShow(true)
    }
    const hideDropdown = () => {
        document.body.classList.remove('tw-menu-dropdown-open')
        setShow(false)
    }
    /* Actvie */
    const { asPath } = useRouter()
    const $asPath = '/'+ictTrimSlashes( ictRmMultiSlashes( asPath ) )+'/'
    let active = false
    let customActiveLink = menuItem.custom_active_link && menuItem.custom_active_link.length ? menuItem.custom_active_link : []
    if ( menuItem.link ) {
        customActiveLink.push( menuItem.link )
    }
    customActiveLink.map( crLink => {
        let crrHref = '/'+ictTrimSlashes( ictRmMultiSlashes( crLink ) )+'/'
        if ( $asPath.search( crrHref ) >= 0 ) {
            active = true
        }
    })

    return (
        <NavDropdown
            renderMenuOnMount
            className={menuItem.is_mega&&"is-mega-menu"}
            title={menuItem.text}
            show={show}
            active={active}
            onMouseEnter={showDropdown} 
            onMouseLeave={hideDropdown}
        >
            {
                menuItem.is_mega
                ?   <HeaderMenuMega menuItem={menuItem} />
                :   ( menuItem.sub_items.map( (sub_item,i) => <HeaderMenuDrop key={i} sub_item={sub_item} />))
            }
        </NavDropdown>
    )
}
export default HeaderMenuDropParent