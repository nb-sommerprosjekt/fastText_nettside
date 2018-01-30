import numpy as np



def calculate_labels_prediction(predictions, k_preds,inverted_labels_indexes):
	all_topk_labels = []
	for prediction_array in predictions:
		np_prediction = np.argsort(-prediction_array)[:k_preds]
		for np_pred in np_prediction:
			all_topk_labels.append(inverted_labels_indexes[np_pred])
	return all_topk_labels