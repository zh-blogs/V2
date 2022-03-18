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
    json_file.write(json.dumps(json_data, ensure_ascii=False))
