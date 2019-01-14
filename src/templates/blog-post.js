import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import Layout from '../components/layout'
import PostTags from '../components/postTags'
import { PostWrapper } from '../components/postwrapper'

const StyledTag = styled.span`
  font-style: italic;
`

export default ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <PostWrapper>
        <span className="datetime">{post.frontmatter.date}</span>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <p>
          For any queries, log an issue{' '}
          <a
            href="https://github.com/RationaleEmotions/website/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
        <hr />
        <p>
          <StyledTag>Tags</StyledTag>: <PostTags tags={post.frontmatter.tags} />
        </p>
      </PostWrapper>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
        tags
      }
    }
  }
`
