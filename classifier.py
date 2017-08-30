import fasttext
from preprocessor import text_to_clean_stemmed_text
import time




def run_classification(text,classifier,k):

    #To debug run time
    tid=time.time()

    text= text_to_clean_stemmed_text(text,True)

    #Load pre-trained model

    results= classifier.predict_proba([text],k=k)


    for i in range(len(results[0])):
        results[0][i]=list(results[0][i])
        results[0][i][0]=results[0][i][0].replace("__label__","")
        results[0][i][1]="{:0.4f}".format(results[0][i][1])

    #returns list of 10 lists, where each list contains a label and likeliness.
    print(time.time()-tid)
    return results[0]



def format_output(results):

    result="This is the most likely 3-digit labels:\n"

    for label in results:
        result+="Label: {} Confidence: {:2.2f}% \n".format(str(label[0]),float(label[1])*100)

    return result
