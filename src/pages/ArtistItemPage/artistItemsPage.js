import { items, itemTypes } from "../../../data/db.js";
import { getArtist } from "../../utils/global.js";
import { auctionState } from "../../utils/global.js";
import { formatDate } from "../../utils/dates.js";
import { deleteItem, getItems, updateItem } from "../../utils/storage.js";
import { openEditItemForm } from "../../pages/addNewItemPage/addNewItemPage.js";
export function initArtistItemsPage() {
  const selectedArtist = getArtist();

  document.querySelector(".artist-name2").textContent = selectedArtist;

  const artistItems = getItems().filter(
    (item) => item.artist === selectedArtist
  );
  if (artistItems.length === 0) {
    console.log("No items found for this artist");
  } else {
    renderArtistItems(artistItems);
  }

  console.log(artistItems);
  console.log(items);
  console.log(getItems());

  const currentFormattedDate = formatDate(new Date());
  console.log(currentFormattedDate);
}

export function renderArtistItems(artistItems) {
  const artistItemsContainer = document.querySelector("#artist_cards");

  if (!artistItemsContainer) {
    console.error("Element #artist_cards not found.");
    return;
  }

  artistItemsContainer.innerHTML = "";

  artistItems.forEach((item) => {
    const itemCard = createItemCard(item);
    artistItemsContainer.appendChild(itemCard);
  });
  const deleteButtons = document.querySelectorAll(".delete-item-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = parseInt(event.target.getAttribute("data-id"));
      const item = getItems().find((item) => item.id === itemId);
      deleteItem(item);
      initArtistItemsPage();
    });
  });

  // Add event listeners for edit buttons
  const editButtons = document.querySelectorAll(".edit-item-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = parseInt(event.target.getAttribute("data-id"));
      const itemToEdit = getItems().find((item) => item.id === itemId);
      openEditItemForm(itemToEdit);
    });
  });
}

function createItemCard(item) {
  const card = document.createElement("div");
  card.classList.add("item-card");
  const currentFormattedDate = formatDate(item.dateCreated);
  card.innerHTML = `
   <img class="card-img-top" src="${item.image}" alt="${item.title}">
      <div class="card-body">
      <div class="titleandprice"> <h5 class="card-title">${item.title}</h5>
        <a href="#" class="btn btn-light">${item.price}$</a></div>
        <h5 class="card-date">${currentFormattedDate}</h5>
        <p class="card-text">${item.description}</p>
       
      </div>
      <div class="buttons">
    <button class="send-to-auction btn btn-primary" data-id="${
      item.id
    }">Send to Auction</button>
    <button class="publish-toggle btn btn-success" data-id="${item.id}">${
    item.isPublished ? "Unpublish" : "Publish"
  }</button>
    <button class="remove-item btn btn-danger" data-id="${
      item.id
    }">Remove</button>
    <button class="edit-item btn btn-light" data-id="${item.id}">Edit</button>
      </div>
  `;

  card
    .querySelector(".send-to-auction")
    .addEventListener("click", handleSendToAuction);
  card
    .querySelector(".publish-toggle")
    .addEventListener("click", handlePublishToggle);
  card
    .querySelector(".remove-item")
    .addEventListener("click", handleRemoveItem);
  card.querySelector(".edit-item").addEventListener("click", handleEditItem);

  return card;
}
function handleSendToAuction(event) {
  const itemId = event.target.getAttribute("data-id");
  const items = getItems();
  const item = items.find((item) => item.id == itemId);

  if (auctionState.currentAuctionItem) {
    alert("There's already an ongoing auction!");
    return;
  }

  item.isAuctioning = true;
  auctionState.currentAuctionItem = item;
  updateItem(item);

  renderArtistItems(getItems().filter((item) => item.artist === getArtist()));
}

function handlePublishToggle(event) {
  const itemId = event.target.getAttribute("data-id");
  const items = getItems();
  const item = items.find((item) => item.id == itemId);

  if (!item) {
    console.error(`Item with ID ${itemId} not found in items array.`);
    return;
  }

  item.isPublished = !item.isPublished;
  updateItem(item);

  renderArtistItems(getItems().filter((item) => item.artist === getArtist()));
}

export function handleRemoveItem(event) {
  const itemId = parseInt(event.target.getAttribute("data-id"));
  const items = getItems();
  const item = items.find((item) => item.id == itemId);

  if (!item) {
    console.error(`Item with ID ${itemId} not found`);
    return;
  }
  const confirmation = window.confirm(
    `Are you sure you want to remove "${item.title}"?`
  );
  if (confirmation) {
    deleteItem(item);
    renderArtistItems(getItems().filter((item) => item.artist === getArtist()));
  }
}

function handleEditItem(event) {
  const itemId = parseInt(event.target.getAttribute("data-id"));
  const itemToEdit = getItems().find((item) => item.id === itemId);

  if (!itemToEdit) {
    console.error(`Item with ID ${itemId} not found.`);
    return;
  }

  openEditItemForm(itemToEdit);
}

function openAddNewItemPage(item) {
  const itemId = item.id;
  window.location.hash = `#addNewItemPage?edit=true&id=${itemId}`;
}
