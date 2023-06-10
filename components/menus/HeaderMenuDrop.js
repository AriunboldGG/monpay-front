import HeaderMenuDropButton from 'components/menus/HeaderMenuDropButton';
import IctLink from 'components/IctLink';

function HeaderMenuDrop(props) {
    const { sub_item } = props;
    return sub_item.sub_items && sub_item.sub_items.length ? (
        <HeaderMenuDropButton sub_item={sub_item} />
    ) : (
        <IctLink
            activeClassName="active"
            href={sub_item.link === '#' ? '' : sub_item.link}
            hrefCustom={sub_item.custom_active_link}
        >
            <a className="dropdown-item">{sub_item.text}</a>
        </IctLink>
    );
}
export default HeaderMenuDrop;
