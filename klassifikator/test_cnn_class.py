from CNN import CNN_model
import time
import pickle
import gc

with open("klassebetegnelser_dict2209_alldigits.pckl", "rb") as open_file:
	klassebetegnelser = pickle.load(open_file)


tid=time.time()
test=CNN_model("config/cnn.yml",klassebetegnelser)
print("det tok:",time.time()-tid)
tid=time.time()


for i in range(1):
	if i%100==0:
		print(i)
	test.predict("Heisann, dette er en prøve tekst, ikkje les for mye inn i den. ",3)
print("det tok:",time.time()-tid)
gc.collect()
