import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import SiteMetadata from '../components/site-metadata'
import Tile from '../components/tile/Tile'
import HeroImage from '../components/heroImage';
import CallToAction from '../components/buttons/CtaButton';

export default ({ pageContext: { allArticles } }) => {
  return (
    <Layout>
      <SiteMetadata pathname={`articles`} />
      <HeroImage />

      <div style={{
        position: 'relative',
        top: 210,
        overflow: 'inherit',
        zIndex: 2,
        width: '100%'

      }}>
        <CallToAction />
        <ul style={{ backgroundColor: '#E5E5E5', padding: 0, margin: 0 }}>
          {allArticles.map((article, i) => (
            <li
              key={article.article_digest}
              style={{
                padding: '1px',
                textAlign: 'center',
                listStyle: 'none',
                width: '50%',
                verticalAlign: 'top',
                display: 'inline-block',
                margin: 0
              }}
            >
              <Tile key={i} article={article} />
            </li>
          ))}
        </ul>
        <Link to={`/`}>
          <p>Home</p>
        </Link>
      </div>
    </Layout>
  )
}
