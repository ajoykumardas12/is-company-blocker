let blockedCompaniesSet;
let isBlockingEnabled = true; // default true, updates to user set value
let showHiddenFeedback = true; // default true, updates to user set value

// Check if blocking is disabled
chrome.storage.sync.get("blockingEnabled", (data) => {
  // Default to true if the value is not set
  isBlockingEnabled = data.blockingEnabled ?? true;
});

// Check if blocking is disabled
chrome.storage.sync.get("showHiddenFeedback", (data) => {
  // Default to true if the value is not set
  showHiddenFeedback = data.showHiddenFeedback ?? true;
});

// Load the blocked list from storage
chrome.storage.sync.get("blockedList", (data) => {
  if (data.blockedList) {
    const blockedCompanies = data.blockedList.map((company) =>
      company.toLowerCase()
    );

    // Create new Set from blocked companies and update set value
    blockedCompaniesSet = new Set(blockedCompanies);

    // Call the checkJobPostings function after loading the blocked list
    checkJobPostings();
  }
});

// Function to check if a company is blocked
function isBlocked(company) {
  return blockedCompaniesSet.has(company.toLowerCase());
}

// Function to insert new node after a node
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Function to hide a job posting
function hideJobPosting(jobPosting) {
  jobPosting.classList.toggle("hidden-job-posting");

  if (showHiddenFeedback) {
    // Create a badge element
    const badge = document.createElement("div");
    badge.textContent = "Hidden by IS Company Blocker Extension.";
    badge.classList.add("individual_internship", "hidden-badge");

    // Create button to show job posting on click
    const showJobPostingButton = document.createElement("button");
    showJobPostingButton.textContent = "Show";
    showJobPostingButton.classList.add("show-posting-button");
    showJobPostingButton.addEventListener("click", () => {
      jobPosting.classList.toggle("hidden-job-posting");
      badge.remove();
    });

    badge.appendChild(showJobPostingButton);

    // Append the badge to the job posting element
    insertAfter(jobPosting, badge);
  }
}

// Function to traverse the DOM and check job postings
function checkJobPostings() {
  if (!isBlockingEnabled) return;

  const jobPostings = document.querySelectorAll(".individual_internship");

  for (const jobPosting of jobPostings) {
    // Get company name of each job posting and hide if blocked
    const companyName = jobPosting
      .querySelector(".company_name")
      ?.innerText.toLowerCase();

    if (companyName && isBlocked(companyName)) {
      hideJobPosting(jobPosting);
    }
  }
}

// Call the function to hide job postings on DOM load
window.addEventListener("load", () => {
  // Check if blockedCompaniesSet is not empty before running checkJobPostings
  // This may run checkJobPostings() twice but ensures it runs atleast once
  // even if race condition arise between loading blockedList and page load
  if (blockedCompaniesSet && blockedCompaniesSet.size !== 0) {
    checkJobPostings();
  }
});
