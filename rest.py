import requests
from bs4 import BeautifulSoup
from flask import Flask
from flask_cors import CORS
from html2text import html2text
import urllib.parse

import fasttext
import classifier
import preprocessor
import time
import datetime
app = Flask(__name__)
CORS(app)

@app.route('/rest_doc/<path:url>', methods = ['GET'])
def read_text_url(url):
    start = time.time()
    st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
    log_file = open("log_file.txt", "a")

    url_decoded =urllib.parse.unquote(url)

    r = requests.get(url_decoded)
    soup = BeautifulSoup(r.text)
    streng = soup.get_text()
    streng.encode('utf8')
    clean = html2text(streng)
<<<<<<< HEAD
    res = classifier.run_classification(clean,classifier)
=======
    res = classifier.run_classification(clean)

>>>>>>> 986ecdb39bb67daa980c2f572c8318aeeb5bc180
    total_time = time.time()- start

    log_file.write("Tidspkt:"+str(st)+'\n\n'+"url:::"
                   +str(url_decoded)+"\n"+"\n"
                   +str(res)+"\n"+"\n"
                   +"Tid brukt:"+str(total_time)+"\n"+"\n"
                   +"Tekst brukt til klassifisering:"+'\n'+'\n'
                   +str(preprocessor.text_to_clean_stemmed_text(clean,False)))

    return res





if __name__ == '__main__':
    app.run(debug = True)
    classifier_name = "model_final100.bin"
    classifier = fasttext.load_model(classifier_name)
