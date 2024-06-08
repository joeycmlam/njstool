import json
import argparse
import os
from dotenv import load_dotenv
import json

from contentManager import URLContentManager
from aiAdvisor import AIAdvisor


class AppAdvisor:
    def __init__(self, config_path):
        # Load JSON data from a file
        with open(config_path) as f:
            self.data = json.load(f)

        # Extract the URL list from the JSON data
        urls = self.data['URL_LIST']
        # Extract the location of the .env.local file from the JSON data
        self.env_location = self.data['env_location']
        self.model = self.data['model']

        # Load the .env.local file from the extracted location
        load_dotenv(self.env_location)

        # Now you can access the environment variables using os.environ.get()
        self.openai_api_key = os.environ.get('OPENAI_API_KEY')

        # Create a URLContentManager and load or fetch content
        self.url_content_manager = URLContentManager(urls)
        self.url_content_manager.load_or_fetch_content()

        # Concatenate all the text contents from all URLs
        self.all_contents = self.url_content_manager.get_all_contents()

        # Create an instance of AIAdvisor
        self.ai_advisor = AIAdvisor(self.all_contents, self.openai_api_key, self.model)

    def run(self):
        while True:
            question = input("What is your question? (Type 'bye' to exit) ")
            if question.lower() == 'bye':
                break
            answer = self.ai_advisor.get_answer_from_chatgpt(question, self.all_contents)
            print(f"Answer: {answer}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True, help='Path to the configuration file')
    args = parser.parse_args()

    app_advisor = AppAdvisor(args.config)
    app_advisor.run()