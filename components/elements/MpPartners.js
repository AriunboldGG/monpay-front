import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col, Pagination, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/router';
import { useIct } from 'hooks/use-ict';
import { useEffect, useState } from 'react';
import { callGet } from 'lib/api/api';
import axios from 'axios';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

//Хамтрагч байгууллага дуудаж буй хэсэг
const MpPartners = (props) => {
    const { ictCtx, setIctCtx } = useIct();
    const $atts = props.atts;
    const crrPage = ictCtx.paged ? parseInt(ictCtx.paged, 10) : 1;
    const [partnerCats, setPartnerCats] = useState([]);
    //Нийт partners-г авч буй useState
    const [partners, setPartners] = useState([]);

    //Нийт partners-н тоог авч буй useState
    const [partnersTotal, setPartnersTotal] = useState([]);
    const [filterPartner, setFilterPartner] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const { t } = useTranslation('common');

    const partnersPerPage = 12;

    useEffect(async () => {
        /* Partner Categories */
        const respPartnerCats = await axios('/api/partner/categories');
        if (respPartnerCats?.data?.length) {
            setPartnerCats(respPartnerCats.data);
        }
    }, []);

    useEffect(async () => {
        let reqURL = `?limit=${partnersPerPage}&offset=${
            pageNumber * partnersPerPage
        }`;
        if (filterPartner) {
            reqURL += `&partnerCategoryId=${filterPartner}`;
        }
        /* Partners */
        const respPartners = await axios(`/api/partner/get-partner/${reqURL}`);
        if (respPartners?.data?.result && respPartners?.data?.total) {
            setPartners(respPartners.data.result);
            setPageCount(Math.ceil(respPartners.data.total / partnersPerPage));
        }
    }, [filterPartner, pageNumber]);

    //Нийт контентийг харуулах хэсэг
    const displayPartners = partners
        .filter((item) => {
            let $filter = true;

            if (ictCtx?.filters?.filter_search) {
                $filter =
                    item.partnerName
                        .toLowerCase()
                        .search(ictCtx.filters.filter_search.toLowerCase()) >=
                    0;
            }

            return $filter;
        })
        .map((item, i) => {
            return (
                <div className="post-content-partner p-0" key={i}>
                    {item.partnerImg &&
                        item.partnerName &&
                        item.partnerNameLat && (
                            <Link href={`/partner/${item.partnerId}`}>
                                <div className="post-content-partner-inner">
                                    <div className="content-image">
                                        <img src={item.partnerImg} />
                                    </div>
                                    <div className="post-title-partner">
                                        {item.partnerName}
                                    </div>
                                    <div className="post-desc-partner">
                                        {item.branchList &&
                                            item.branchList.map(
                                                (branchListItem, i) => (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: branchListItem.description,
                                                        }}
                                                        key={i}
                                                    />
                                                )
                                            )}
                                    </div>
                                    <div className="post-link-partner">
                                        <img src="/icon-arrow-rightt.svg" />
                                    </div>
                                </div>
                            </Link>
                        )}
                </div>
            );
        });
    return (
        <>
            <RenderElementWrapper atts={$atts}>
                <Row className="partner">
                    <Col md={3} sm={3}>
                        <div>
                            <div className="widget-title">
                                <span className="title-partner">
                                    {t('chiglel')}
                                </span>
                            </div>
                            <div className="widget-item">
                                {partnerCats.map((cat, i) => {
                                    const isChecked =
                                        parseInt(cat.partnerCategoryId, 10) ===
                                        parseInt(filterPartner, 10);
                                    return (
                                        <div
                                            className="cat-item"
                                            key={i}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFilterPartner(
                                                    isChecked
                                                        ? 0
                                                        : parseInt(
                                                              cat.partnerCategoryId,
                                                              10
                                                          )
                                                );
                                            }}
                                        >
                                            <Form>
                                                <div
                                                    className="form"
                                                    key={`inline-checkbox`}
                                                >
                                                    <span className="cat-count">
                                                        {cat.partnerCount}
                                                    </span>
                                                    <Form.Check
                                                        checked={isChecked}
                                                        inline
                                                        label={cat.categoryName}
                                                        name="group1"
                                                        type="checkbox"
                                                        id={`inline-checkbox-1`}
                                                    />
                                                </div>
                                            </Form>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                    <Col className="partner-border" md={1}></Col>
                    <Col md={8}>
                        <Row>
                            <Row>
                                <Col className="mp-partner-total">
                                    <div className="all-partners-title">
                                        <span>
                                            {t('total')} {partnersTotal}&nbsp;
                                            {t('partners')}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                            <Col md={12}>
                                <Row
                                    // style={{ justifyContent: 'space-around' }}
                                    className="mp-partner-item"
                                >
                                    {displayPartners}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {pageCount > 1 && (
                    <Row className="blog-paginate">
                        <Col md={3}></Col>
                        <Col className="partner-border" md={1}></Col>
                        <Col className="p-0" md={8}>
                            {partners && partners && (
                                <nav className="tw-element tw-pagination ">
                                    <ReactPaginate
                                        breakLabel=" "
                                        previousLabel=""
                                        nextLabel=""
                                        initialPage={crrPage - 1}
                                        forcePage={crrPage - 1}
                                        pageCount={pageCount}
                                        pageRangeDisplayed={2}
                                        marginPagesDisplayed={2}
                                        renderOnZeroPageCount={null}
                                        containerClassName="pagination justify-content-start"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item-prev"
                                        previousLinkClassName="page-link-prev"
                                        nextClassName="page-item-next"
                                        nextLinkClassName="page-link-next"
                                        breakClassName="page-item-break"
                                        breakLinkClassName="page-link-break"
                                        activeClassName="active"
                                        disabledClassName="disabled"
                                        // onPageChange={handleChangePagination}
                                        onPageChange={({ selected }) => {
                                            setPageNumber(selected);
                                        }}
                                    />
                                </nav>
                            )}
                        </Col>
                    </Row>
                )}
            </RenderElementWrapper>
        </>
    );
};

export default MpPartners;
