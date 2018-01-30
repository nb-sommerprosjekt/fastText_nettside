from logreg import logreg_model

import time
import pickle
import gc

with open("klassebetegnelser_dict2209_alldigits.pckl", "rb") as open_file:
	klassebetegnelser = pickle.load(open_file)


tid=time.time()
test=logreg_model("config/logreg.yml")
print("det tok:",time.time()-tid)
tid=time.time()


for i in range(1):
	if i%100==0:
		print(i)
	test.predict("Heisann, dette er en prøve tekst, ikkje les for mye inn i den. dette er enda lengre enn det det har pleid å være før",3)
print("det tok:",time.time()-tid)
gc.collect()