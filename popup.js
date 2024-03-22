const companiesBlockedElement = document.getElementById("companies-blocked");
const blockedListElement = document.getElementById("blocked-list");
const moreLink = document.getElementById("more-link");
const toggleBlocking = document.getElementById("toggle-blocking");
const addCompanyForm = document.getElementById("add-company");
const addCompanyInput = document.getElementById("add-company-input");
const optionsLink = document.getElementById("options-link");

let blockedCompanies = [];
const maxDisplayedCompanies = 5;

// Load the blocked list from storage on popup open
chrome.storage.sync.get("blockedList", (data) => {
  if (data.blockedList) {
    blockedCompanies = data.blockedList;
    renderBlockedList();
    updateBlockedCompaniesCount();
  }
});

// Render the blocked list in the popup
function renderBlockedList() {
  blockedListElement.innerHTML = "";

  for (
    let i = 0;
    i < Math.min(blockedCompanies.length, maxDisplayedCompanies);
    i++
  ) {
    const company = blockedCompanies[i];
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = company;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeCompany(company));
    li.appendChild(span);
    li.appendChild(deleteButton);
    blockedListElement.appendChild(li);
  }

  moreLink.style.display =
    blockedCompanies.length > maxDisplayedCompanies ? "block" : "none";
}

// Update the count of blocked companies
function updateBlockedCompaniesCount() {
  companiesBlockedElement.textContent = blockedCompanies.length;
}

// Remove a company from the blocked list
function removeCompany(company) {
  const index = blockedCompanies.indexOf(company);
  if (index !== -1) {
    blockedCompanies.splice(index, 1);
    chrome.storage.sync.set({ blockedList: blockedCompanies }, () => {
      renderBlockedList();
      updateBlockedCompaniesCount();
    });
  }
}

// Toggle blocking functionality
toggleBlocking.addEventListener("change", () => {
  chrome.storage.sync.set({ blockingEnabled: toggleBlocking.checked });
});

// Add a new company to the blocked list
addCompanyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const company = addCompanyInput.value.trim();
  if (company && !blockedCompanies.includes(company)) {
    blockedCompanies.push(company);
    chrome.storage.sync.set({ blockedList: blockedCompanies }, () => {
      addCompanyInput.value = "";
      renderBlockedList();
      updateBlockedCompaniesCount();
    });
  }
});

// Open the options page
optionsLink.addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});
