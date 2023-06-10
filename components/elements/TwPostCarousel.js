import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
//Wordpress-н TwBlogCarousel element-г харуулж буй хэсэг
const TwBlog = (props) => {
    const $content = props.content;
    const $atts = props.atts;
    const router = useRouter();
    const [newsHighlithed, setHighlited] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        /*News */
        async function fetchData() {
            const respNews = await axios('/api/post/get-news').then(
                async (resp) => {
                    if (resp.data.result) {
                        let tempArray = [];

                        //priority хамгийн багаас нь 100 хүртэл эрэмбэлэн харуулсан мөр код
                        await resp.data.result.map((item, i) => {
                            if (item.priority && item.priority <= 100) {
                                tempArray.push(item);
                            }
                        });

                        if (tempArray.length >= 4) {
                            setHighlited(tempArray.splice(0, 4));
                        }
                    }
                },
                (error) => {}
            );
        }

        fetchData();
    }, []);

    // useEffect(async () => {
    //     if (newsHighlithed) {
    //     }
    // }, [newsHighlithed]);

    // const handleChangePagination = (e) => {
    //     const newPage = e.selected ? parseInt(e.selected, 10) + 1 : 1;
    //     if (crrPage !== newPage) {
    //         router.push(
    //             process.env.NEXT_PUBLIC_SITE_URL +
    //                 '/' +
    //                 ictCtx.path +
    //                 (newPage > 1 ? '/paged/' + newPage : '')
    //         );
    //     }
    // };

    // const newsList = newsHighlithed.map((item, i) => {
    //     const priorityNews = parseInt(item.priority, 10) < parseInt(count, 10);
    // });

    // let count = 0;
    // let news = [];
    // while (count < newsList.length) {
    //     news += newsList[count];
    //     count++;
    // }
    return (
        <RenderElementWrapper atts={$atts}>
            {$content && (
                <>
                    {
                        <div className="tw-heading">
                            <h3 className="tw-heading-main-title">
                                {$atts.title}
                            </h3>
                            <a
                                className="tw-heading-link"
                                href={$atts.button_url}
                            >
                                {$atts.button_title}
                            </a>
                        </div>
                    }
                    <Row className="mp-newss">
                        {/* {$content.posts &&
                            $content.posts.map((item, i) => (
                                <Col md={3} key={i}>
                                    <div className="mp-news-content">
                                        {item.img && <img src={item.img} />}
                                        {item.publish_date && (
                                            <span>{item.publish_date}</span>
                                        )}
                                        {item.title && (
                                            <a href={item.id}>{item.title}</a>
                                        )}
                                    </div>
                                </Col>
                            ))} */}

                        {newsHighlithed?.map((news, i) => (
                            <Col md={3} lg={3} key={i}>
                                <div className="mp-news-content">
                                    {news.backgroundImg && (
                                        <img src={news.backgroundImg} />
                                    )}
                                    {news.createDateUI && (
                                        <span>{news.createDateUI}</span>
                                    )}
                                    {news.headline && (
                                        <a href={`/post/${news.newsId}`}>
                                            {news.headline}
                                        </a>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </RenderElementWrapper>
    );
};

export default TwBlog;
