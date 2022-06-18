from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# calculate the negative, positive, neutral and compound scores, plus verbal evaluation
def sentiment_vader(sentence):

    # Create a SentimentIntensityAnalyzer object.
    sid_obj = SentimentIntensityAnalyzer()

    sentiment_dict = sid_obj.polarity_scores(sentence)
    negative = sentiment_dict['neg']
    neutral = sentiment_dict['neu']
    positive = sentiment_dict['pos']
    compound = sentiment_dict['compound']

    if sentiment_dict['compound'] >= 0.05:
        overall_sentiment = "Positive"

    elif sentiment_dict['compound'] <= - 0.05:
        overall_sentiment = "Negative"

    else:
        overall_sentiment = "Neutral"

    return negative, neutral, positive, compound, overall_sentiment


   
def emotion(compound,rating):

    if compound >= 0.4:
        rating['most_recommend']+=1
        return "most recommended "
    elif compound >=0.3:
        rating['popular']+=1
        return "popular" 
    elif compound >=0.2:
        rating['good']+=1
        return "good"
    elif compound >=0.1:
        rating['optimistic']+=1
        return "optimistic"             
    elif compound >=0.0:
        rating['neutral']+=1
        return "neutral"
    elif compound <=-0.5:
        rating['very_bad']+=1
        return "very bad" 
    elif compound <=-0.4:
        rating['bad']+=1
        return "bad" 
    elif compound <=-0.3:
        rating['stressful']+=1
        return "stressful" 
    elif compound <=-0.2:
        rating['gross']+=1
        return "gross"                 
    elif compound <=-0.1:
        rating['not_recommend']+=1
        return "not recommended" 