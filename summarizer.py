from summa import summarizer
import sys

with open(sys.argv[1], "r") as d:
    text=d.read()
with open("summarizer_output.txt","w") as f:
    #

    f.write(summarizer.summarize(text,words=int(sys.argv[2]), language="norwegian"))