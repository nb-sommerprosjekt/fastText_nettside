import os
import pickle
import re
import numpy as np
import tensorflow as tf
from keras.models import Sequential, load_model
from keras.preprocessing.sequence import pad_sequences
from sklearn.metrics import accuracy_score


def prediction(MODEL,X_TEST,k_preds, label_indexes):
	global graph
	with graph.as_default():
		predictions = MODEL.predict_proba(x=X_TEST)
	all_topk_labels = []
	for prediction_array in predictions:
		np_prediction = np.argsort(-prediction_array)[:k_preds]
		print(list(np_prediction))
		topk_labels = []
		for np_pred in np_prediction:

			for label_name, label_index in label_indexes.items():

				if label_index == np_pred:
					label = label_name
					topk_labels.append(label)

			all_topk_labels.append(topk_labels)
			#print(len(topk_labels))
	#print(all_topk_labels)

	return all_topk_labels

def calculate_labels_prediction(predictions, k_preds,inverted_labels_indexes):
	all_topk_labels = []
	for prediction_array in predictions:

		np_prediction = np.argsort(-prediction_array)[:k_preds]
		#print(list(np_prediction))
		topk_labels = []

		for np_pred in np_prediction:
			all_topk_labels.append(inverted_labels_indexes[np_pred])
	print(all_topk_labels)
	return all_topk_labels


class MLP_model(object):

	def __init__(self,klassebetegnelser):
		self.klassebetegnelser =klassebetegnelser
		#might wanna change the reference to t
		self.model_directory="mlp-20000-5000-10-201801081034"
		self.model = load_model(os.path.join(self.model_directory, 'model.bin'))
		global graph
		graph = tf.get_default_graph()
		with open(os.path.join(self.model_directory, "tokenizer.pickle"), 'rb') as handle:
			self.tokenizer = pickle.load(handle)
		# Loading parameters like max_sequence_length, vocabulary_size and vectorization_type
		with open(os.path.join(self.model_directory, "model_stats"), 'r') as params_file:
			self.params_data = params_file.read()

			self.re_max_seq_length = re.search('length:(.+?)\n', self.params_data)
		with open(os.path.join(self.model_directory, "label_indexes.pickle"), 'rb') as handle:
			self.labels_index = pickle.load(handle)

		if self.re_max_seq_length:
			self.maxSequenceLength = int(self.re_max_seq_length.group(1))
			print("Max sequence length:{}".format(self.maxSequenceLength))
		self.re_vocab_size = re.search('size:(.+?)\n', self.params_data)
		if self.re_vocab_size:
			self.vocabSize = int(self.re_vocab_size.group(1))
			print("Vocabulary size: {}".format(self.vocabSize))

		self.re_vectorization_type = re.search('type:(.+?)\n', self.params_data)
		if self.re_vectorization_type:
			self.vectorizationType = self.re_vectorization_type.group(1)
			print("This utilizes the vectorization: {}".format(str(self.vectorizationType)))
		self.inverted_labels_indexes={}
		for i in self.labels_index.keys():
			self.inverted_labels_indexes[self.labels_index[i]]=i

	def predict(self,text,k_output_labels):
		x_test = self.text2mlp(text, self.maxSequenceLength, self.tokenizer,
		                       self.vectorizationType)
		self.predictions = prediction(self.model, x_test, k_output_labels, self.labels_index)
		return self.predictions

	def probability_prediction(self,text, k):
		text = self.text2mlp(text, self.maxSequenceLength, self.tokenizer,
		                       self.vectorizationType)
		try:
			predictions = []
			topN_predictions_probabilities = []
			accuracy = 0
			topN_temp = []
			global graph
			with graph.as_default():
				predictions=self.model.predict(text)
				pred_proba = self.model.predict_proba(text)
			n = k

			for prediction_array in pred_proba:
				topN_prob_indexes = np.argsort(-prediction_array)[:k]

			for val in topN_prob_indexes:
				topN_predictions_probabilities.append(pred_proba[0][val])
			topN_predictions=calculate_labels_prediction(predictions,k,self.inverted_labels_indexes)
			result=[]


			for i in range(len(topN_predictions)):
				result.append([])
				result[i].append(topN_predictions[i])
				result[i].append(str(topN_predictions_probabilities[i]))
				result[i].append(self.klassebetegnelser.get(str(topN_predictions[i])))
			print(result)
			return result
		except Exception as e:
			print(e)


	def text2mlp(self, text, maxSequenceLength, tokenizer, vectorizationType):
		test_sequences = tokenizer.texts_to_sequences([text])
		test_sequence_matrix = tokenizer.sequences_to_matrix(test_sequences, mode=vectorizationType)

		test_text = pad_sequences(test_sequence_matrix, maxlen=maxSequenceLength)
		return test_text
