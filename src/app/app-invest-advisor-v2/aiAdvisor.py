from openai import OpenAI

class AIAdvisor:
    def __init__(self, data, key, model):
        self.data = data
        self.openai_api_key = key
        self.model = model
        self.client = OpenAI(api_key=self.openai_api_key)

    def get_answer_from_chatgpt(self, question, context):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": context},
                {"role": "user", "content": question}
            ]
        )
        return response.choices[0].message.content