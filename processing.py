import csv
import json

def make_json(csvFilePath, jsonFilePath):

    data = {}

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)

        for rows in csvReader:
            keys = rows['GEO_ID']
            data[keys] = rows

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

csvFilePath = r'CensusData/2010Data.csv'
jsonFilePath = r'CensusData/2010Data.json'

make_json(csvFilePath, jsonFilePath)
