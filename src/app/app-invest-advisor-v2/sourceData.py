from telnetlib import EC

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains

def fetch_url_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None

def fetch_url_content_with_subpage(url):
    try:
        # Fetch the main page content
        response = requests.get(url)
        response.raise_for_status()
        main_page_content = response.text

        # Parse the main page content with BeautifulSoup
        soup = BeautifulSoup(main_page_content, 'html.parser')

        # Find the sub-page link
        subpage_link = soup.find('a')

        # If there's no sub-page link, return the main page content
        if subpage_link is None:
            return main_page_content

        # Get the href attribute of the sub-page link
        subpage_url = subpage_link.get('href')

        # If there's no href attribute, return the main page content
        if subpage_url is None:
            return main_page_content

        # If the sub-page URL is a relative URL, convert it to an absolute URL
        if not subpage_url.startswith('http'):
            subpage_url = urljoin(url, subpage_url)

        # Fetch the sub-page content
        response = requests.get(subpage_url)
        response.raise_for_status()
        subpage_content = response.text

        return subpage_content

    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None

def extract_datasource_url(url):
    result = extract_text_from_html(url)
    return result

def extract_text_from_html(url):
    soup = BeautifulSoup(url, 'html.parser')
    html_content = ' '.join(p.get_text() for p in soup.find_all('p'))
    return html_content



def extract_text_from_javascript_html(url):
    # Setup chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ensure GUI is off
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Set path to chromedriver as per your configuration
    webdriver_service = Service(ChromeDriverManager().install())

    # Choose Chrome Browser
    driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)
    driver.get(url)

    # Wait for the page to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))

    html_content = driver.page_source

    driver.quit()

    return html_content