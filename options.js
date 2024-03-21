const blockedListTextarea = document.getElementById("blocked-list");
const saveButton = document.getElementById("save-btn");

// Load the blocked list from storage on page load
chrome.storage.sync.get("blockedList", (data) => {
  blockedListTextarea.value = data.blockedList
    ? `${data.blockedList.join("\n")}\n`
    : "";
});

// Save the blocked list to storage when the save button is clicked
saveButton.addEventListener("click", () => {
  const blockedList = blockedListTextarea.value
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  chrome.storage.sync.set({ blockedList }, () => {
    alert("Blocked list saved");
  });
});
