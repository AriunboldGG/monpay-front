import React from "react";
import axios from 'axios'

const Sitemap = () => { return null }

export const getServerSideProps = async ( { res } ) => {
    const postTypes = [
        'page',
    ]

    let staticPages = []

    await Promise.all( postTypes.map( async postType => {
            let api =  'wp/v2/' + postType + 's/'
        
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_API_URL + api,
                    { params: { lang: 'mn' } }
                )
                if (response && response?.data ) {
                    response.data.map( item => {
                        if ( item?.link ) {
                            staticPages.push(
                                `<url>
                                    <loc>${process.env.NEXT_PUBLIC_SITE_URL+item.link}</loc>
                                    <lastmod>${new Date().toISOString()}</lastmod>
                                    <changefreq>monthly</changefreq>
                                    <priority>1.0</priority>
                                </url>`
                            )
                        }
                    } )
                }
            } catch (err) {}
    }) )

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPages.join("")}</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default Sitemap