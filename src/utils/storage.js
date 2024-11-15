import { items } from "../../data/db.js";
import { initAddNewItemPage } from "../pages/addNewItemPage/addNewItemPage.js";
import { initArtistHomePage } from "../pages/ArtistHomePage/artistHomePage.js";

export function addItem(item) {
  const currentItems = getItems();
  currentItems.push(item);

  localStorage.setItem("items", JSON.stringify(currentItems));
  initArtistHomePage();
  initAddNewItemPage();
}

export function updateItem(item) {
  const currentItems = getItems();
  const index = currentItems.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    currentItems[index] = { ...item };
    localStorage.setItem("items", JSON.stringify(currentItems));
  }
}

export function deleteItem(item) {
  const currentItems = getItems();
  const updatedItems = currentItems.filter((i) => i.id !== item.id);
  localStorage.setItem("items", JSON.stringify(updatedItems));
}
export function itemDraft(item) {
  if (!item) {
    localStorage.removeItem("itemDraft");
  } else {
    localStorage.setItem("itemDraft", JSON.stringify(item));
  }
}
export function getItemDraft() {
  let itemString = localStorage.getItem("itemDraft");
  return JSON.parse(itemString);
}
export function getItems() {
  const storedItems = localStorage.getItem("items");
  if (storedItems) {
    return JSON.parse(storedItems);
  } else {
    localStorage.setItem("items", JSON.stringify(items));
    return items;
  }
}
// function generateNewId(items) {
//   if (items.length === 0) return 1;
//   const maxId = Math.max(...items.map((item) => item.id));
//   return maxId + 1;
// }
