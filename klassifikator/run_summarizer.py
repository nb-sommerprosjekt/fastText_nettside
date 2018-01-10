import os
from preprocessor import simple_preprocessing
import os

from preprocessor import simple_preprocessing


#!/usr/bin/env python3

def summarize_text(text):
    text=simple_preprocessing(text)
    with open("temp.txt","w") as f:
        f.write(text)
    length=summarize_length(word_count(text))
    print(len(text))
    command = "python2 summarizer.py " + "temp.txt " + str(length)
    try:
        os.system(command)
    except Exception as e:
        return e
    with open("summarizer_output.txt", "r") as f:
        summary = f.read()

    print("Hei, dette er oppsummeringen: " + str(summary))
    return summary

def word_count(text):
    return len(text.split(" "))

def summarize_length(length):
    length=int(length*0.15)
    length=max(length,200)
    length=min(length,1000)

    #hardcoded:
    length=150
    return length
