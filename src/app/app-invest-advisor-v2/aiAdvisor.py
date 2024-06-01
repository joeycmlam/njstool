from openai import OpenAI
import os
from dotenv import load_dotenv

def make_connection():
    load_dotenv('/Users/joeylam/repo/njs/njstool/env/.env.local')

    # Now you can access the environment variables using os.environ.get()
    openai_api_key = os.environ.get('OPENAI_API_KEY')

    client = OpenAI(api_key=openai_api_key)

    return client

def get_answer_from_chatgpt(question, context):
    client = make_connection()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": context},
            {"role": "user", "content": question}
        ]
    )
    return response