from pathlib import Path
from bs4 import BeautifulSoup
import pandas as pd


CATEGORY_KEYWORDS = {
    "Cloud & Security": [
        "cloud",
        "security",
        "cyber",
        "soc",
        "support engineer",
        "infrastructure",
        "incident",
    ],
    "Product & Design": [
        "frontend",
        "designer",
        "product",
        "ux",
        "ui",
        "interface",
    ],
    "Operations & Data": [
        "data",
        "operations",
        "reporting",
        "analytics",
    ],
    "Operations & Coordination": [
        "project",
        "coordinator",
        "delivery",
        "stakeholder",
        "program",
    ],
}


def load_html(source_path: Path) -> str:
    return source_path.read_text(encoding="utf-8")


def categorize_role(title: str) -> str:
    normalized_title = title.lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in normalized_title for keyword in keywords):
            return category

    return "General Talent Market"


def build_market_signal(title: str, category: str) -> str:
    if category == "Cloud & Security":
        return "Cloud, security operations, support, and infrastructure demand."
    if category == "Product & Design":
        return "Digital product, interface, and customer experience demand."
    if category == "Operations & Data":
        return "Data workflow, reporting, and operational execution demand."
    if category == "Operations & Coordination":
        return "Technical coordination, delivery planning, and stakeholder workflow demand."

    return f"General hiring signal connected to {title}."


def parse_job_listings(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    job_listings = soup.select(".job-listing")

    jobs = []
    for listing in job_listings:
        title_element = listing.select_one(".job-title")
        company_element = listing.select_one(".company-name")
        location_element = listing.select_one(".job-location")

        title = title_element.get_text(strip=True) if title_element else "N/A"
        company = company_element.get_text(strip=True) if company_element else "N/A"
        location = location_element.get_text(strip=True) if location_element else "N/A"
        category = categorize_role(title)

        jobs.append(
            {
                "Title": title,
                "Company": company,
                "Location": location,
                "Category": category,
                "Market Signal": build_market_signal(title, category),
            }
        )

    return jobs


def print_summary(dataframe: pd.DataFrame) -> None:
    total_listings = len(dataframe)
    unique_companies = dataframe["Company"].nunique()
    unique_locations = dataframe["Location"].nunique()
    top_location = dataframe["Location"].value_counts().idxmax()
    top_category = dataframe["Category"].value_counts().idxmax()

    print()
    print("Market Summary")
    print("--------------")
    print(f"Total Listings: {total_listings}")
    print(f"Unique Companies: {unique_companies}")
    print(f"Unique Locations: {unique_locations}")
    print(f"Top Location: {top_location}")
    print(f"Top Role Category: {top_category}")

    print()
    print("Listings By Role Category")
    print("-------------------------")
    print(dataframe["Category"].value_counts().to_string())

    print()
    print("Listings By Location")
    print("--------------------")
    print(dataframe["Location"].value_counts().to_string())

    print()
    print("Listings By Company")
    print("-------------------")
    print(dataframe["Company"].value_counts().to_string())


def main() -> None:
    print("RoleRadar Talent Market & Skill Demand Intelligence Console")
    print("-----------------------------------------------------------")
    print("Analyze a local HTML export of job listings and generate a structured CSV report.")
    print()

    path_input = input("Enter HTML source file path [sample_job_board.html]: ").strip()
    source_path = Path(path_input or "sample_job_board.html")

    if not source_path.exists():
        print(f"Source file not found: {source_path}")
        return

    html = load_html(source_path)
    jobs = parse_job_listings(html)

    if not jobs:
        print("No job listings were found in the provided file.")
        return

    dataframe = pd.DataFrame(jobs)
    output_path = Path("talent_market_listings.csv")
    dataframe.to_csv(output_path, index=False)

    print()
    print("Extracted Listings")
    print("------------------")
    print(dataframe.to_string(index=False))

    print_summary(dataframe)

    print()
    print(f"CSV report saved to: {output_path.resolve()}")


if __name__ == "__main__":
    main()
