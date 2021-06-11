import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parserRSS from './parserRSS.js';

const validate = (field) => {
  const schema = yup.object().shape({
    url: yup.string().matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Ссылка должна быть валидным URL')
      .required(),
  });
  // const schema2 = yup.mixed().notOneOf(state.feedsUrls);
  try {
    schema.validateSync(field);
    return {};
  } catch (error) {
    return error.message;
  }
};

const updateValidationState = (state) => {
  const errors = validate(state.form.field);
  state.form.valid = _.isEqual(errors, {});
  state.form.errors = errors;
};

const proxyForResponse = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;

const getResponseUrl = (url, state) => {
  axios.get(proxyForResponse(url))
    .catch(() => {
      state.form.status = 'failed';
    })
    .then((response) => {
      const responseData = response.data.contents;
      parserRSS(responseData, state);
      state.form.status = 'finished';
    })
    .catch((error) => {
      state.form.status = 'failed';
      state.parserErrors = error.message;
      // if (error.response) {
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      // } else if (error.request) {
      //   console.log(error.request);
      // } else {
      //   console.log('Error', error.message);
      // }
    });
};

export default (state) => (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const url = formData.get('url').trim();
  state.form.field.url = url;
  state.feedsUrls.unshift(url);
  state.form.status = 'processed';
  updateValidationState(state);
  if (!state.form.valid) {
    return;
  }
  state.form.status = 'sending';
  state.parserErrors = '';
  getResponseUrl(url, state);
};
