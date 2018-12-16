import React from 'react'
import styled from 'styled-components'

import Sidebar from './sidebar'

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
  color: #7e7e7e;
`

export default ({ children }) => (
  <Container>
    <Sidebar />
    <Content>{children}</Content>
  </Container>
)
