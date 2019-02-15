import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import SiteMetadata from '../components/site-metadata'
import Tile from '../components/tile/Tile'

export default ({ pageContext: { allArticles } }) => {
  // console.log('article_clean_title', allArticles);
  // const baseURL = 'https://cdn-prototype.microsites.partnersite.mobi'
  return (
    <Layout>
      <SiteMetadata pathname={`articles`} />
      {/* <Tile article={allArticles[0]} /> */}
      <div style={{ margin: '1rem auto' }}>
        <ul style={{ padding: 0, margin: 0 }}>
          {allArticles.map((article, i) => (
            <li
              key={article.article_digest}
              style={{
                padding: '5px',
                textAlign: 'center',
                listStyle: 'none',
                width: '49%',
                verticalAlign: 'top',
                display: 'inline-block',
              }}
            >
              <Tile key={i} article={article} />
            </li>
            // <li
            //   key={article.article_digest}
            //   style={{
            //     padding: '5px',
            //     textAlign: 'center',
            //     listStyle: 'none',
            //     width: '49%',
            //     verticalAlign: 'top',
            //     display: 'inline-block',
            //   }}
            // >
            //   <Link to={`/articles/${article.article_clean_title}`}>
            //     <img
            //       style={{ marginBottom: 0 }}
            //       src={`${baseURL}${article.article_image_url}`}
            //     />
            //     <p
            //       style={{
            //         fontSize: '14px',
            //         marginTop: 0,
            //         textAlign: 'left',
            //         textDecoration: 'none',
            //         color: 'black',
            //         fontFamily: 'sans-serif',
            //       }}
            //     >
            //       {article.article_title}
            //     </p>
            //   </Link>
            // </li>
          ))}
        </ul>
        <Link to={`/`}>
          <p>Home</p>
        </Link>
      </div>
    </Layout>
  )
}
