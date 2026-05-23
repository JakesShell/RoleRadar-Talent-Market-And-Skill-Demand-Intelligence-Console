const listings = [
  {
    title: "Security Operations Analyst",
    company: "Northstar Cyber",
    location: "Singapore",
    category: "Cloud & Security",
    signal: "Security monitoring, incident response, and SOC workflow demand."
  },
  {
    title: "Frontend Product Designer",
    company: "Lumen Systems",
    location: "Amsterdam",
    category: "Product & Design",
    signal: "Digital product experience and interface design demand."
  },
  {
    title: "Cloud Support Engineer",
    company: "Atlas Platform Group",
    location: "Cape Town",
    category: "Cloud & Security",
    signal: "Cloud infrastructure support and customer operations demand."
  },
  {
    title: "Data Operations Specialist",
    company: "Northstar Cyber",
    location: "Singapore",
    category: "Operations & Data",
    signal: "Data workflow, reporting, and operations coordination demand."
  },
  {
    title: "Technical Project Coordinator",
    company: "Bright Harbor Labs",
    location: "London",
    category: "Operations & Coordination",
    signal: "Technical delivery coordination and stakeholder tracking demand."
  }
];

const filterSelect = document.getElementById("marketFilter");

function getFilteredListings() {
  const value = filterSelect.value;

  if (value === "cloud") {
    return listings.filter((listing) => listing.category.includes("Cloud"));
  }

  if (value === "product") {
    return listings.filter((listing) => listing.category.includes("Product"));
  }

  if (value === "operations") {
    return listings.filter((listing) => listing.category.includes("Operations"));
  }

  return listings;
}

function countBy(list, key) {
  return list.reduce((accumulator, item) => {
    accumulator[item[key]] = (accumulator[item[key]] || 0) + 1;
    return accumulator;
  }, {});
}

function getTopEntry(counts) {
  const entries = Object.entries(counts);
  if (!entries.length) {
    return ["None", 0];
  }

  return entries.sort((a, b) => b[1] - a[1])[0];
}

function renderMetrics(data) {
  const companies = countBy(data, "company");
  const locations = countBy(data, "location");
  const categories = countBy(data, "category");
  const [topLocation] = getTopEntry(locations);

  const metrics = [
    {
      label: "Listings",
      value: data.length,
      meta: "Parsed market records"
    },
    {
      label: "Companies",
      value: Object.keys(companies).length,
      meta: "Unique hiring organizations"
    },
    {
      label: "Locations",
      value: Object.keys(locations).length,
      meta: "Active market regions"
    },
    {
      label: "Top Location",
      value: topLocation,
      meta: "Highest concentration in current view"
    }
  ];

  const metricGrid = document.getElementById("metricGrid");
  metricGrid.innerHTML = "";

  metrics.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `
      <span>${metric.label}</span>
      <strong>${metric.value}</strong>
      <small>${metric.meta}</small>
    `;
    metricGrid.appendChild(card);
  });

  document.getElementById("roleCountBadge").textContent = `${data.length} listings`;
}

function renderRoleDemand(data) {
  const counts = countBy(data, "category");
  const max = Math.max(...Object.values(counts), 1);
  const container = document.getElementById("roleDemandList");
  container.innerHTML = "";

  Object.entries(counts).forEach(([category, count]) => {
    const percent = Math.round((count / max) * 100);
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-row-top">
        <span>${category}</span>
        <span>${count}</span>
      </div>
      <div class="track">
        <div class="fill" style="width: ${percent}%"></div>
      </div>
    `;
    container.appendChild(row);
  });

  if (!Object.keys(counts).length) {
    container.innerHTML = `<div class="location-card"><strong>No records</strong><span>No listings match this filter.</span></div>`;
  }
}

function renderLocations(data) {
  const counts = countBy(data, "location");
  const companiesByLocation = data.reduce((accumulator, item) => {
    if (!accumulator[item.location]) {
      accumulator[item.location] = new Set();
    }
    accumulator[item.location].add(item.company);
    return accumulator;
  }, {});

  const container = document.getElementById("locationList");
  container.innerHTML = "";

  Object.entries(counts).forEach(([location, count]) => {
    const companyCount = companiesByLocation[location].size;
    const card = document.createElement("div");
    card.className = "location-card";
    card.innerHTML = `
      <strong>${location}</strong>
      <span>${count} listing${count === 1 ? "" : "s"} across ${companyCount} compan${companyCount === 1 ? "y" : "ies"}.</span>
    `;
    container.appendChild(card);
  });

  if (!Object.keys(counts).length) {
    container.innerHTML = `<div class="location-card"><strong>No locations</strong><span>No location signals available for this filter.</span></div>`;
  }
}

function renderTable(data) {
  const table = document.getElementById("listingTable");
  table.innerHTML = "";

  data.forEach((listing) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${listing.title}</td>
      <td>${listing.company}</td>
      <td>${listing.location}</td>
      <td><span>${listing.category}</span></td>
      <td>${listing.signal}</td>
    `;
    table.appendChild(row);
  });

  if (!data.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">No listings match this filter.</td>
      </tr>
    `;
  }
}

function renderSummary(data) {
  const categoryCounts = countBy(data, "category");
  const [topCategory, topCount] = getTopEntry(categoryCounts);
  const score = data.length ? Math.min(92, 58 + data.length * 4 + topCount * 6) : 0;

  document.getElementById("opportunityScore").textContent = `${score}%`;

  const title = document.getElementById("summaryTitle");
  const copy = document.getElementById("summaryCopy");
  const actions = document.getElementById("nextActions");

  if (!data.length) {
    title.textContent = "No market signal in this view";
    copy.textContent = "Try another market focus to review role demand and hiring activity.";
    actions.innerHTML = `
      <li>Reset the filter to all listings.</li>
      <li>Add more job records to improve the analysis sample.</li>
    `;
    return;
  }

  title.textContent = `${topCategory} signal detected`;
  copy.textContent = `${topCategory} appears as the strongest role category in the current listing view.`;

  actions.innerHTML = `
    <li>Prioritize portfolio language that matches the strongest role category.</li>
    <li>Use location concentration to guide search targeting and outreach.</li>
    <li>Add salary, seniority, and skill keywords in the next version.</li>
  `;
}

function renderDashboard() {
  const data = getFilteredListings();

  renderMetrics(data);
  renderRoleDemand(data);
  renderLocations(data);
  renderTable(data);
  renderSummary(data);
}

filterSelect.addEventListener("change", renderDashboard);

document.querySelector(".secondary-btn").addEventListener("click", () => {
  filterSelect.value = "all";
  renderDashboard();
});

document.querySelector(".primary-btn").addEventListener("click", () => {
  const note = document.querySelector(".note-box");
  note.textContent = "Market brief generated locally for the demo view. In a production version, this could export a PDF or send a recruiter-ready report.";
});

renderDashboard();
