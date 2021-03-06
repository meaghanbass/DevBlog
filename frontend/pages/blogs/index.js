import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from "next/router";
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import { API, DOMAIN, APP_NAME } from "../../config";
import PreviewCardLg from "../../components/Blog/PreviewCardLg";

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router }) => {
    const head = () => (
        <Head>
            <title>Programming Blogs | {APP_NAME}</title>
            <meta name="description" content="Programming blogs and tutorials." />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta property="og:title" content={`Latest web development tutorials | ${APP_NAME}`} />
            <meta property="og:description" content="Programming blogs and tutorials." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content="/images/seoblog.png" />
            <meta property="og:image:secure_url" content="/images/seoblog.png" />
            <meta property="og:image:type" content="image/png" />
            {/* <meta property="og:app_id" content={`${APP_NAME}`} /> */}
        </Head>
    );

    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit;
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })
    };

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (<button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More</button>)
        )
    };
    
    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <article key={i}>
                    <PreviewCardLg blog={blog} />
                </article>
            );
        });
    };

    const showAllCategories = () => {
        return categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-success mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ))
    };

    const showAllTags = () => {
        return tags.map((t, i) => (
            <Link href={`/tags/${t.slug}`} key={i}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{t.name}</a>
            </Link>
        ))
    };

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => (
            <article key={i}>
                <PreviewCardLg blog={blog} />
            </article>
        ))
    }

    return (
        <>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">Blogs</h1>
                            </div>
                            <section>
                                {showAllCategories()}
                                {showAllTags()}
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">
                        {showAllBlogs()}
                    </div>
                    <div className="container-fluid">
                        {showLoadedBlogs()}
                    </div>
                    <div className="text-center pt-5 pb-5">
                        {loadMoreButton()}
                    </div>
                </main>
            </Layout>
        </>
    );
};

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogSkip: skip
            };
        }
    });
};

export default withRouter(Blogs);