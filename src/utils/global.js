let currentArtist;

export function getArtist() {
  return currentArtist || localStorage.getItem("currentArtist");
}

export function setArtist(_artist) {
  currentArtist = _artist;
  localStorage.setItem("currentArtist", _artist);
}

export const auctionState = {
  currentAuctionItem: null,
};
