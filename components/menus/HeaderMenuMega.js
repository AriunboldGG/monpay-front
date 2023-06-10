import { Row, Col } from 'react-bootstrap';
import IctLink from 'components/IctLink';

function HeaderMenuMega(props) {
    const { menuItem } = props;
    let $mega_menu_grid_md = '1';
    let $mega_menu_grid_xl = '1';
    if (menuItem.mega_column) {
        switch (menuItem.mega_column) {
            case '2':
                $mega_menu_grid_md = '1';
                $mega_menu_grid_xl = '2';
                break;
            case '3':
                $mega_menu_grid_md = '1';
                $mega_menu_grid_xl = '3';
                break;
            case '4':
                $mega_menu_grid_md = '2';
                $mega_menu_grid_xl = '4';
                break;
            case '5':
                $mega_menu_grid_md = '3';
                $mega_menu_grid_xl = '5';
                break;
        }
    }
    return (
        <>
            {menuItem.custom_desc && (
                <h5 className="is-mega-title">{menuItem.custom_desc}</h5>
            )}
            <Row
                className="no-gutters"
                md={$mega_menu_grid_md}
                xl={$mega_menu_grid_xl}
            >
                {menuItem.sub_items.map((sub_item, i) => {
                    return (
                        <Col key={i}>
                            <IctLink
                                activeClassName="active"
                                href={sub_item.link}
                                hrefCustom={sub_item.custom_active_link}
                            >
                                <a className="dropdown-item">
                                    {sub_item.custom_image && (
                                        <div className="is-mega-icon">
                                            <img src={sub_item.custom_image} />
                                        </div>
                                    )}
                                    <div className="is-mega-content">
                                        {sub_item.text && sub_item.text}
                                        {sub_item.custom_desc && (
                                            <span>{sub_item.custom_desc}</span>
                                        )}
                                    </div>
                                </a>
                            </IctLink>
                        </Col>
                    );
                })}
            </Row>
        </>
    );
}
export default HeaderMenuMega;
