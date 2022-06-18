from collections import Counter
from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api, Resource
from .sentiment_analysis.services.sentiment_helper import sentiment_vader, emotion
from googletrans import Translator

app = Flask(__name__)
CORS(app)
api = Api(app, title="Sentiment Analysis")
# run_with_ngrok(app)


@api.route('/api/sentiment_response')
class Sentiment(Resource):

    def get(self):
        # translator = Translator()
        # sentence = "App sirf windows banatey hain yaa gate bhe banatey hain, Naam app ka gate hai banatey app wind"
        # x = translator.translate(sentence)
        # print(x.text)

        return {'hello': 'world'}

    def post(self):
        try:
            _rating = {
                'most_recommend': 0,
                'popular': 0,
                'good': 0,
                'optimistic': 0,
                'neutral': 0,
                'very_bad': 0,
                'bad': 0,
                'stressful': 0,
                'gross': 0,
                "not_recommend": 0
            }
            array = []
            top_comments = []
            translator = Translator()
            data = request.get_json()
            # print(translator.translate(item))
            # english_array.append(translator.translate(item).text)
            compound = 0
            for key, item in data.items():
                item = remove_duplicates(item)
                item_score = sentiment_vader(item)
                emotion(item_score[3], _rating)
                compound += item_score[3]
                array.append(sentiment_vader(item))
                temp_Array = []
                temp_Array.append(key)
                temp_Array.append(sentiment_vader(item))
                top_comments.append(temp_Array)
            print(sort_comments(top_comments, data))
            return {"result": emotion(compound, _rating), "rating": rating_per(_rating), "top_comment": sort_comments(top_comments, data)}

        except Exception as e:
            print(e)
            return ""


def sort_comments(compound, text):
    top_comment = []
    count = 0
    compound.sort(key=lambda x: x[1][3], reverse=True)
    for item in text.values():
        top_comment.append(item)
        count += 1
        if count == 10:
            break
    return top_comment


def remove_duplicates(input):
    input = input.split(" ")
    UniqW = Counter(input)
    s = " ".join(UniqW.keys())
    return s


def rating_per(rating):
    sum = 0
    for v in rating.values():
        sum = sum+v
    print(sum)
    for k in rating.keys():
        rating[k] = (rating[k]*100/sum)
    return rating


# if __name__ == "__main__":
    # app.run()
