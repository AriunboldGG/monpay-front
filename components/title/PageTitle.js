import React, { useState } from 'react';
import {
    Row,
    Col,
    Container,
    Placeholder,
    FormControl,
    InputGroup,
    Input,
} from 'react-bootstrap';
import IctBreadCrumb from 'components/IctBreadCrumb';
import { useIct } from 'hooks/use-ict';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

function PageTitle(props) {
    const { acf, title, breadcrumbList } = props;
    const { t } = useTranslation('common');
    const { ictCtx, setIctCtx } = useIct();
    const router = useRouter();
    // let $pageTitleGrid = acf.page_title_grid ? acf.page_title_grid : '5';

    const [searchText, setSearchText] = useState('');
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        let filterurl = '';
        if (ictCtx && ictCtx.filters && ictCtx.filters.filter_partner_cat) {
            filterurl += '/partner_cat/' + ictCtx.filters.filter_partner_cat;
        }
        if (searchText) {
            filterurl += '/search/' + searchText;
        }
        router.push(
            process.env.NEXT_PUBLIC_SITE_URL +
                '/' +
                ictCtx.path +
                (filterurl ? '/filter' + filterurl : '')
        );
    };
    return (
        <>
            {acf.page_title === 'disable' &&
                acf.page_title_breadcrumb === 'enable' && (
                    <section
                        className={`tw-row pt-0 pb-0 tw-page-title overflow-hidden d-flex align-items-center tw-page-title-only-breadcrumb`}
                    >
                        <Container>
                            <Row>
                                <Col className="d-flex align-items-center">
                                    <div className="tw-page-title-content">
                                        {acf.page_title_breadcrumb &&
                                            acf.page_title_breadcrumb ===
                                                'enable' &&
                                            breadcrumbList && (
                                                <IctBreadCrumb
                                                    breadcrumbList={
                                                        breadcrumbList
                                                    }
                                                />
                                            )}
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                )}
            {acf.page_title === 'enable' && (
                <section className="tw-partner-single-page-title">
                    <Container>
                        <Row>
                            {acf.page_title_breadcrumb &&
                                acf.page_title_breadcrumb === 'enable' &&
                                breadcrumbList &&
                                acf.page_title_right_side_image_type ===
                                    'no' && (
                                    <Row>
                                        <Col>
                                            <div className="tw-page-title-content">
                                                <IctBreadCrumb
                                                    breadcrumbList={
                                                        breadcrumbList
                                                    }
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            <Col className="p-0" md={8} lg={8}>
                                <div className="tw-page-title-content ">
                                    <div className="tw-page-title-content-inner">
                                        {title && (
                                            <h4 className="tw-page-title-text">
                                                {title}
                                            </h4>
                                        )}
                                    </div>
                                </div>
                            </Col>

                            {acf?.page_search && acf.page_search === 'enable' && (
                                <Col md={4} lg={8} sm={8} className="mp-search">
                                    <form onSubmit={handleSearchSubmit}>
                                        <InputGroup>
                                            <div className="search-icon">
                                                <InputGroup.Text></InputGroup.Text>
                                            </div>

                                            <FormControl
                                                type="search"
                                                placeholder={t('search')}
                                                // onChange="hideIcon(this)
                                                value={searchText}
                                                onChange={(e) => {
                                                    setSearchText(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </InputGroup>
                                    </form>
                                </Col>
                            )}
                        </Row>
                    </Container>
                </section>
            )}
        </>
    );
}
export default PageTitle;
