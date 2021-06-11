import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import initView from './view.js';
import hundler from './formHandler.js';

export default () => {
  const state = {
    form: {
      status: 'processed',
      field: {
        url: '',
      },
      valid: '',
      errors: {},
    },
    parserErrors: '',
    feedsUrls: [],
    posts: [],
    feeds: [],
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button[type="submit"]'),
    feedContainer: document.querySelector('.feeds'),
    topicsContainer: document.querySelector('.topics'),
    modalEl: document.querySelector('.modal'),
    feedbackContainer: document.querySelector('#feedback'),
    feedbackForUpdateErrors: document.querySelector('.update-feedback'),
  };

  const watchedState = initView(state, elements);
  elements.form.addEventListener('submit', hundler(watchedState));
};
