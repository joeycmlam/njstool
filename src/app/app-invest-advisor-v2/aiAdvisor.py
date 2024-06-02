from openai import OpenAI
import os
from dotenv import load_dotenv
import json

def make_connection():
    # Load JSON data from a file
    with open('config/config.json') as f:
        data = json.load(f)

    # Extract the location of the .env.local file from the JSON data
    env_location = data['env_location']

    # Load the .env.local file from the extracted location
    load_dotenv(env_location)

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
    return response.choices[0].message.content