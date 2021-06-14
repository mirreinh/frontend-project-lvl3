import _ from 'lodash';

export default (content, state) => {
  const parser = new DOMParser();
  const parserData = parser.parseFromString(content, 'text/xml');
  const checkRSS = parserData.querySelector('rss');
  if (!checkRSS) {
    throw new Error('Ресурс не содержит валидный RSS');
  }
  const title = parserData.querySelector('title').textContent;
  const description = parserData.querySelector('description').textContent;
  const posts = parserData.querySelectorAll('item');
  state.feeds.unshift({ title, description });

  const arrayPosts = Array.from(posts).map((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    const id = _.uniqueId();
    return {
      postTitle, postDescription, postLink, id,
    };
  });
  state.posts.unshift(...arrayPosts);
};
