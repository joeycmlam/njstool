import json
from sourceData import fetch_url_content_with_subpages, extract_datasource_url, fetch_url_content
from aiAdvisor import get_answer_from_chatgpt
from advisor import get_answer_nlp

def main():
    # Load JSON data from a file
    with open('config/config.json') as f:
        data = json.load(f)

    # Extract the URL list from the JSON data
    urls = data['URL_LIST']

    # Create a dictionary to store URL and its extracted content
    url_contents = {}
    for url in urls:
        html_content = fetch_url_content(url)
        if html_content:
            text_content = extract_datasource_url(html_content)
            url_contents[url] = text_content
        else:
            url_contents[url] = "Content could not be fetched"

    # Concatenate all the text contents from all URLs
    all_contents = " ".join(url_contents.values())

    while True:
        question = input("What is your question? (Type 'bye' to exit) ")
        if question.lower() == 'bye':
            break
        # Use all_contents as the context for the question
        # answer = get_answer_from_chatgpt(question, all_contents)
        # print(answer.choices[0].message.content)
        answer = get_answer_nlp(question, all_contents)
        print(f"Answer: {answer}")

if __name__ == "__main__":
    main()