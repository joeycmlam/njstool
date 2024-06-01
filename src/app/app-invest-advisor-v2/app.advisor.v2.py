from sourceData import fetch_url_content, extract_text_from_html
from aiAdvisor import get_answer_from_chatgpt

def main(urls):
    # Create a dictionary to store URL and its extracted content
    url_contents = {}
    for url in urls:
        html_content = fetch_url_content(url)
        if html_content:
            text_content = extract_text_from_html(html_content)
            url_contents[url] = text_content
        else:
            url_contents[url] = "Content could not be fetched"

    # while True:
    #     url = input("Enter the URL from the list you want to ask about, or type 'exit' to quit: ")
    #     if url == 'exit':
    #         break
    #     if url not in url_contents:
    #         print("URL not recognized or content not available. Please try another URL.")
    #         continue

        question = input("What is your question? ")
        for url in urls:
            context = url_contents[url]
            answer = get_answer_from_chatgpt(question, context)
            print(answer.choices[0].message.content)


if __name__ == "__main__":
    URL_LIST = [
        "https://www.manulifeim.com.hk/en/funds/fund-prices.html",
        # "https://www.morningstar.com/stocks/10-best-companies-invest-now"
        # Add other URLs as needed
    ]
    main(URL_LIST)