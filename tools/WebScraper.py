import requests
from bs4 import BeautifulSoup
import pandas as pd

# Function to scrape job listings
def scrape_jobs(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to retrieve data: {response.status_code}")
        return []

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find job listings (update the selectors based on the actual website structure)
    job_listings = soup.find_all('div', class_='job-listing')

    jobs = []
    for listing in job_listings:
        title = listing.find('h2', class_='job-title').text.strip() if listing.find('h2', class_='job-title') else 'N/A'
        company = listing.find('div', class_='company-name').text.strip() if listing.find('div', class_='company-name') else 'N/A'
        location = listing.find('div', class_='job-location').text.strip() if listing.find('div', class_='job-location') else 'N/A'

        jobs.append({
            'Title': title,
            'Company': company,
            'Location': location
        })

    return jobs

# Function to save data to CSV
def save_to_csv(jobs, filename):
    df = pd.DataFrame(jobs)
    df.to_csv(filename, index=False)
    print(f"Data successfully saved to {filename}")

if __name__ == "__main__":
    url = 'https://www.examplejobboard.com/jobs'  # Replace with the actual job board URL
    job_data = scrape_jobs(url)
    
    if job_data:
        save_to_csv(job_data, 'job_listings.csv')
