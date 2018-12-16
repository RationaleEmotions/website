import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { FaHome, FaUserSecret, FaLinkedin, FaGithub } from 'react-icons/fa'

import LogoImage from '../images/logo.jpeg'

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  background-color: #193549;
  color: #dcdcdc;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  border-radius: 50%;
  overflow: hidden;
  width: 152px;
  height: 152px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const StyledHref = styled.a`
  text-decoration: none;
  color: inherit;
`

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  div {
    margin: 10px;
  }
`

export default () => (
  <Sidebar>
    <StyledLink to="/">
      <h1>Rationale Emotions</h1>
    </StyledLink>
    <Logo src={LogoImage} />
    <h5>Krishnan Mahadevan</h5>
    <MenuWrapper>
      <div>
        <p>
          <StyledLink to="/">
            <FaHome /> Home
          </StyledLink>
        </p>
        <p>
          <StyledLink to="/">
            <FaUserSecret /> About
          </StyledLink>
        </p>
      </div>
      <div>
        <p>
          <StyledHref
            href="https://www.linkedin.com/in/krmahadevan/"
            target="_blank"
          >
            <FaLinkedin /> Linkedin
          </StyledHref>
        </p>
        <p>
          <StyledHref href="https://github.com/krmahadevan" target="_blank">
            <FaGithub /> Github
          </StyledHref>
        </p>
      </div>
    </MenuWrapper>
  </Sidebar>
)
