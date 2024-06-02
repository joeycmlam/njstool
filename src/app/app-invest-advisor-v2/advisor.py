from transformers import pipeline

def get_answer_nlp(question, context):
    model_name = "bert-large-uncased-whole-word-masking-finetuned-squad"
    nlp = pipeline("question-answering", model=model_name, tokenizer=model_name)
    return nlp({
        'question': question,
        'context': context
    })['answer']
