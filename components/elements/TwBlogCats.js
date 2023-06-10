import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col, Pagination, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/router';
import { useIct } from 'hooks/use-ict';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
//News байгууллага дуудаж буй хэсэг
const TwBlogCats = (props) => {
    const $atts = props.atts;
    //Нийт news-г авч буй useState
    const [news, setNews] = useState([]);

    //Нийт newsFiltered-г авч буй useState
    const [newsFiltered, setNewsFiltered] = useState([]);
    const [newsTotal, setNewsTotal] = useState([]);
    const [newsCategories, setNewsCategories] = useState([]);
    const [filter, setFilter] = useState(0);
    const { t, lang } = useTranslation('common');
    async function fetchData() {
        const respNews = await axios('/api/post/get-news');

        if (respNews?.data?.result) {
            setNews(respNews.data.result);
            setNewsFiltered(respNews.data.result);
        }

        if (respNews?.data?.total) {
            setNewsTotal(respNews.data.total);
        }
    }

    async function getCategories() {
        const respCats = await axios('/api/post/get-category');

        if (respCats?.data?.length) {
            setNewsCategories(respCats.data);
        }
    }

    useEffect(() => {
        /*News */
        fetchData();
        getCategories();
    }, []);

    const newsPerPage = 16;
    const [pageNumber, setPageNumber] = useState(0);
    const [pagesVisited, setPagesVisited] = useState(0);
    useEffect(async () => {
        /* News */
        setPagesVisited(pageNumber * newsPerPage);
    }, [pageNumber]);

    const [pageCount, setPageCount] = useState(0);

    //Filter news code
    useEffect(async () => {
        /* News */
        setPageNumber(0);
        setNewsFiltered((prev) =>
            news.filter(
                (newsItem) =>
                    (!filter || filter === newsItem.newsCatId) && newsItem
            )
        );
    }, [filter]);

    useEffect(async () => {
        setPageCount(Math.ceil(newsFiltered.length / newsPerPage));
    }, [newsFiltered]);

    const [isActive, setActive] = useState(false);
    const [activeId, setActiveId] = useState();

    return (
        <RenderElementWrapper atts={$atts}>
            <Row className="category mp-category-line">
                <Col md={3} lg={3} sm={3} className="mp-latest-post">
                    <div className="lates-posts">
                        <h3 className="title"> {t('lastPublished')}</h3>
                    </div>
                </Col>
                <Col md={2}></Col>
                <Col className="cats">
                    {newsCategories && (
                        <ul>
                            <li
                                type="button"
                                // className="cat-item active"
                                className={activeId ? 'Inactive' : 'active-cat'}
                                // onClick={toggleClass}
                                data-toggle="tab"
                                onClick={() => [setFilter(0), setActiveId('')]}
                            >
                                {t('allCats')}
                            </li>
                            {newsCategories.map((cat, i) => {
                                return (
                                    <li
                                        key={i}
                                        type="button"
                                        // className="cat-item active"
                                        className={
                                            activeId === cat.id
                                                ? 'active-cat'
                                                : 'Inactive'
                                        }
                                        // onClick={toggleClass}
                                        data-toggle="tab"
                                        onClick={() => [
                                            setFilter(cat.id),
                                            setActiveId(cat.id),
                                        ]}
                                    >
                                        {cat.nameMn}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Col>
            </Row>
            <Row>
                {newsFiltered
                    .slice(pagesVisited, pagesVisited + newsPerPage)
                    .map((item, i) => {
                        return (
                            <Col className="post" md={3} key={i}>
                                <Link
                                    href={`/post/${item.newsId}`}
                                    className="post-title"
                                >
                                    <a target="_blank">
                                        <div className="post-content">
                                            <img src={item.contentImg} />

                                            <div className="item">
                                                <span className="post-date">
                                                    {item.createDateUI}
                                                </span>
                                                <span>
                                                    {newsCategories &&
                                                        newsCategories.map(
                                                            (itemCat, i) => {
                                                                if (
                                                                    item.newsCatId ===
                                                                    itemCat.id
                                                                ) {
                                                                    return (
                                                                        <div>
                                                                            <span
                                                                                className="cats"
                                                                                key={
                                                                                    i
                                                                                }
                                                                            >
                                                                                {
                                                                                    itemCat.nameMn
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                        )}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/post/${item.newsId}`}
                                                className="post-title"
                                            >
                                                <a target="_blank">
                                                    {item.subject}
                                                </a>
                                            </Link>
                                        </div>
                                    </a>
                                </Link>
                            </Col>
                        );
                    })}
            </Row>
            {pageCount > 1 && (
                <Row className="blog-paginate">
                    {/* {news && news( */}
                    <nav className="tw-element tw-pagination">
                        <ReactPaginate
                            breakLabel=" "
                            previousLabel=""
                            nextLabel=""
                            initialPage={pageNumber}
                            forcePage={pageNumber}
                            pageCount={pageCount}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={2}
                            renderOnZeroPageCount={null}
                            containerClassName="pagination justify-content-center"
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
                            onPageChange={({ selected }) => {
                                setPageNumber(selected);
                            }}
                        />
                    </nav>
                    {/* )} */}
                </Row>
            )}
        </RenderElementWrapper>
    );
};

export default TwBlogCats;
