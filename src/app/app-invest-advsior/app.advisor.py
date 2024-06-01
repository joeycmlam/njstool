from fetchURL import fetch_url_content, extract_text_from_html
from advisor import answer_question

def main(url, question):
    html_content = fetch_url_content(url)
    if html_content:
        text_content = extract_text_from_html(html_content)
        answer = answer_question(question, text_content)
        print(f"Answer: {answer}")
    else:
        print("Failed to retrieve content.")

if __name__ == "__main__":
    URL = "https://www.morningstar.com"  # Replace with the actual URL
    QUESTION = "What is the main topic of the article?"  # Replace with your question
    main(URL, QUESTION)