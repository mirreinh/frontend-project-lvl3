import onChange from 'on-change';

const renderValidationErrors = (elements, errors, state) => {
  const { input, feedbackContainer } = elements;
  feedbackContainer.innerHTML = '';
  if (state.form.valid) {
    return;
  }
  feedbackContainer.innerHTML = '';
  input.classList.add('is-invalid');
  const divEl = document.createElement('div');
  divEl.classList.add('feedback', 'text-danger');
  divEl.textContent = errors;
  feedbackContainer.append(divEl);
};

const renderParserErrors = (elements, errors) => {
  const { feedbackContainer, input } = elements;
  feedbackContainer.innerHTML = '';
  input.classList.add('is-invalid');
  const divEl = document.createElement('div');
  divEl.classList.add('feedback', 'text-danger');
  divEl.textContent = errors;
  feedbackContainer.append(divEl);
};

const renderFeeds = (elements, feeds) => {
  const { feedContainer } = elements;
  const h2El = document.createElement('h2');
  h2El.textContent = 'Фиды';
  feedContainer.append(h2El);
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group');
  feeds.forEach(({ title, description }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    const h3El = document.createElement('h3');
    h3El.textContent = title;
    liEl.append(h3El);
    const pEl = document.createElement('p');
    pEl.textContent = description;
    liEl.append(pEl);
    ulEl.append(liEl);
  });
  feedContainer.append(ulEl);
};

const renderPosts = (elements, posts) => {
  const { topicsContainer } = elements;
  const h2El = document.createElement('h2');
  h2El.textContent = 'Посты';
  topicsContainer.append(h2El);
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group');
  posts.forEach(({ postTitle, postDescription, postLink }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between');
    const aEl = document.createElement('a');
    aEl.id = 1;
    aEl.href = postLink;
    aEl.target = '_blank';
    aEl.classList.add('fw-normal');
    aEl.textContent = postTitle;
    liEl.append(aEl);
    ulEl.append(liEl);
  });
  topicsContainer.append(ulEl);
};

const renderSuccessFeedback = (feedbackContainer, input) => {
  feedbackContainer.innerHTML = '';
  input.classList.remove('is-invalid');
  feedbackContainer.classList.add('feedback', 'text-success');
  feedbackContainer.textContent = 'RSS успешно загружен';
};

const renderForm = (elements, status) => {
  const {
    form, feedbackContainer, input, button,
  } = elements;
  console.log(status);
  switch (status) {
    case 'processed':
      feedbackContainer.innerHTML = '';
      break;
    case 'sending':
      button.disabled = true;
      break;
    case 'failed':
      button.disabled = false;
      break;
    case 'finished':
      renderSuccessFeedback(feedbackContainer, input);
      button.disabled = false;
      form.reset();
      break;
    default:
      break;
  }
};

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.status':
        renderForm(elements, value);
        break;
      case 'form.errors':
        renderValidationErrors(elements, value, watchedState);
        break;
      case 'posts':
        renderPosts(elements, value);
        break;
      case 'feeds':
        renderFeeds(elements, value);
        break;
      case 'parserErrors':
        renderParserErrors(elements, value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
