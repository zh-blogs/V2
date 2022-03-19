import json
import requests

with open('data.json', 'r', encoding='utf8') as json_file:
    json_data = json.load(json_file)
    
for index in range(len(json_data)):
    print("Checking:", json_data[index]["url"], end = " ")
    try:
        res = requests.get(json_data[index]["url"])
        if res.status_code == 200:
            json_data[index]["status"] = "OK"
            print("[ OK ]")
        else:
            json_data[index]["status"] = res.status_code
            print("[", res.status_code,"]")
    except Exception as e:
        json_data[index]["status"] = str(type(e)).split("'")[1].split(".")[2]
        print("[", json_data[index]["status"],"]")

with open('data.json', 'w', encoding='utf8') as json_file:
    print("[", file = json_file)
    for index in range(len(json_data)):
        if index == len(json_data) - 1:
            print("  " + json.dumps(json_data[index], ensure_ascii=False), file = json_file)
        else:
            print("  " + json.dumps(json_data[index], ensure_ascii=False) + ",", file = json_file)
    print("]", file = json_file)
