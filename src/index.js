import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const refs = {
  searchEl: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

const clearMarkup = (ref) => (ref.innerHTML = '');

const inputHandler = (e) => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then((data) => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch((err) => {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      if (err.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure('Something went wrong. Please try again later.');
      }
    });
};

const renderMarkup = (data) => {
  if (data.length === 1) {
    clearMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(data[0]);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearMarkup(refs.countryInfo);
    const markupList = createListMarkup(data);
    refs.countryList.innerHTML = markupList;
  }
};

const createListMarkup = (data) => {
  return data
    .map(
      ({ name, flags }) =>
        `<li>
          <img src="${flags.svg}" alt="${name.official}" width="60" height="40">
          <p>${name.official}</p>
        </li>`
    )
    .join('');
};

const createInfoMarkup = ({ name, capital, population, flags, languages }) => {
  return `
    <img src="${flags.svg}" alt="${name.official}" width="200" height="100">
    <h1>${name.official}</h1>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages).join(', ')}</p>
  `;
};

refs.searchEl.addEventListener('input', debounce(inputHandler, 300));

