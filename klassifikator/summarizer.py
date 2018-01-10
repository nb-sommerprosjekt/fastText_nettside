
#!/usr/bin/env python
# -*- coding: utf8 -*-
from summa import summarizer
import sys

with open(sys.argv[1], "r") as d:
    text=d.read()
with open("summarizer_output.txt","w") as f:
    text = summarizer.summarize(text, words=int(sys.argv[2]), language="norwegian")
    if text!="":
        f.write(text)
    else:
        f.write("Beklager, men teksten er nok for lang til at den kunne oppsumeres. Teksten boer helst ikke vaere mer enn 5000 ord")