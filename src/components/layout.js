import React from 'react'
import { Helmet } from 'react-helmet'
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
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Rationale Emotions - A blog by Krishnan Mahadevan"
      />
      <title>Rationale Emotions</title>
    </Helmet>
    <Container>
      <Sidebar />
      <Content>{children}</Content>
    </Container>
  </>
)
