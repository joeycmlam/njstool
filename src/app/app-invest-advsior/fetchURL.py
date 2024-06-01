import requests
from bs4 import BeautifulSoup

def fetch_url_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None

def extract_text_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    # Extract text from paragraph tags or other relevant content
    text = ' '.join(p.get_text() for p in soup.find_all('p'))
    return text