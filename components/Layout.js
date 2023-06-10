import React from 'react';
import Head from 'next/head';

const Layout = ({ title = '', slug = '', children, yoastMeta }) => (
    <>
        <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta charSet="utf-8" />
            <title>{title}</title>
            {/* <link rel="icon" href="android-icon-36x36.png" />
            <link rel="icon" href="android-icon-48x48.png" />
            <link rel="icon" href="android-icon-72x72.png" />
            <link rel="icon" href="android-icon-96x96.png" />
            <link rel="icon" href="android-icon-144x144.png" />
            <link rel="icon" href="android-icon-192x192.png" />
            <link rel="icon" href="apple-icon-57x57.png" />
            <link rel="icon" href="apple-icon-60x60.png" />
            <link rel="icon" href="apple-icon-72x72.png" />
            <link rel="icon" href="apple-icon-76x76.png" />
            <link rel="icon" href="apple-icon-114x114.png" />
            <link rel="icon" href="apple-icon-120x120.png" />
            <link rel="icon" href="apple-icon-144x144.png" />
            <link rel="icon" href="apple-icon-152x152.png" />
            <link rel="icon" href="apple-icon-180x180.png" />
            <link rel="icon" href="apple-icon-precomposed.png" />
            <link rel="icon" href="apple-icon.png" /> */}
            <link rel="icon" href="/Fav-Icon.png-16x16.png" />
            <link rel="icon" href="/Fav-Icon.png-32x32.png" />
            <link rel="icon" href="/Fav-Icon.png-96x96.png" />
            <link rel="icon" href="/Fav-Icon.ico" />
            {/* <link rel="icon" href="ms-icon-70x70.png" />
            <link rel="icon" href="ms-icon-144x144.png" />
            <link rel="icon" href="ms-icon-150x150.png" />
            <link rel="icon" href="ms-icon-310x310.png" /> */}
            {/* START - SEO section by ICT Group */}
            {yoastMeta &&
                yoastMeta.map((meta_value, i) => (
                    <meta
                        key={i}
                        name={meta_value.name || meta_value.property}
                        content={meta_value.content}
                    />
                ))}
            {/* END   - SEO section by ICT Group */}
        </Head>
        <div className={slug ? slug : null}>{children}</div>
    </>
);
export default Layout;
