import { getArtist } from "../../utils/global.js";
import { items } from "../../../data/db.js";
import { auctionState } from "../../utils/global.js";
import { formatDate, generateDateLabels } from "../../utils/dates.js";
import { getItems } from "../../utils/storage.js";

let chartInstance;

export function initArtistHomePage() {
  const selectedArtist = getArtist();
  document.querySelector(".artist-name").textContent = selectedArtist;

  const artistItems = getItems().filter(
    (item) => item.artist === selectedArtist
  );
  console.log(selectedArtist);
  console.log(artistItems);

  const totalItems = artistItems.length;
  const soldItems = artistItems.filter((item) => item.dateSold).length;
  const totalIncome = artistItems.reduce((sum, item) => {
    return item.priceSold ? sum + item.priceSold : sum;
  }, 0);

  drawChart(7);

  const last7 = document.querySelector("#last7");
  const last14 = document.querySelector("#last14");
  const last30 = document.querySelector("#last30");

  last7.addEventListener("click", function () {
    drawChart(7);
  });
  last14.addEventListener("click", function () {
    drawChart(14);
  });
  last30.addEventListener("click", function () {
    drawChart(30);
  });
  document.querySelector(
    ".statistics-card:nth-child(1) .statistics-value"
  ).textContent = `${soldItems}/${totalItems}`;
  document.querySelector(
    ".statistics-card:nth-child(2) .statistics-value"
  ).textContent = `$${totalIncome}`;

  const liveAuctionItem = artistItems.find((item) => item.isAuctioning);
  const liveAuctioningElement = document.querySelector(
    ".statistics-card:nth-child(3) .statistics-value"
  );

  if (liveAuctionItem) {
    auctionState.currentAuctionItem = liveAuctionItem;
    liveAuctioningElement.textContent = `$${liveAuctionItem.currentBid || 0}`;
  } else {
    auctionState.currentAuctionItem = null;
    liveAuctioningElement.textContent = "Currently not available";
  }

  const statisticsCard = document.querySelector(
    ".statistics-card:nth-child(3)"
  );
  statisticsCard.onclick = () => {
    if (auctionState.currentAuctionItem) {
      window.location.href = "index.html#auction";
    }
  };
}

function drawChart(daysAgo) {
  const labels = generateDateLabels(daysAgo);
  const selectedArtist = getArtist();

  const artistItems = items.filter(
    (item) => item.artist === selectedArtist && !!item.priceSold
  );

  const data = getChartData(artistItems, labels);

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;

    chartInstance.update();
  } else {
    chartInstance = initChart({
      labels: labels,
      data: data,
    });
  }
}

function getChartData(items = [], labels = []) {
  const chartData = [];

  labels.forEach((label) => {
    let sum = 0;

    items.forEach((item) => {
      if (formatDate(item.dateSold) === label) {
        sum += item.priceSold;
      }
    });

    chartData.push(sum);
  });

  return chartData;
}

function initChart(config) {
  const ctx = document.getElementById("myChart");

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: config.labels,
      datasets: [
        {
          label: "amount",
          data: config.data,
          borderWidth: 1,
          backgroundColor: "rgba(161, 106, 94, 1)",
        },
      ],
    },
    options: {
      indexAxis: "y",
    },
  });

  return myChart;
}
