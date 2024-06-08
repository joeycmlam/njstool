from openai import OpenAI

class AIAdvisor:
    def __init__(self, data, key):
        # Load JSON data from a file
        # with open('config/config.json') as f:
        #     self.data = json.load(f)
        self.data = data
        self.openai_api_key = key

        # # Extract the location of the .env.local file from the JSON data
        # self.env_location = self.data['env_location']
        #
        # # Load the .env.local file from the extracted location
        # load_dotenv(self.env_location)
        #
        # # Now you can access the environment variables using os.environ.get()
        # self.openai_api_key = os.environ.get('OPENAI_API_KEY')

        self.client = OpenAI(api_key=self.openai_api_key)

    def get_answer_from_chatgpt(self, question, context):
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": context},
                {"role": "user", "content": question}
            ]
        )
        return response.choices[0].message.content