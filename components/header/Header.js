import React, { useState, useContext, useEffect } from 'react';
import { Container, Dropdown, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import IctLink from 'components/IctLink';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IctContext from 'context/ict-context';
import jsCookie from 'js-cookie';

const Header = (props) => {
  const { setLogout } = useContext(IctContext);

  const { menu } = props;
  const [displayName, setDisplayName] = useState('');
  const [lang, setLang] = useState('mn');
  const router = useRouter();
  const [userShortInfo, setuserShortInfo] = useState('');

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
  };

  const [showUser, setShowUser] = useState(false);
  const handleShowUser = () => {
    setShowUser(true);
  };
  const handleCloseUser = () => {
    setShowUser(false);
  };

  if (router.locale && router.locale !== lang) {
    setLang(router.locale);
  }
  const toggleLang = () => {
    const newLocale = router.locale === 'mn' ? 'en' : 'mn';
    jsCookie.set('NEXT_LOCALE', newLocale);
    router.push(router.asPath, undefined, {
      locale: newLocale,
    });
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo) return;
    setDisplayName(
      `${userInfo.lastName?.substring(0, 1)}. ${userInfo.firstName}`
    );
    const body = {
      limit: null,
    };
    setuserShortInfo(userInfo);
  }, []);

  return (
    <header>
      <Container>
        <Navbar bg="light" expand="lg" className="header-inner-row">
          {router && router.locale === 'mn' ? (
            <Navbar.Brand href="/">
              <img className="mp-header-img" src="/monpay-logo.svg" />
            </Navbar.Brand>
          ) : (
            <Navbar.Brand href="/en">
              <img className="mp-header-img" src="/monpay-logo.svg" />
            </Navbar.Brand>
          )}
          {/* menu huraagdaagui bh uein undsn */}
          <div className="mp-menu-navbar">
            {menu &&
              menu.main &&
              menu.main.menu &&
              menu.main.menu.map((menuItem, i) => (
                <ul className="navbar-nav nav-item" key={i}>
                  <li className="nav-item active">
                    <IctLink
                      activeClassName="active"
                      href={menuItem.link}
                      hrefCustom={menuItem.custom_active_link}
                    >
                      <a>{menuItem.text}</a>
                    </IctLink>
                  </li>
                </ul>
              ))}
          </div>
          <div className="mp-menu-lang">
            {/* nevtersn ueiin  huraagdsn burger menu  */}
            <Button
              variant="primary"
              onClick={handleShow}
              className="web-menu-button"
            ></Button>
            {userShortInfo?.userId ? (
              <Navbar.Offcanvas
                className="offcanvas offcanvas-top custom-canvas-top"
                onClick={handleClose}
                show={show}
              >
                <Offcanvas.Body>
                  <>
                    {menu &&
                      menu.main &&
                      menu.main.menu &&
                      menu.main.menu.map((menuItem, i) => (
                        <ul key={i}>
                          <li className="active">
                            <IctLink
                              activeClassName="active"
                              href={menuItem.link}
                              hrefCustom={menuItem.custom_active_link}
                            >
                              <a onClick={handleClose}>{menuItem.text}</a>
                            </IctLink>
                          </li>
                        </ul>
                      ))}
                  </>
                </Offcanvas.Body>
                <Button
                  className={
                    (router.locale === 'en' ? 'mn' : 'en',
                    'mp-header-language-canvas')
                  }
                  onClick={toggleLang}
                >
                  <p>{router.locale === 'en' ? 'Mongolian' : 'English'}</p>
                </Button>
                <Link href="#" onClick={setLogout}>
                  <span
                    className={
                      (router.locale === 'en' ? 'mn' : 'en', 'mp-menu-button')
                    }
                    onClick={setLogout}
                  >
                    <p>{router.locale === 'en' ? 'Exit' : 'Гарах'}</p>
                  </span>
                </Link>
              </Navbar.Offcanvas>
            ) : (
              // nevtreegui ued haruulah  burger menu
              <Navbar.Offcanvas
                className="custom-canvas-top"
                onClick={handleClose}
                show={show}
                placement="top"
              >
                {menu &&
                  menu.main &&
                  menu.main.menu &&
                  menu.main.menu.map((menuItem, i) => (
                    <ul key={i}>
                      <li className="active">
                        <IctLink
                          activeClassName="active"
                          href={menuItem.link}
                          hrefCustom={menuItem.custom_active_link}
                        >
                          <a onClick={handleClose}>{menuItem.text}</a>
                        </IctLink>
                      </li>
                    </ul>
                  ))}
                <Button
                  className={
                    (router.locale === 'en' ? 'mn' : 'en',
                    'mp-header-language-canvas')
                  }
                  onClick={toggleLang}
                >
                  <p>{router.locale === 'en' ? 'Mongolian' : 'English'}</p>
                </Button>
                <Link href="#" onClick={setLogout}>
                  <span
                    className={
                      (router.locale === 'en' ? 'mn' : 'en', 'mp-menu-button')
                    }
                    onClick={setLogout}
                  >
                    <p>{router.locale === 'en' ? 'Exit' : 'Нэвтрэх'}</p>
                  </span>
                </Link>
              </Navbar.Offcanvas>
            )}
            <div className="mp-header-button-right">
              <div>
                {/* huraagdaagui ued haruulah en button userinfo */}
                <Button
                  className={
                    (router.locale === 'en' ? 'mn' : 'en', 'mp-header-language')
                  }
                  onClick={toggleLang}
                >
                  <p>{router.locale === 'en' ? 'mn' : 'en'}</p>
                </Button>
                {userShortInfo?.userId ? (
                  <>
                    <Dropdown className="mp-dropdown-web">
                      <Dropdown.Toggle>
                        <div className="Topbar">
                          <div className="top-right-side">
                            <div className="inner">
                              <div className="avatar">
                                <img
                                  className="profileImgSmall"
                                  src={userShortInfo?.image}
                                />
                                <div className="user-icon-verify">
                                  <img src="/user-icon-verify.svg" />
                                </div>
                              </div>
                              <div className="info">
                                <span className="people-name">
                                  {displayName}
                                </span>
                                <span className="people-phone-number">
                                  {userShortInfo?.phone}
                                </span>
                              </div>
                              <div className="web-img-canvas">
                                <img src="/web-dropdown.svg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="/app/dashboard/">
                          <img src="/sidebar-icon-category.svg" />
                          Удирдлага
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/account/">
                          <img src="/sidebar-icon-wallet.svg" />
                          Данс
                        </Dropdown.Item>
                        {/* <Dropdown.Item href="/app/dashboard/credit/">
                                                    <img src="/sidebar-icon-card.svg" />
                                                    Монпэй зээл
                                                </Dropdown.Item> */}
                        <Dropdown.Item href="/app/dashboard/payment/">
                          <img src="/sidebar-icon-payment.svg" />
                          Төлбөр төлөлт
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/transaction-history/">
                          <img src="/sidebar-icon-history-def.svg" />
                          Гүйлгээний түүх
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/profile">
                          <img src="/sidebar-icon-setting.svg" />
                          Тохиргоо
                        </Dropdown.Item>
                        <Dropdown.Item onClick={setLogout}>
                          <img src="/icon-logout-gray.svg" />
                          Гарах
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* huraagdsn ued haruulah user canvas */}
                    <Button
                      variant="primary"
                      onClick={handleShowUser}
                      className="web-button-offcanvas"
                      aria-label="Close"
                    >
                      <div className="Topbar">
                        <div className="top-right-side">
                          <div className="inner">
                            <div className="avatar">
                              <img
                                className="profileImgSmall"
                                src={userShortInfo?.image}
                              />
                              <div className="user-icon-verify">
                                <img src="/user-icon-verify.svg" />
                              </div>
                            </div>
                            <div className="info">
                              <span className="people-name">{displayName}</span>
                              <span className="people-phone-number">
                                {userShortInfo?.phone}
                              </span>
                            </div>
                            <div className="web-img-canvas">
                              <img src="/web-dropdown.svg" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Button>
                    {/* offcanvas show nevters ued haruulah info*/}
                    <Offcanvas
                      show={showUser}
                      onHide={handleCloseUser}
                      className="offcanvas-web"
                      placement="end"
                      id="offcanvasUserMain"
                    >
                      <Offcanvas.Body className="mp-canvas-body-web">
                        <Dropdown.Item href="/app/dashboard/">
                          <img src="/sidebar-icon-category.svg" />
                          Удирдлага
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/account/">
                          <img src="/sidebar-icon-wallet.svg" />
                          Данс
                        </Dropdown.Item>
                        {/* <Dropdown.Item href="/app/dashboard/credit/">
                          <img src="/sidebar-icon-card.svg" />
                          Монпэй зээл
                        </Dropdown.Item> */}
                        <Dropdown.Item href="/app/dashboard/payment/">
                          <img src="/sidebar-icon-payment.svg" />
                          Төлбөр төлөлт
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/transaction-history/">
                          <img src="/sidebar-icon-history-def.svg" />
                          Гүйлгээний түүх
                        </Dropdown.Item>
                        <Dropdown.Item href="/app/dashboard/profile">
                          <img src="/sidebar-icon-setting.svg" />
                          Тохиргоо
                        </Dropdown.Item>
                        <Dropdown.Item onClick={setLogout}>
                          <img src="/icon-logout-gray.svg" />
                          Гарах
                        </Dropdown.Item>
                      </Offcanvas.Body>
                    </Offcanvas>
                  </>
                ) : (
                  <Link href="/login">
                    <Button className="mp-header-login-button">
                      <p>Нэвтрэх</p>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
