import os
import time
import pickle
from sourceData import SourceData

class URLContentManager:
    def __init__(self, urls):
        self.urls = urls
        self.filename = 'data/url_contents.pkl'
        self.url_contents = {}
        self.source_data = SourceData()

    def load_or_fetch_content(self):
        if self._should_refresh_content():
            self._fetch_and_store_content()
        else:
            self._load_content()

    def get_all_contents(self):
        return " ".join(self.url_contents.values())

    def _should_refresh_content(self):
        if os.path.exists(self.filename):
            file_time = os.path.getmtime(self.filename)
            current_time = time.time()
            return (current_time - file_time) // (24 * 3600) >= 1
        return True

    def _fetch_and_store_content(self):
        for url in self.urls:
            html_content = self.source_data.fetch_url_content(url)
            if html_content:
                text_content = self.source_data.extract_datasource_url(html_content)
                self.url_contents[url] = text_content
            else:
                self.url_contents[url] = "Content could not be fetched"
        with open(self.filename, 'wb') as f:
            pickle.dump(self.url_contents, f)

    def _load_content(self):
        with open(self.filename, 'rb') as f:
            self.url_contents = pickle.load(f)