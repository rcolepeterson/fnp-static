import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      position: 'fixed',
      width: "100%",
      backgroundColor: '#193442',
      height: 42,
      top: 0,
      boxSizing: 'border-box',
      borderBottom: '3px solid #393939',
      zIndex: 3
    }}
  >
    <div
      style={{
        marginLeft: 10,
        marginTop: 10,
        maxWidth: 960
      }}
    >
      <h4 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h4>
    </div>
  </header >
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
