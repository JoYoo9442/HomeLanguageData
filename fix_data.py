import pandas as pd
import numpy as np
import json

df2010 = pd.read_csv('./CensusData/2010Data.csv')
df2011 = pd.read_csv('./CensusData/2011Data.csv')
df2012 = pd.read_csv('./CensusData/2012Data.csv')
df2013 = pd.read_csv('./CensusData/2013Data.csv')
df2014 = pd.read_csv('./CensusData/2014Data.csv')
df2015 = pd.read_csv('./CensusData/2015Data.csv')
df2016 = pd.read_csv('./CensusData/2016Data.csv')
df2017 = pd.read_csv('./CensusData/2017Data.csv')
df2018 = pd.read_csv('./CensusData/2018Data.csv')
df2019 = pd.read_csv('./CensusData/2019Data.csv')
df2020 = pd.read_csv('./CensusData/2020Data.csv')

df_list = [df2010, df2011, df2012, df2013, df2014, df2015, df2016, df2017, df2018, df2019, df2020]
json_filepath_list = ['./CensusData/2010Data.json', './CensusData/2011Data.json', './CensusData/2012Data.json', './CensusData/2013Data.json', './CensusData/2014Data.json', './CensusData/2015Data.json', './CensusData/2016Data.json', './CensusData/2017Data.json', './CensusData/2018Data.json', './CensusData/2019Data.json', './CensusData/2020Data.json']

count = 0

for df in df_list:
    for column in df.columns:
        if "Percent" in df[column][0]:
            df.drop(column, inplace=True, axis=1)
        elif "PERCENT" in df[column][0]:
            df.drop(column, inplace=True, axis=1)
        else:
            if len(column) >10 and column[13] == "M":
                df.drop(column, inplace=True, axis=1)
            else:
                pass


for df in df_list:
    for column in df.columns:
        df[column][1:] = df[column][1:].astype('int', errors='ignore')

for df in df_list:
    for i in range(df["GEO_ID"].size):
        if len(df["GEO_ID"][i]) > 5:
            df["GEO_ID"][i] = df["GEO_ID"][i][9:]



    jsonFilePath = json_filepath_list[count]
    data = df.to_json(jsonFilePath, indent=4)

    count+=1

