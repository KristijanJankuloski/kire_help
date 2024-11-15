import { setArtist } from "../../utils/global.js";

export function initLandingPage() {
  const usersSelect = document.querySelector("#users");
  const joinVisitorButton = document.querySelector(".join-visitor");
  const artistNameElement = document.querySelector(
    "#artistHomePage .artist-name"
  );

  // Fetch and populate the artist list
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((users) => {
      const userNames = users.map((user) => user.name);
      usersSelect.innerHTML = "";

      const chooseOption = document.createElement("option");
      chooseOption.value = "";
      chooseOption.textContent = "Choose";
      chooseOption.disabled = true;
      chooseOption.selected = true;
      usersSelect.appendChild(chooseOption);

      userNames.forEach((userName) => {
        const option = document.createElement("option");
        option.value = userName;
        option.textContent = userName;
        usersSelect.appendChild(option);
      });

      usersSelect.addEventListener("change", function () {
        const selectedArtist = usersSelect.value;

        // Set the selected artist globally
        setArtist(selectedArtist);

        // Display the artist name on the homepage
        artistNameElement.textContent = selectedArtist;

        // Navigate to artist's homepage
        window.location.hash = "#artistHomePage";
      });
    });

  joinVisitorButton.addEventListener("click", function () {
    window.location.hash = "#visitorHomePage";
  });
}
