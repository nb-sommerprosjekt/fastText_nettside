import datetime
import json
import os
import pickle
import signal
import time
import urllib
import fasttext
from fastText import fastText

import PyPDF2
import classifier
import requests
import run_summarizer
from bs4 import BeautifulSoup
from flask import Flask
from flask import request
from flask_cors import CORS
from html2text import html2text
from MLP import MLP_model


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

def log_classification(text,res,st,total_time, pdf,url):

	id_article=str(time.time()*100).split(".")[0]
	if not os.path.exists("logs"):
		os.makedirs("logs")
	with open("logs/"+"meta-"+str(id_article)+".txt","w") as article_file:
		article_file.write("tidspunkt:::{}\n".format(str(st)))
		article_file.write("tid brukt:::{}\n".format(str(total_time)))
		article_file.write("artikkel id:::{}\n".format(id_article))
		article_file.write("pdf:::{}\n".format(pdf))
		article_file.write("url:::{}\n".format(url))

		article_file.write("klassifisering:\n")
		if res!=None:
			for i,line in enumerate(res):
				article_file.write("result:::{}:::{}\n".format((i),line))
	if not os.path.exists("texts"):
		os.makedirs("texts")
	with open("texts/" + str(id_article) + ".txt", "w") as text_file:
		text_file.write(text)
	return id_article

def run_classification(text, model):
	if model=="fasttext":
		result=fasttext_classifier.predict(text,3)
	elif model=="MLP":
		result=MLP_classifier.probability_prediction(text,  3)
	return result


@app.route('/rest_link/', methods = ['GET','POST'])
def read_text_url():
	try:


		global log_file
		start = time.time()
		st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')

		input_to_rest = request.json
		url = input_to_rest[0]
		MODEL = input_to_rest[1]
		PDF_boolean = input_to_rest[2]
		DOI_boolean = input_to_rest[3]

		if DOI_boolean:
			try:
				cookie = {"Cookie JSESSIONID=": "aaarp3yCRmLzTatzMpt0v"}
				res = requests.get(str("http://dx.doi.org/" + str(url)), cookies=cookie)
				url = res.url
				print("URL from the DOI: {}".format(url))
			except Exception as e:
				print(e)
				log_file.write(e)
				return json.dump(["doi"])
		url_decoded = urllib.parse.unquote(url)
		# Fikser urler som ikke er fullstendige. Altså mangler "http://".
		url_decoded = urllib.parse.urlunparse(urllib.parse.urlparse(url_decoded, scheme='http'))
		url_decoded = url_decoded.replace('///', '//')

		if PDF_boolean:
			try:
				clean=retrieve_pdf_text(url_decoded)
			except Exception as e:
				print(e)
				raise type(e)(e.message + "The PDF-download failed!")
		else:
			r = requests.get(url_decoded)
			soup = BeautifulSoup(r.text)
			streng = soup.get_text()
			streng.encode('utf8')
			clean = html2text(streng)


		res = run_classification(clean,MODEL)
		total_time = time.time() - start

		article_id = log_classification(clean, res, st, total_time, PDF_boolean, url)
		log_file.write("tidspunkt:::" + str(st) + '\n'
		               + "url:::"+ str(url) + "\n"
		               + "article id:::"+ str(article_id) + "\n"
		               + "Tid brukt:::" + str(total_time)
		               + str(res) + "\n" + "\n\n")


		return json.dumps([res, article_id])
	except Exception as e:
		print(e)
		return json.dumps(["Noe gikk galt"])

@app.route('/rest_text/', methods = ['GET','POST'])
def read_text():
	try:
		input_to_rest = request.json
		#print(request.json)
		text=input_to_rest[0]
		MODEL=input_to_rest[1]
		global log_file
		start = time.time()
		st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
		text.encode('utf8')

		res = run_classification(text, MODEL)


		total_time = time.time() - start

		article_id = log_classification(text, res, st, total_time, False, None)
		log_file.write("tidspunkt:::" + str(st) + '\n'
		               + "tekstlengde:::" + str(len(text)) + "\n"
		               + "article id:::" + str(article_id) + "\n"
		               + "Tid brukt:::" + str(total_time) + "\n"
		               + str(res) + "\n" + "\n\n")


		return json.dumps([res, article_id]	)

	except Exception as e:
		print(e)
		return json.dumps(["Noe gikk galt"])

@app.route('/rest_feedback/', methods=['POST'])
def post_feedback():
	input_to_rest = request.json
	print(input_to_rest)
	article_id=input_to_rest[1]
	button_id=input_to_rest[2]
	print(article_id)
	feedback=input_to_rest[0]
	with open("logs/"+"meta-"+article_id+".txt","a") as article:
		article.write("button feedback:::{}:::{}\n".format(button_id,feedback))
	return ""


@app.route('/rest_summarize/', methods = ['GET','POST'])
def summarize_text():
	try:
		text = request.json
		#print(request.json)
		global log_file
		start = time.time()
		st = datetime.datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
		text.encode('utf8')
		result= run_summarizer.summarize_text(text)

		total_time = time.time() - start

		article_id = log_classification(text, None, st, total_time, False, None)
		return json.dumps([result,article_id])

	except Exception as e:
		print(e)
		return json.dumps(["Noe gikk galt"])
	#return request.json
if __name__ == '__main__':
	init()
	with open("klassebetegnelser_dict2209_alldigits.pckl", "rb") as open_file:
		klassebetegnelser = pickle.load(open_file)
	fasttext_name = "model_final2.bin"
	fasttext_classifier=fastText(fasttext_name,klassebetegnelser)
	MLP_classifier=MLP_model(klassebetegnelser)


	original_sigint = signal.getsignal(signal.SIGINT)
	signal.signal(signal.SIGINT, finito)
	app.run(debug=True, host='0.0.0.0', port=5000)
	finito()

