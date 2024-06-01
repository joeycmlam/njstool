import json
from sourceData import fetch_url_content, extract_text_from_html
from aiAdvisor import get_answer_from_chatgpt

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
            text_content = extract_text_from_html(html_content)
            url_contents[url] = text_content
        else:
            url_contents[url] = "Content could not be fetched"

        question = input("What is your question? ")
        for url in urls:
            context = url_contents[url]
            answer = get_answer_from_chatgpt(question, context)
            print(answer.choices[0].message.content)


if __name__ == "__main__":
    main()