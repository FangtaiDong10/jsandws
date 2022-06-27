// console.log("Making an Analysis");

// every 3 second
const intervalId = setInterval(() => {
  console.log("Sending analytics data...");
}, 3000);

document.getElementById("stop-analytics-btn").addEventListener("click", () => {
  clearInterval(intervalId);
});
