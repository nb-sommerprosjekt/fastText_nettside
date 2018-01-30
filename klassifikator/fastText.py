import fasttext
import time
import os
from preprocessor import text_to_clean_stemmed_text

class fastText():
	def __init__(self,fasttext_name,klassebetegnelser):
		self.model = fasttext.load_model(os.path.join("fastText_model",fasttext_name))
		self.klassebetegnelser =klassebetegnelser

	def predict(self,text,k):
		# To debug run time

		locals()
		tid = time.time()
		klassebetegnelser_topk = []

		try:
			text = text_to_clean_stemmed_text(text, True,False)

			# Load pre-trained model

			results = self.model.predict_proba([text], k=k)

			for i in range(len(results[0])):
				results[0][i] = list(results[0][i])
				results[0][i][0] = results[0][i][0].replace("__label__", "")
				results[0][i][1] = "{:0.4f}".format(results[0][i][1])
				results[0][i].append(self.klassebetegnelser.get(str(results[0][i][0])))

			# returns list of 10 lists, where each list contains a label and likeliness.
			print(time.time() - tid)
			return results[0]
		except Exception as e:
			return Exception("Noe gikk galt i klassifikasjonen.")