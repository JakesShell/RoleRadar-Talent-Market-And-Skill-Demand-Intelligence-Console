# RoleRadar Talent Market & Skill Demand Intelligence Console

## Live Demo

[Open the live deployed app](https://roleradar-static-talent-market-console-3zpyvgflj.vercel.app)

RoleRadar is a Python and browser-based talent intelligence project for analyzing job market listings, hiring demand, role categories, company activity, and location concentration.

## Project Purpose

This project began as a Python job-listing parser and was upgraded into a practical talent market intelligence console. It demonstrates how raw job board exports can be converted into structured CSV data and presented as a business-facing dashboard for recruiting operations, workforce planning, or career strategy.

## Features

- Local HTML job listing parser
- Structured CSV export
- Role category detection
- Market signal generation
- Company and location counts
- Top hiring location summary
- Browser-based market intelligence dashboard
- Role demand breakdown
- Location concentration cards
- Parsed listing table
- Opportunity summary panel
- Responsive full-screen dashboard layout
- Wide-screen and zoomed-out layout support

## Tech Stack

- Python
- BeautifulSoup
- pandas
- HTML
- CSS
- JavaScript

## Repository Contents

- `index.html`
- `styles.css`
- `app.js`
- `tools/MarketListingAnalyzer.py`
- `tools/WebScraper.py`
- `tools/sample_job_board.html`
- `tools/talent_market_listings.csv`
- `tools/requirements.txt`

## Run The Browser Dashboard

```powershell
Start-Process .\index.html

