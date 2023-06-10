// import React, { Component } from "react"
import Post from "components/postTypes/Post";
import Partner from "components/postTypes/Partner";

/**
 * Render Post Types
 */

const RenderPostType = (props) => {
    const { post_type } = props;
    const post_types = {
        post: Post,
        partner: Partner,
        // buy_tender: BuyTender,
    };
    if (post_types[post_type]) {
        const Comp = post_types[post_type];
        return <Comp {...props} />;
    }
    return <div>Not Registered Post Type</div>;
};

export default RenderPostType;
