import { Container, Row, Col } from 'react-bootstrap';
import Content from 'components/Content';
import { useIct } from 'hooks/use-ict';
import IctBreadCrumb from 'components/IctBreadCrumb';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from 'react-share';

const Post = (props) => {
    const { page, themeOption, post_type, header } = props;
    const { ictCtx, setIctCtx } = useIct();
    let sectionMain = [];
    if (page.content) {
        sectionMain.push(
            <Content
                key="post-content"
                id={page.id}
                themeOption={themeOption}
                content={page.content}
                acf={page.acf}
            />
        );
    }
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div className="news-single-post-title">
                            <IctBreadCrumb breadcrumbList={page.category} />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        {page.featured_image_thumbnail &&
                            page.title &&
                            page.current_time && (
                                <div key="key">
                                    <h3 className="tw-single-main-title">
                                        {page.title}
                                    </h3>
                                    <div className="tw-single-category">
                                        <span className="tw-publish-date">
                                            {page.current_time}
                                        </span>
                                        {page.category.map((cat, i) => (
                                            <span
                                                className="tw-single-cats"
                                                key={i}
                                            >
                                                {cat.name + '  ,'}
                                            </span>
                                        ))}
                                    </div>
                                    <img src={page.featured_image_thumbnail} />
                                    <div className="tw-single-container">
                                        {page.content && (
                                            <div
                                                className="content"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        '<p>' +
                                                        page.content +
                                                        '</p>',
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                            )}
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        {ictCtx && ictCtx.path && (
                            <div className="entry-share">
                                <div className="entry-share-medee">
                                    <span className="entry-share-medee-span">
                                        Мэдээг бусдадтай хуваалцах
                                    </span>
                                </div>
                                <div className="entry-share-medee-icons">
                                    <span className="entry-share-item-share-facebook">
                                        <FacebookShareButton
                                            url={
                                                process.env
                                                    .NEXT_PUBLIC_SITE_URL +
                                                '/' +
                                                ictCtx.path
                                            }
                                            className="entry-share-item-share-facebook"
                                        >
                                            <img src="/fbicon-facebook.svg" />
                                        </FacebookShareButton>
                                    </span>
                                    <span className="entry-share-item-share-linkedin">
                                        <LinkedinShareButton
                                            url={
                                                process.env
                                                    .NEXT_PUBLIC_SITE_URL +
                                                '/' +
                                                ictCtx.path
                                            }
                                            className="entry-share-item-share-linkedin"
                                        >
                                            <img src="/linkicon-linkedin.svg" />
                                        </LinkedinShareButton>
                                    </span>
                                    <span className="entry-share-item-share-twitter">
                                        <TwitterShareButton
                                            url={
                                                process.env
                                                    .NEXT_PUBLIC_SITE_URL +
                                                '/' +
                                                ictCtx.path
                                            }
                                            className="entry-share-item-share-twitter"
                                        >
                                            <img src="/twicon-twitter.svg" />
                                        </TwitterShareButton>
                                    </span>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Post;
