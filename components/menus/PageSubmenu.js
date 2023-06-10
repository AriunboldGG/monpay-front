import React from 'react'
import {Row, Col} from 'react-bootstrap';
import IctLink from 'components/IctLink'

function PageSubmenu(props) {
  const { submenu } = props;

  return (
    <section className={`tw-row pt-0 pb-0 tw-page-submenu`}>
      <div className="container-md">
        <Row>
          <Col>
            <ul>
              {
                submenu.map(( item, i ) => (
                  <li key={i}>
                    <IctLink activeClassName="active" href={item.link}><a>{item.text}</a></IctLink>
                  </li>
                ))
              }
            </ul>
          </Col>
        </Row>
      </div>
    </section>
  );
}
export default PageSubmenu;