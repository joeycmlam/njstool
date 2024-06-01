from openai import OpenAI
import os
from dotenv import load_dotenv


def make_connection():
    load_dotenv('/Users/joeylam/repo/njs/njstool/env/.env.local')

    # Now you can access the environment variables using os.environ.get()
    openai_api_key = os.environ.get('OPENAI_API_KEY')

    client = OpenAI(api_key=openai_api_key)
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
        model="gpt-3.5-turbo",
    )

    return client

def get_answer_from_chatgpt(question, context):
    client = make_connection()
    response = client.ChatCompletion.create(
        model="text-davinci-003",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": context},
            {"role": "user", "content": question}
        ],
        max_tokens=150
    )
    return response['choices'][0]['message']['content'].strip()