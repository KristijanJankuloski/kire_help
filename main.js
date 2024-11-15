import { initArtistHomePage } from "./src/pages/ArtistHomePage/artistHomePage.js";
import { initArtistItemsPage } from "./src/pages/ArtistItemPage/artistItemsPage.js";
import { initLandingPage } from "./src/pages/LandingPage/landingPage.js";
import { initVisitorsListingPage } from "./src/pages/visitorListingPage/visitorListing.js";
import { initVisitorsHomePage } from "./src/pages/VisitorsHomePage/visitorsHomePage.js";
import { dropDown } from "./src/pages/ArtistHomePage/dropdown.js";
import { initAddNewItemPage } from "./src/pages/addNewItemPage/addNewItemPage.js";
import { getItems } from "./src/utils/storage.js";
import { initCaptureImage } from "./src/pages/addNewItemPage/addNewItemPage.js";
function handleRouting() {
  const hash = location.hash ? location.hash : "#landingPage";
  const pageName = hash.split("?")[0]; // Get the part before the "?"
  const urlParams = new URLSearchParams(hash.split("?")[1] || "");

  const dropdownMenus = document.querySelectorAll(".dropdown-nav");
  dropdownMenus.forEach((menu) => (menu.style.display = "none"));

  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => (page.style.display = "none"));

  const targetPage = document.querySelector(pageName);
  if (targetPage) {
    targetPage.style.display = "block";
  }

  switch (hash) {
    case "#landingPage":
      initLandingPage();
      break;

    case "#visitorHomePage":
      initVisitorsHomePage();
      break;

    case "#artistHomePage":
      initArtistHomePage();
      dropDown();
      break;

    case "#artistItemsPage":
      initArtistItemsPage();
      dropDown();
      break;
    case "#visitorListingPage":
      initVisitorsListingPage();
      break;
    case "#addNewItemPage":
      const editMode = urlParams.get("edit") === "true"; // Check if we're in edit mode
      const itemId = urlParams.get("id");
      if (editMode && itemId) {
        // Handle the edit logic here
        const item = getItems().find((item) => item.id == itemId);
        initAddNewItemPage(item); // Pass the item to the page
        dropDown();
      } else {
        initAddNewItemPage(); // New item page
      }

      break;
    case "#artistsCaptureImage":
      initCaptureImage();
      dropDown();
    default:
      break;
  }
}

window.addEventListener("load", handleRouting);
window.addEventListener("hashchange", handleRouting);
