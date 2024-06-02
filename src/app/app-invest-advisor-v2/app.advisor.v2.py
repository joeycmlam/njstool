import json
from contentManager import URLContentManager
from aiAdvisor import get_answer_from_chatgpt



def main():
    # Load JSON data from a file
    with open('config/config.json') as f:
        data = json.load(f)

    # Extract the URL list from the JSON data
    urls = data['URL_LIST']

    # Create a URLContentManager and load or fetch content
    url_content_manager = URLContentManager(urls)
    url_content_manager.load_or_fetch_content()

    # Concatenate all the text contents from all URLs
    all_contents = url_content_manager.get_all_contents()

    while True:
        question = input("What is your question? (Type 'bye' to exit) ")
        if question.lower() == 'bye':
            break
        answer = get_answer_from_chatgpt(question, all_contents)
        print(f"Answer: {answer}")

if __name__ == "__main__":
    main()