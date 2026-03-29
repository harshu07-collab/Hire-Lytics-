import os
from pathlib import Path
from dotenv import load_dotenv
from apify_client import ApifyClient

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
client = ApifyClient(APIFY_TOKEN) if APIFY_TOKEN else None

# Prepare the Actor input
def jobs(title):
    if not client:
        raise RuntimeError("APIFY_API_TOKEN is not set")
    run_input = {
        "title": title,
        "location": "India",
        "companyName": [],
        "companyId": [],
        "publishedAt": "",
        "rows": 10,
        "proxy": {
            "useApifyProxy": True,
            "apifyProxyGroups": [],
        },
    }

    # Run the Actor and wait for it to finish
    run = client.actor("BHzefUZlZRKWxkTck").call(run_input=run_input)

    # Fetch and print Actor results from the run's dataset (if there are any)
    items = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        items.append({
            "title": item.get("title", ""),
            "jobUrl": item.get("jobUrl", ""),
            "companyName": item.get("companyName", ""),
        })

    return items
