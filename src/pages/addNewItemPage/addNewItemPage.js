import { items } from "../../../data/db.js";
import { itemTypes } from "../../../data/db.js";
import { initArtistItemsPage } from "../../pages/ArtistItemPage/artistItemsPage.js";
import { getArtist } from "../../utils/global.js";
import { formatDate } from "../../utils/dates.js";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  itemDraft,
  getItemDraft,
} from "../../utils/storage.js";

export function initAddNewItemPage(item = null) {
  const selectedArtist = getArtist();
  document.querySelector(".artist-name3").textContent = selectedArtist;

  const title = document.getElementById("new-item_title");
  const description = document.getElementById("new-item_desc");
  const type = document.getElementById("new-item_type");
  const price = parseFloat(document.getElementById("new-item_price"));
  const imageUrl = document.getElementById("new-item_img-url");
  const isPublished = document.getElementById("is_published");
  const artist = getArtist();
  const dateCreated = new Date().toISOString();
  ItemTypeDropdown();
  const draft = getItemDraft();
  if (draft) {
    title.value = draft.title;
  }
  const capturedImage = sessionStorage.getItem("capturedImage");
  if (capturedImage) {
    document.getElementById("new-item_img-url").value = capturedImage;
    sessionStorage.removeItem("capturedImage"); // Clear after setting
  }
  if (item) {
    document.getElementById("new-item_title").value = item.title;
    document.getElementById("new-item_desc").value = item.description;
    document.getElementById("new-item_type").value = item.type;
    document.getElementById("new-item_price").value = item.price;
    document.getElementById("new-item_img-url").value = item.image;
    document.getElementById("is_published").checked = item.isPublished;
    document.getElementById("saveItemButton").textContent = "Update Item";
  } else {
    document.getElementById("new-item_title").value = "";
    document.getElementById("new-item_desc").value = "";
    document.getElementById("new-item_type").selectedIndex = 0;
    document.getElementById("new-item_price").value = "";
    document.getElementById("new-item_img-url").value = "";
    document.getElementById("is_published").checked = true;
    document.getElementById("saveItemButton").textContent = "Add New Item";
  }

  const isPublishedCheckbox = document.getElementById("is_published");
  isPublishedCheckbox.addEventListener("change", function () {
    if (this.checked) {
      this.style.backgroundColor = "blue";
    } else {
      this.style.backgroundColor = "";
    }
  });

  document
    .getElementById("saveItemButton")
    .removeEventListener("click", saveNewItem);
  document
    .getElementById("saveItemButton")
    .addEventListener("click", () => saveNewItem(item));
  title.addEventListener("input", function () {
    const newItem = {
      id: 0,
      title: title.value,
      description: description.value,
      type: type.value,
      price: price.value,
      image: sessionStorage.getItem("capturedImage"),
      artist: artist.value,
      dateCreated: null,
      isPublished,
      isAuctioning: false,
      dateSold: null,
      priceSold: null,
    };
    itemDraft(newItem);
  });
  document
    .querySelector(".alert-read-btn")
    .addEventListener("click", function () {
      document.querySelector(".alert-screen-overlay").style.display = "none";
      document.querySelector(".alert-popup").style.display = "none";
    });
}
function ItemTypeDropdown() {
  const itemTypeSelect = document.getElementById("new-item_type");

  itemTypeSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select item type";
  itemTypeSelect.appendChild(defaultOption);

  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    itemTypeSelect.appendChild(option);
  });
}
export function openEditItemForm(item) {
  document.getElementById("new-item_title").value = item.title;
  document.getElementById("new-item_desc").value = item.description;
  document.getElementById("new-item_type").value = item.type;
  document.getElementById("new-item_price").value = item.price;
  document.getElementById("new-item_img-url").value = item.image;

  document.getElementById("addNewItemPage").style.display = "block";
  document.getElementById("artistItemsPage").style.display = "none";

  document
    .getElementById("saveItemButton")
    .setAttribute("data-item-id", item.id);
}
function saveNewItem() {
  const title = document.getElementById("new-item_title").value.trim();
  const description = document.getElementById("new-item_desc").value.trim();
  const type = document.getElementById("new-item_type").value;
  const price = parseFloat(document.getElementById("new-item_price").value);
  const imageUrl = document.getElementById("new-item_img-url").value.trim();
  const isPublished = document.getElementById("is_published").checked;
  const artist = getArtist();
  const dateCreated = new Date().toISOString();

  if (!title || !description || !type || isNaN(price)) {
    document.querySelector(".alert-screen-overlay").style.display = "block";
    document.querySelector(".alert-popup").style.display = "block";
    return;
  }
  const itemId = document
    .getElementById("saveItemButton")
    .getAttribute("data-item-id");

  if (itemId) {
    const updatedItem = {
      id: parseInt(itemId), // Ensure ID is a number
      title: title,
      description: description,
      type: type,
      price: price,
      image: imageUrl,
      artist: artist,
      dateCreated: dateCreated,
      isPublished,
      isAuctioning: false,
      dateSold: null,
      priceSold: null,
    };
    updateItem(updatedItem);
  } else {
    // Add new item
    const lastItem = getItems().pop();
    const newId = lastItem ? lastItem.id + 1 : 1;
    const newItem = {
      id: newId,
      title,
      description,
      type,
      price,
      image: imageUrl,
      artist,
      dateCreated,
      isPublished,
      isAuctioning: false,
      dateSold: null,
      priceSold: null,
    };
    addItem(newItem);
    console.log("Current Date Created: ", dateCreated);
  }

  // Clear the form fields
  document.getElementById("new-item_title").value = "";
  document.getElementById("new-item_desc").value = "";
  document.getElementById("new-item_type").selectedIndex = 0;
  document.getElementById("new-item_price").value = "";
  document.getElementById("new-item_img-url").value = "";

  // Redirect back to the items page
  document.getElementById("addNewItemPage").style.display = "none";
  document.getElementById("artistItemsPage").style.display = "block";
  initArtistItemsPage();
}

// function displayItems() {
//   const artistCardsContainer = document.getElementById("artist_cards");
//   artistCardsContainer.innerHTML = "";

//   const itemsToDisplay = getItems();
//   itemsToDisplay.forEach((item, index) => {
//     const card = document.createElement("div");
//     card.classList.add("item-card");
//     index = item.id;
//     card.innerHTML = `
//       <img src="${item.image}" alt="${item.title}" class="item-image" />
//       <div class="item-info">
//         <h2 class="item-title">${item.title}</h2>
//         <p class="item-description">${item.description}</p>
//         <p class="item-type">Type: ${item.type}</p>
//         <p class="item-price">Price: $${item.price}</p>
//         <p class="item-artist">Artist: ${item.artist}</p>
//         <p class="item-dateCreated">Created: ${formatDate(item.dateCreated)}</p>
//       </div>
//       <button class="delete-item-btn" data-index="${index}">Delete</button>
//     `;
//     artistCardsContainer.appendChild(card);
//   });

//   const deleteButtons = document.querySelectorAll(".delete-item-btn");
//   deleteButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       const itemId = parseInt(event.target.getAttribute("data-id"));
//       const item = getItems().find((item) => item.id === itemId);
//       deleteItem(item); // Use the deleteItem function from storage.js
//       displayItems(); // Re-render items after deletion
//     });
//   });
//   const editButtons = document.querySelectorAll(".edit-item-btn");
//   editButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       const itemId = parseInt(event.target.getAttribute("data-id"));
//       const itemToEdit = getItems().find((item) => item.id === itemId);
//       openEditItemForm(itemToEdit);
//     });
//   });
// }

document
  .getElementById("saveItemButton")
  .addEventListener("click", saveNewItem);

document
  .querySelector(".alert-read-btn")
  .addEventListener("click", function () {
    document.querySelector(".alert-screen-overlay").style.display = "none";
    document.querySelector(".alert-popup").style.display = "none";
  });

ItemTypeDropdown();
document.getElementById("cancelButton").addEventListener("click", function () {
  window.location.hash = "#artistItemsPage";
  document.getElementById("addNewItemPage").style.display = "none";
  document.getElementById("artistItemsPage").style.display = "block";
});
const constrains = {
  video: {
    facingMode: {
      ideal: "environment",
    },
  },
};
export function initCaptureImage() {
  const liveStreamVideo = document.querySelector("video");

  const snapshotCanvas = document.querySelector("canvas"); //snapshotCanvas
  const captureSnapshotBtn = document.querySelector("#captureSnapshot");
  if (liveStreamVideo && snapshotCanvas && captureSnapshotBtn) {
    navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
      liveStreamVideo.srcObject = stream;
    });

    captureSnapshotBtn.addEventListener("click", function () {
      snapshotCanvas.width = liveStreamVideo.videoWidth;
      snapshotCanvas.height = liveStreamVideo.videoHeight;

      const ctx = snapshotCanvas.getContext("2d");
      ctx.drawImage(liveStreamVideo, 0, 0);

      const imgData = snapshotCanvas.toDataURL("image/png");
      document.querySelector("#new-img-displayed").scr = imgData;

      sessionStorage.setItem("capturedImage", imgData);
      window.location.hash = "#addNewItemPage";
    });
  }
}
