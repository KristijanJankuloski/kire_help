export function dropDown() {
  const dropdownButtons = document.querySelectorAll(".dropdown-button");

  // Remove existing event listeners by cloning each button (resets listeners)
  dropdownButtons.forEach((button) => {
    const newButton = button.cloneNode(true);
    button.replaceWith(newButton);

    // Find the associated menu with the next sibling selector
    const dropdownMenu = newButton.nextElementSibling;

    if (dropdownMenu && dropdownMenu.classList.contains("dropdown-nav")) {
      newButton.addEventListener("click", () => {
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });
    }
  });
}
