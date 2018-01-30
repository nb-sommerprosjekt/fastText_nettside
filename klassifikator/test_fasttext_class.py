from fastText import fastText
import pickle

with open("klassebetegnelser_dict2209_alldigits.pckl", "rb") as open_file:
	klassebetegnelser = pickle.load(open_file)
fasttext_name = "model_final2.bin"
fasttext_classifier = fastText(fasttext_name, klassebetegnelser)


print(fasttext_classifier.predict("dette er en test text",3))