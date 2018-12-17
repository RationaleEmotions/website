import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import { rhythm } from '../utils/typography'

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

export default ({ data }) => {
  return (
    <>
      {data.map(({ node }) => {
        return (
          <div key={node.id}>
            <PostDate>{node.frontmatter.date}</PostDate>
            <PostLink to={node.fields.slug}>
              <PostTitle>{node.frontmatter.title} </PostTitle>
            </PostLink>
            <p>{node.excerpt}</p>
          </div>
        )
      })}
    </>
  )
}
