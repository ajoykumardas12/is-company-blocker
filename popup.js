const companiesBlockedElement = document.getElementById("companies-blocked");
const blockedListElement = document.getElementById("blocked-list");
const toggleBlocking = document.getElementById("toggle-blocking");
const addCompanyForm = document.getElementById("add-company");
const addCompanyInput = document.getElementById("add-company-input");
const optionsLink = document.getElementById("options-link");

let blockedCompanies = [];

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

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

  for (let i = 0; i < blockedCompanies.length; i++) {
    const company = blockedCompanies[i];
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = company;
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = deleteIcon;
    deleteButton.addEventListener("click", () => removeCompany(company));
    li.appendChild(span);
    li.appendChild(deleteButton);
    blockedListElement.appendChild(li);
  }

  blockedListElement.style.display =
    blockedCompanies.length === 0 ? "none" : "block";
}

// Update the count of blocked companies
function updateBlockedCompaniesCount() {
  const noOfCompanies = blockedCompanies.length;
  if (noOfCompanies === 0) {
    companiesBlockedElement.textContent =
      "No company blocked. Add companies to block.";
  } else
    companiesBlockedElement.textContent = `${blockedCompanies.length} ${
      noOfCompanies > 1 ? "companies" : "company"
    } blocked`;
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
chrome.storage.sync.get("blockingEnabled", (data) => {
  // Default to true if the value is not set
  const isBlockingEnabled = data.blockingEnabled ?? true;
  toggleBlocking.checked = isBlockingEnabled;
});

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
    // Fallback in-case openOptionsPage not available/ Older chrome version
    window.open(chrome.runtime.getURL("options.html"));
  }
});
