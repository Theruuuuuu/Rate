import requests
import pandas as pd
import pymssql
import time
import random
from bs4 import BeautifulSoup
import os
from fake_useragent import UserAgent

conn = pymssql.connect(
    server='theruuuuuu.database.windows.net',
    user='t109ab0710',
    password='Zxc3309634256',
    database='maindata',
    as_dict=True
    )
cursor = conn.cursor()

ua = UserAgent()

# 等待時間
wait = [5,8,15,10,6,1,1.5]


def sql():
    

    query = "SELECT * FROM dbo.financeCompanyName"
    cursor.execute(query)

    records = cursor.fetchall()

    Ticker = []
    CompanyName =[]

    for r in records:
        Ticker.append(r['Ticker'])
        CompanyName.append(r['Name'])

    return Ticker, CompanyName


def sqlInsert(res):
    
    query = "INSERT INTO dbo.financeRate1(Ticker, Name, Year, rate1, rate2, rate3, rate4, rate5, rate6, rate7, rate8, rate9, rate10, rate11, rate12, rate13, rate14, rate15, rate16, rate17, rate18, rate19) "
    query += "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    year = 106
    for i in range(2, 5):
        data = res[i]
        cursor.execute(query,(res[0],res[1],year,data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],data[14],data[15],data[16],data[17],data[18]))        
        conn.commit()   
        year+=1 

    
    return

def financial_statement(Ticker, Name):

    
    url = 'https://mops.twse.com.tw/mops/web/ajax_t05st22'


    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': ua.random}

    print('================')
    print(headers)

    r = requests.post(url=url, data={
        'encodeURIComponent': '1',
        'run': 'Y',
        'step': '1',
        'TYPEK': 'sii',
        'year': '108',
        'isnew': 'false',
        'co_id': Ticker,
        'firstin': '1',
        'off': '1',
        'ifrs': 'Y'
    },headers=headers).content

    soup = BeautifulSoup(r, "html.parser")

    AllTh = soup.find_all("th")
    AllTd = soup.find_all("td",attrs= {"style":"text-align:right !important;"})

    value109 = []
    value110 = []
    value111 = []
    result = []    
    try:
        for i in range(0, 57, 3):        
            value109.append(AllTd[i].string[10:].strip())
            value110.append(AllTd[i+1].string[10:].strip())
            value111.append(AllTd[i+2].string[10:].strip())

        print('=====================')
        result.append(Ticker)
        result.append(Name)
        result.append(value109)
        result.append(value110)
        result.append(value111)
        print(result)

        sqlInsert(result)

        sec = wait[random.randint(0, len(wait)-1)]
        print("等待"+ str(sec) +"秒")
        time.sleep(sec)
    except:
        print("公司已經下市")

    return 


source = sql()
for i in range(0,969):
    try:
        financial_statement(source[0][i], source[1][i])
    except:
        print("異常 休息30秒")
        time.sleep(30)
        financial_statement(source[0][i], source[1][i])


conn.close()

# os.system("shutdown -s -t 60")