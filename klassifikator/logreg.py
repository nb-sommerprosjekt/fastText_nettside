import dill
import time
import numpy as np
import yaml


class logreg_model():
	def __init__(self, pathToConfigFile, klassebetegnelser):
		self.klassebetegnelser = klassebetegnelser
		self.load_config(pathToConfigFile=pathToConfigFile)
		self.model = None

		self.vectorizer = None
		self.load_sklearn_model(self.logregModelPath, self.logregVectorizerPath)
		self.probabilities = None
		self.deweys = None
		self.result_klassebetegnelser = []
		self.k = None
		self.results = None

	def load_config(self, pathToConfigFile):
		with open(pathToConfigFile, "r") as file:
			self.config = yaml.load(file)
		self.logregModelPath=self.config["logregModelPath"]
		self.logregVectorizerPath = self.config["logregVectorizerPath"]


	def load_sklearn_model(self, model_path, vectorizer_path):
		with open(model_path, "rb") as model_file:
			self.model = dill.load(model_file)
		with open(vectorizer_path, "rb") as vectorizer_file:
			self.vectorizer = dill.load(vectorizer_file)

	def predict(self, text, k):
		tid = time.time()
		klassebetegnelse_topk = []
		prediction_test = self.vectorizer.transform([text])
		self.k = k
		self.getLabelsAndProbabilities(prediction_test)
		self.getKlassebetegnelser()
		self.makeResultVector()
		return self.results

	def getLabelsAndProbabilities(self, vectorized_test_text):
		predictions = []
		if vectorized_test_text.shape[0] > 0 and vectorized_test_text.shape[0] > 0 and self.model is not None:
			for text in vectorized_test_text:
				predictions.append(self.model.predict(text))
				pred_proba = self.model.predict_proba(text)
				sorted_probs = sorted(pred_proba[0], reverse=True)[:self.k]
				topN_prob_indexes = np.argsort(pred_proba)[:, :-self.k - 1:-1]

				self.deweys = self.model.classes_[topN_prob_indexes[0]]
				self.probabilities = sorted_probs

	def getKlassebetegnelser(self):
		for val in self.deweys:
			self.result_klassebetegnelser.append(self.klassebetegnelser[val])

	def makeResultVector(self):
		result_vector = []
		for i in range(self.k):
			result_vector.append([[self.deweys[i]], [self.probabilities[i]], [self.result_klassebetegnelser[i]]])
		self.results = result_vector