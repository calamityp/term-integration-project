
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from dbConnection import *
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app) 

load_dotenv()
    
@app.route('/register', methods=['POST','GET'])
def register():   
    userData=(request.get_json()['username'] , request.get_json()['password'])
    if(registerUser(userData)):
        return jsonify({"response": True })
    else:
        return jsonify({"response": False })

@app.route('/login', methods=['POST','GET'])
def login():   
    userData=(request.get_json()['username'] , request.get_json()['password'])
    id=loginUser(userData)
    if(id==False):
        return jsonify({"response": False })
    else:
        return jsonify({"response": True , "username": request.get_json()['username'], "id": id})

@app.route('/upload_data', methods=['POST','GET'])
def upload_data():   
    raisedIncidentFile = request.files["raisedIncidentFile"]
    closedIncidentFile = request.files["closedIncidentFile"]
    backlogIncidentFile = request.files["backlogIncidentFile"]
    args = request.args
    userId =  args.get('id')
    fileName = args.get('fileSetName')
    # TODO
    # insert doc
    docId=insertDoc(userId,fileName)
    # docId="1647103253"
    ef = pd.read_csv( raisedIncidentFile, na_filter=False )
    df = pd.DataFrame(ef)
    raisedIncidenctLst=[]
    for idx, row in df.iterrows():
       raisedIncidenctLst.append((row['Incidenct Code'],docId, row['Customer Company Group'],row['Customer Company'],row['Create Date-Time'],row['Resolution Date-Time'],row['Incident Status'],row['Priority'],row['Inc. Type']))
    
    ef2 = pd.read_csv( closedIncidentFile, na_filter=False )
    df2 = pd.DataFrame(ef2)
    closedIncidenctLst=[]
    for idx, row in df2.iterrows():
       closedIncidenctLst.append((row['Incidenct Code'],docId, row['Customer Company'],row['Creation Date-Time'],row['Resolution Date-Time'],row['Incident Status'],row['Support Group'],row['Priority'],row['Inc. Type'],row['Inc. Element']))
    
    ef3 = pd.read_csv( backlogIncidentFile, na_filter=False )
    df3 = pd.DataFrame(ef3)
    backlogIncidenctLst=[]
    for idx, row in df3.iterrows():
       backlogIncidenctLst.append((row['Incidenct Code'],docId,row['Customer Company Group'], row['Customer Company'],row['Creation Date-Time'],row['Resolution Date-Time'],row['Incident Status'],row['Priority'],row['Inc. Category'],row['Inc. Type'],row['Inc. Element']))

    dataInsertionStatus=insertIncidentData(raisedIncidenctLst,closedIncidenctLst,backlogIncidenctLst)
    if(dataInsertionStatus):
        return jsonify({"response": True , "docId": docId, "userId": userId})
    else:
        return jsonify({"response": False })

@app.route('/allDoc', methods=['POST','GET'])
def getAllDoc():   
    args = request.args
    userId =  args.get('id')
    docs=getAllDocs(userId)
    if(docs==False):
        return jsonify({"response": False })
    else:
        return jsonify({"response": True , "docs": docs})

@app.route('/dashboardkpis', methods=['POST','GET'])
def getKpis():   
    args = request.args
    docId =  args.get('docId')
    kpis=getKpisVal(docId)
    if(kpis==False):
        return jsonify({"response": False })
    else:
        return jsonify({"response": True , "kpis":kpis})

if __name__ == '__main__': 
    createTable()  
    app.run(debug = True)