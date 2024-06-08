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

class SourceData:
    def fetch_url_content(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Error fetching URL: {e}")
            return None

    def fetch_url_content_with_subpages(self, url):
        try:
            main_page_content = self.fetch_url_content(url)
            soup = BeautifulSoup(main_page_content, 'html.parser')
            links = soup.find_all('a')
            if not links:
                return main_page_content
            subpages_content = []
            for link in links:
                subpage_url = link.get('href')
                if subpage_url is None:
                    continue
                if not subpage_url.startswith('http'):
                    subpage_url = urljoin(url, subpage_url)
                subpage_content = self.fetch_url_content(subpage_url)
                subpages_content.append(subpage_content)
            return subpages_content
        except requests.RequestException as e:
            print(f"Error fetching URL: {e}")
            return None

    def extract_datasource_url(self, url):
        result = self.extract_text_from_html(url)
        return result

    def extract_text_from_html(self, url):
        soup = BeautifulSoup(url, 'html.parser')
        html_content = ' '.join(p.get_text() for p in soup.find_all('p'))
        return html_content

    def extract_text_from_javascript_html(self, url):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        webdriver_service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
        html_content = driver.page_source
        driver.quit()
        return html_content