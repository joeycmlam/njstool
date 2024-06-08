import json
import argparse
from contentManager import URLContentManager
from aiAdvisor import get_answer_from_chatgpt

class AppAdvisor:
    def __init__(self, config_path):
        # Load JSON data from a file
        with open(config_path) as f:
            data = json.load(f)

        # Extract the URL list from the JSON data
        urls = data['URL_LIST']

        # Create a URLContentManager and load or fetch content
        self.url_content_manager = URLContentManager(urls)
        self.url_content_manager.load_or_fetch_content()

        # Concatenate all the text contents from all URLs
        self.all_contents = self.url_content_manager.get_all_contents()

    def run(self):
        while True:
            question = input("What is your question? (Type 'bye' to exit) ")
            if question.lower() == 'bye':
                break
            answer = get_answer_from_chatgpt(question, self.all_contents)
            print(f"Answer: {answer}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True, help='Path to the configuration file')
    args = parser.parse_args()

    app_advisor = AppAdvisor(args.config)
    app_advisor.run()