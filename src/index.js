import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import ApiService from "./API-Service";

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMoreEl = document.querySelector('.load-more');

const picturesApiService = new ApiService();
let picturesNumber = null;

formEl.addEventListener('submit', onSearch);
buttonLoadMoreEl.addEventListener('click', onLoadMoreButton);

async function onSearch(event) {
  event.preventDefault();
    clearGallary();
    picturesApiService.resetPage();
    refreshPicturesNumber();
    picturesApiService.searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    if (picturesApiService.searchQuery === '') {
      Notiflix.Notify.info("Enter your request please!");
            return;
    }
  try {
    const pictures = await picturesApiService.fetchPictures();
      if (pictures.hits.length === 0) {
        hideButton();
        Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
        return;
      }
      Notiflix.Notify.info(`Hooray! We found ${pictures.totalHits} images.`);
      const markup = pictures.hits.map(picture =>
        createMarkup(picture)
      ).join('');
      addGallary(markup);
    const lightbox = new SimpleLightbox('.gallery a', {});
    event.target.reset(); 
    showButton();
  } catch {}
}
 async function onLoadMoreButton() {
  hideButton();
   try {
     picturesApiService.incrementPage();
     const pictures = await picturesApiService.fetchPictures();
     const totalHits = pictures.totalHits;
     incrementPictureNumber(pictures.hits);
     const markup = pictures.hits.map(picture =>
       createMarkup(picture)
     ).join('');
     addGallary(markup);
     const lightbox = new SimpleLightbox('.gallery a', {});
     lightbox.refresh();
       if (picturesNumber >= pictures.totalHits) {
       hideButton();
       Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
       return;
     }
     showButton();
   } catch { };
}

function createMarkup(picture) {
  return `<div class="photo-card">
  <a href="${picture.largeImageURL}"><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item"><b>Likes</b><br>${picture.likes}</p>
    <p class="info-item"><b>Views</b><br>${picture.views}</p>
    <p class="info-item"><b>Comments</b><br>${picture.comments}</p>
    <p class="info-item"><b>Downloads</b><br>${picture.downloads}</p>
  </div>
</div>`
}

function addGallary(markup) {
  galleryEl.insertAdjacentHTML("beforeend", markup);
}

function clearGallary() {
  galleryEl.innerHTML = '';
}

function showButton() {
buttonLoadMoreEl.classList.remove('is-hidden');
}

function hideButton() {
 buttonLoadMoreEl.classList.add('is-hidden');
}

function refreshPicturesNumber() {
  picturesNumber = picturesApiService.perPage;
}

function incrementPictureNumber(object) {
  picturesNumber += object.length;
}