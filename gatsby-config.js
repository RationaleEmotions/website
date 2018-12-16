module.exports = {
  siteMetadata: {
    title: 'Rationale Emotions'
  },
  plugins: [
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`
      }
    }
  ]
}
