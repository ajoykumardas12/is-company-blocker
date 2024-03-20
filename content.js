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

// Function to hide a job posting
function hideJobPosting(jobPosting) {
  jobPosting.style.display = "none";
}

// Function to traverse the DOM and hide job postings
function hideContent() {
  const jobPostings = document.getElementsByClassName("individual_internship");

  for (const jobPosting of jobPostings) {
    const companyName = jobPosting
      .getElementsByClassName("company_and_premium")[0]
      ?.innerText.toLowerCase();

    if (companyName && isBlocked(companyName)) {
      hideJobPosting(jobPosting);
    }
  }
}

// Call the function to hide job postings on page load
window.addEventListener("load", hideContent);
