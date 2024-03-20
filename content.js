// List of blocked companies
const blockedList = [
  "K-RITE",
  "DeepThought Edutech Ventures Private Limited",
  "Busibud",
  "Blackcoffer",
];

// Convert company names to lowercase
const blockedCompanies = blockedList.map((company) => company.toLowerCase());

// Function to check if a company is blocked
function isBlocked(company) {
  return blockedCompanies.some((blocked) => company.includes(blocked));
}

// Function to hide a job posting
function hideJobPosting(a) {
  const jobPosting =
    a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  jobPosting.style.display = "none";
}

// Traverse the DOM and hide job postings
function hideContent() {
  const anchors = document.getElementsByTagName("a");
  for (const anchor of anchors) {
    const text = anchor.textContent.toLowerCase();
    if (isBlocked(text)) {
      hideJobPosting(anchor);
    }
  }
}

// Call the hideContent function on page load
window.addEventListener("load", hideContent);
