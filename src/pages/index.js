import React from 'react'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'

import { rhythm } from '../utils/typography'
import Layout from '../components/layout'

const PostTitle = styled.h3`
  margin-bottom: ${rhythm(1 / 4)};
`

const PostDate = styled.span`
  color: #8e8e8e;
  font-size: 14px;
`

const PostLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

export default ({ data }) => (
  <Layout>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <div key={node.id}>
        <PostDate>{node.frontmatter.date}</PostDate>
        <PostLink to={node.fields.slug}>
          <PostTitle>{node.frontmatter.title} </PostTitle>
        </PostLink>
        <p>{node.excerpt}</p>
      </div>
    ))}
  </Layout>
)

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
        }
      }
    }
  }
`
