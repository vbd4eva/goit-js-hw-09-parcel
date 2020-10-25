import galleryItems from './data/gallery-items.js';

const refs = {
  galleryContainer: document.querySelector('.js-gallery'),

  lightBoxContainer: document.querySelector('.js-lightbox'),
  lightBoxImg: document.querySelector('.lightbox__image'),
  lightBoxOverlay: document.querySelector('.lightbox__overlay'),
  lightBoxCloseButton: document.querySelector('[data-action="close-lightbox"]'),
};

let currentGalleryItemIndex;

refs.galleryContainer.innerHTML = makeGalleryItemsHtml(galleryItems);

refs.galleryContainer.addEventListener('click', onGalleryItemClick);

function makeGalleryItemsHtml(galleryItems) {
  return galleryItems.map(makeGalleryItemHtml).join('');
}

function makeGalleryItemHtml({ preview, original, description }) {
  return ` <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`;
}

function onGalleryItemClick(e) {
  e.preventDefault();

  if (!e.target.classList.contains('gallery__image')) return;

  setCurrentGalleryItemIndex(e.target.dataset.source);

  setLightBoxImg(currentGalleryItemIndex);

  openLightBox();

  refs.lightBoxCloseButton.addEventListener('click', closingLightBox, {
    once: true,
  });
  refs.lightBoxOverlay.addEventListener('click', closingLightBox, {
    once: true,
  });

  window.addEventListener('keydown', reactionForKeypressOnOpenLightBox);
}

function setLightBoxImg(currentGalleryItemIndex) {
  const currentGalleryItem = galleryItems[currentGalleryItemIndex];

  refs.lightBoxImg.setAttribute('src', currentGalleryItem.original);
  refs.lightBoxImg.setAttribute('alt', currentGalleryItem.description);
}

function unsetLightBoxImg() {
  refs.lightBoxImg.setAttribute('src', '');
  refs.lightBoxImg.setAttribute('alt', '');
}

function openLightBox() {
  refs.lightBoxContainer.classList.add('is-open');
  document.body.classList.add('scroll-y-off');
}

function closingLightBox() {
  window.removeEventListener('keydown', reactionForKeypressOnOpenLightBox);
  document.body.classList.remove('scroll-y-off');
  refs.lightBoxContainer.classList.remove('is-open');
  unsetLightBoxImg();
}

function setCurrentGalleryItemIndex(galleryItemsOriginal) {
  // currentGalleryItem = galleryItemsOriginal;
  const currentGalleryItem = galleryItems.find(
    galleryItem => galleryItem.original === galleryItemsOriginal,
  );
  currentGalleryItemIndex = galleryItems.indexOf(currentGalleryItem);
}

function reactionForKeypressOnOpenLightBox(e) {
  switch (e.code) {
    case 'Escape':
      closingLightBox();
      break;

    case 'ArrowLeft':
      showPreviousImg();
      break;

    case 'ArrowRight':
      showNextImg();
      break;
  }
}

function showPreviousImg() {
  currentGalleryItemIndex =
    currentGalleryItemIndex === 0
      ? galleryItems.length - 1
      : currentGalleryItemIndex - 1;

  setLightBoxImg(currentGalleryItemIndex);
}

function showNextImg() {
  currentGalleryItemIndex =
    currentGalleryItemIndex === galleryItems.length - 1
      ? 0
      : (currentGalleryItemIndex += 1);

  setLightBoxImg(currentGalleryItemIndex);
}
