# Rationale Emotions Site page

### Initial Setup

- Clone this repo
- Run `npm install`

### Writing blog post

- Write your blog post in markdown format under `src/blog-posts`. Refer the existing markdown template for title and date.
- Then run `npx gatsby develop` to load the page in your local machine. Usually loads in [http://localhost:8000](http://localhost:8000)
- If any image to be displayed as part of the blog article, make sure those present within `src/blog-posts` directory. In this repo, I've kept all the images under `src/blog-posts/images` directory.

### To publish on Now.sh

- Make sure you have `now` cli installed. Refer [here](https://zeit.co/now)
- From your cli, just run `now` to publish.
