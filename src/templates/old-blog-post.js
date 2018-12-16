import React from 'react'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'

import Sidebar from '../components/sidebar'
import { PostWrapper } from '../components/postwrapper'
import LogoImage from '../images/logo.jpeg'

const WrapperContainer = styled.div`
  display: flex;
  height: 100vh;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #eef2f8;
`

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: scroll;
`

const Logo = styled.img`
  border-radius: 50%;
  overflow: hidden;
  width: 30px;
  height: 30px;
  margin: 8px;
`

const MenuWrapper = styled.div`
  margin: 8px;
`

const MenuIcon = styled.div`
  width: 30px;
  height: 3px;
  background-color: #8e8e8e;
  margin: 5px 0;
`

const SiteTitle = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: #8e8e8e;
  margin: 8px;
`

export default ({ data }) => {
  const post = data.markdownRemark

  return (
    <WrapperContainer>
      <Sidebar />
      <Wrapper>
        <Header>
          <MenuWrapper>
            <MenuIcon />
            <MenuIcon />
            <MenuIcon />
          </MenuWrapper>
          <SiteTitle>
            <Link to="/">Rationale Emotions</Link>
          </SiteTitle>
          <Logo src={LogoImage} />
        </Header>
        <Content>
          <PostWrapper>
            <span className="datetime">{post.frontmatter.date}</span>
            <h1>{post.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </PostWrapper>
        </Content>
      </Wrapper>
    </WrapperContainer>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
