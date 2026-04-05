import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from apify_client import ApifyClient

logger = logging.getLogger(__name__)

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
client = ApifyClient(APIFY_TOKEN) if APIFY_TOKEN else None

# Prepare the Actor input
def jobs(title):
    if not client:
        return _get_fallback_jobs(title)
    
    try:
        # Use a free, usage-based Actor instead of a paid/rental one
        # "worldunboxer/rapid-linkedin-scraper" is a popular free-to-use option
        run_input = {
            "query": title,
            "location": "India",
            "max_results": 10,
            "proxy": {
                "useApifyProxy": True
            }
        }

        # Run the Actor and wait for it to finish
        # Using a reliable alternative that doesn't require a monthly rental
        run = client.actor("worldunboxer/rapid-linkedin-scraper").call(run_input=run_input, timeout_secs=120)

        # Fetch results from the run's dataset
        items = []
        for item in client.dataset(run["defaultDatasetId"]).iterate_items():
            items.append({
                "title": item.get("jobTitle") or item.get("title") or title,
                "jobUrl": item.get("jobUrl") or item.get("job_url") or f"https://www.linkedin.com/jobs/search/?keywords={title}&location=India",
                "companyName": item.get("companyName") or item.get("company_name") or "Various Companies",
            })

        if not items:
            return _get_fallback_jobs(title)
            
        return items

    except Exception as e:
        # Log error and return fallback links so the UI doesn't break
        logger.error(f"Apify fetch failed: {str(e)}")
        return _get_fallback_jobs(title)

def _get_fallback_jobs(title):
    """Provides high-quality search links when the scraper is unavailable."""
    return [
        {
            "title": f"Explore {title} roles",
            "jobUrl": f"https://www.linkedin.com/jobs/search/?keywords={title.replace(' ', '%20')}&location=India",
            "companyName": "LinkedIn India"
        },
        {
            "title": f"View latest {title} openings",
            "jobUrl": f"https://in.indeed.com/jobs?q={title.replace(' ', '%20')}&l=India",
            "companyName": "Indeed India"
        },
        {
            "title": f"Search {title} on Naukri",
            "jobUrl": f"https://www.naukri.com/{title.replace(' ', '-')}-jobs-in-india",
            "companyName": "Naukri.com"
        }
    ]
