export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

export function timestampNow() {
  return new Date().valueOf();
}
export function generateDateLabels(daysAgo = 7) {
  const labels = [];

  for (let i = 0; i < daysAgo; i++) {
    const now = new Date();

    const date = now.getDate();
    const offsetDate = now.setDate(date - i);

    const formattedLabel = formatDate(offsetDate);

    labels.push(formattedLabel);
  }

  return labels;
}
