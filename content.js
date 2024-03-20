// List of blocked companies
const blockedList = [
  "K-RITE",
  "DeepThought Edutech Ventures Private Limited",
  "Busibud",
  "Blackcoffer",
];

// Convert company names to lowercase and create new Set
const blockedCompanies = blockedList.map((company) => company.toLowerCase());
const blockedCompaniesSet = new Set(blockedCompanies);

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

  // Create a badge element
  const badge = document.createElement("div");
  badge.textContent = "Hidden by IS Company Blocker.";
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

// Function to traverse the DOM and hide job postings
function hideContent() {
  const jobPostings = document.querySelectorAll(".individual_internship");

  for (const jobPosting of jobPostings) {
    // Get company name of each job posting and hide if blocked
    const companyName = jobPosting
      .querySelectorAll(".company_and_premium")[0]
      ?.innerText.toLowerCase();

    if (companyName && isBlocked(companyName)) {
      hideJobPosting(jobPosting);
    }
  }
}

// Call the function to hide job postings on page load
window.addEventListener("load", hideContent);
