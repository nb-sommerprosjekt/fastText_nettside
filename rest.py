import requests
import signal
from bs4 import BeautifulSoup
from flask import Flask
from flask import request
import fasttext
from flask_cors import CORS
from html2text import html2text
import urllib
import classifier
import preprocessor
import json
import PyPDF2



import time
import datetime

app = Flask(__name__)
CORS(app)

global log_file 


def init():
	global log_file
	log_file = open("log_file.txt", "a")
	start = time.time()
	st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
	log_file.write("Init Tidspkt:"+str(st))

	print("Init")
	
def finito(signum, frame):
	global log_file
	log_file.close()
	
	print("Finito")
	exit()

def retrieve_pdf_text(url):
    content = ""
    try:

        urllib.request.urlretrieve(url, "temp.pdf")
        with open("temp.pdf", 'rb') as f:
            pdfReader = PyPDF2.PdfFileReader(f)
            for page_num in range(pdfReader.getNumPages()):
                content += pdfReader.getPage(page_num).extractText()

    except Exception as e:
        print("FAILURE AT PDF CONVERTING")
        print(url)
        print(e)
        return e

    return str(content)


@app.route('/rest_link/', methods = ['GET','POST'])
def read_text_url():
	try:


		global log_file
		start = time.time()
		st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')

		input_to_rest = request.json
		url = input_to_rest[0]
		PDF_boolean = input_to_rest[1]
		url_decoded = urllib.parse.unquote(url)
		# Fikser urler som ikke er fullstendige. Altså mangler "http://".
		url_decoded = urllib.parse.urlunparse(urllib.parse.urlparse(url_decoded, scheme='http'))
		url_decoded = url_decoded.replace('///', '//')

		if PDF_boolean:
			try:
				clean=retrieve_pdf_text(url_decoded)
			except Exception as e:
				print("The PDF-download failed!")
		else:
			r = requests.get(url_decoded)
			soup = BeautifulSoup(r.text)
			streng = soup.get_text()
			streng.encode('utf8')
			clean = html2text(streng)


		res = classifier.run_classification(clean, classifieren, 3)

		total_time = time.time() - start

		log_file.write("Tidspkt:" + str(st) + '\n\n' + "url:::"
					   + str(url_decoded) + "\n" + "\n"
					   + str(res) + "\n" + "\n"
					   + "Tid brukt:" + str(total_time) + "\n" + "\n"
					   + "Tekst brukt til klassifisering:" + '\n' + '\n'
					   + str(preprocessor.text_to_clean_stemmed_text(clean, False)))

		return json.dumps(res)
	except Exception as e:
		print(e)
		return json.dumps("Noe gikk galt")

@app.route('/rest_text/', methods = ['GET','POST'])

def read_text():
	try:
		text = request.json
		#print(request.json)
		global log_file
		start = time.time()
		st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
		text.encode('utf8')

		res = classifier.run_classification(text, classifieren, 3)


		total_time = time.time() - start


		log_file.write("Tidspkt:" + str(st) + '\n\n' + "url:::"
					   + str(text) + "\n" + "\n"
					   + str(res) + "\n" + "\n"
					   + "Tid brukt:" + str(total_time) + "\n" + "\n"
					   + "Tekst brukt til klassifisering:" + '\n' + '\n'
					   )

		return json.dumps(res)

	except Exception as e:
		return json.dumps("Noe gikk galt")

	#return request.json
if __name__ == '__main__':
	init()
	classifier_name = "model_final2.bin"
	classifieren = fasttext.load_model(classifier_name)
	original_sigint = signal.getsignal(signal.SIGINT)
	signal.signal(signal.SIGINT, finito)
	app.run(debug=True, host='0.0.0.0', port=5000)
	finito()

