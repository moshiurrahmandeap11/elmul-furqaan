import React from 'react';
import Hero from './Hero/Hero';
import Blogs from './BlogsLatest/BlogsLatest';
import BlogsLatest from './BlogsLatest/BlogsLatest';
import VideosLatest from './VideosLatest/VideosLatest';
import QNA from './QNA/QNA';
import NewsLetter from './NewsLetter/NewsLetter';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <BlogsLatest></BlogsLatest>
            <VideosLatest></VideosLatest>
            <QNA></QNA>
            <NewsLetter></NewsLetter>
        </div>
    );
};

export default Home;