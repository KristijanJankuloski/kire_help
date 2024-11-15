import { items, itemTypes } from "../../../data/db.js";

const itemsContainer = document.querySelector("#visitorItemsContainer");
const filterPanel = document.querySelector(".filters");
const filterIcon = document.querySelector("#filterIcon");
const closeBtn = document.querySelector(".close-btn");
const applyBtn = document.querySelector(".apply-btn");

const visitorItemsContainer = document.querySelector("#visitorItemsContainer");

const titleInput = document.querySelector("#item-title");
const artistSelect = document.querySelector("#filter-artist-select");
const minPriceInput = document.querySelector("#min-price");
const maxPriceInput = document.querySelector("#max-price");
const typeSelect = document.querySelector("#type");

export function initVisitorsListingPage() {
  const publishedItems = items.filter((item) => item.isPublished);
  renderVisitorItems(publishedItems);

  loadArtists();
  loadItemTypes();

  filterIcon.addEventListener("click", toggleFilterPanel);
  closeBtn.addEventListener("click", closeFilterPanel);
  applyBtn.addEventListener("click", applyFilters);
}

function toggleFilterPanel() {
  filterPanel.style.transform = "translateX(0)";
  filterPanel.classList.toggle("active");

  if (filterPanel.classList.contains("active")) {
    visitorItemsContainer.style.display = "none";
  } else {
    visitorItemsContainer.style.display = "block";
  }
}

function closeFilterPanel() {
  filterPanel.style.transform = "translateX(100%)";

  filterPanel.classList.remove("active");
  visitorItemsContainer.style.display = "block";
}

function loadArtists() {
  const artists = [...new Set(items.map((item) => item.artist))];
  populateArtistSelect(artists);
}

function populateArtistSelect(artists) {
  if (!artistSelect) {
    console.error("Artist select element not found!");
    return;
  }

  artists.forEach((artist) => {
    const option = document.createElement("option");
    option.value = artist;
    option.textContent = artist;
    artistSelect.appendChild(option);
  });
}

function loadItemTypes() {
  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

function applyFilters() {
  const title = titleInput.value.toLowerCase();
  const artist = artistSelect.value.trim();
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
  const type = typeSelect.value;

  const filteredItems = items.filter((item) => {
    return (
      item.isPublished &&
      (title ? item.title.toLowerCase().includes(title) : true) &&
      (artist ? item.artist.toLowerCase() === artist.toLowerCase() : true) &&
      (type ? item.type === type : true) &&
      item.price >= minPrice &&
      item.price <= maxPrice
    );
  });

  renderVisitorItems(filteredItems);
  closeFilterPanel();

  if (filteredItems.length === 0) {
    itemsContainer.innerHTML =
      "<p class='text-center mt-5'>No items found matching your filters.</p>";
  }
}

function renderVisitorItems(items) {
  itemsContainer.innerHTML = "";
  items.forEach((item, idx) => {
    const card = document.createElement("div");
    card.classList.add("card", "mt-5");

    if (idx % 2 === 1) {
      card.classList.add("card-dark");
    } else {
      card.classList.add("card-light");
    }

    card.innerHTML = `
      <img class="card-img-top" src="${item.image}" alt="${item.title}">
      <div class="card-body">
        <h5 class="card-title">${item.artist}</h5>
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">${item.description}</p>
        <a href="#" class="btn btn-primary">${item.price}$</a>
      </div>`;

    itemsContainer.appendChild(card);
  });
}
