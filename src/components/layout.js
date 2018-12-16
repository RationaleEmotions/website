import React from 'react'
import styled from 'styled-components'

import LogoImage from '../images/logo.jpeg'

const Container = styled.div`
  display: flex;
  height: 100vh;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
  padding: 20px;
  color: #8e8e8e;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  background-color: #333;
  color: #ebebeb;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  border-radius: 50%;
  overflow: hidden;
  width: 152px;
  height: 152px;
`

export default ({ children }) => (
  <Container>
    <Sidebar>
      <h1>Rationale Emotions</h1>
      <Logo src={LogoImage} />
      <h5>Krishnan Mahadevan</h5>
    </Sidebar>
    <Content>{children}</Content>
  </Container>
)
