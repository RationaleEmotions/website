import React from 'react'
import styled from 'styled-components'

import Layout from '../components/layout'

const StyledHref = styled.a`
  text-decoration: none;
  color: inherit;
  font-style: italic;
`

export default () => (
  <Layout>
    <p>
      BY DAY : Work on solving automation related problems at work, building
      test frameworks etc.,
    </p>
    <p>
      BY NIGHT: I contribute to the{' '}
      <StyledHref
        href="https://github.com/cbeust/testng"
        target="_blank"
        rel="noopener noreferrer"
      >
        TestNG
      </StyledHref>{' '}
      codebase, help users on the Google forums for both
      <StyledHref
        href="https://groups.google.com/forum/#!forum/testng-users"
        target="_blank"
        rel="noopener noreferrer"
      >
        TestNG
      </StyledHref>{' '}
      and{' '}
      <StyledHref
        href="https://groups.google.com/forum/#!forum/selenium-users"
        target="_blank"
        rel="noopener noreferrer"
      >
        Selenium
      </StyledHref>{' '}
      and also occasionally to the{' '}
      <StyledHref
        href="https://github.com/seleniumhq/selenium"
        target="_blank"
        rel="noopener noreferrer"
      >
        Selenium codebase
      </StyledHref>
    </p>
    <p>
      Always up for a good conversation with friends or with acquaintances. Love
      talking about technology. Sometimes I blog at{' '}
      <StyledHref
        href="http://wakened-cognition.blogspot.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wakened Cognition
      </StyledHref>{' '}
      wherein I share my personal experiences, crazy emotions and what not and
      at other times I try and document my technical learnings as blogs at here.
    </p>
  </Layout>
)
