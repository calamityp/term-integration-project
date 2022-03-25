import cx_Oracle
from dotenv import load_dotenv
import os
import calendar;
import time;

load_dotenv()

cx_Oracle.init_oracle_client(lib_dir=os.environ.get("HOME")+"/Downloads/instantclient_19_8")

connection = cx_Oracle.connect(user=os.getenv("DB_USER"), password=os.getenv("DB_PASSWORD"), dsn=os.getenv("DB_DSN"))

cursor = connection.cursor()

userTableQuery="CREATE TABLE UserTable (id NUMBER GENERATED ALWAYS AS IDENTITY(START WITH 1 INCREMENT BY 1), username varchar2(100), password varchar2(100))"
documentTableQuery="CREATE TABLE DocumentTable (id varchar2(50), userId Number, docName varchar2(100), CONSTRAINT doc_pk PRIMARY KEY(id))"
addUserQuery="INSERT INTO UserTable (username,password) VALUES (:1, :2)"
loginQuery="SELECT id FROM UserTable WHERE (username = :1 AND password = :2)"
addDocQuery="INSERT INTO DocumentTable (id, userId , docName) VALUES (:1, :2, :3)"
getAllDOcQuery = "SELECT * FROM DocumentTable where userId=:1"
getTotalP1Query="SELECT COUNT(*) FROM RAISEDINCIDENCTTABLE WHERE priority='Crítica' and docId=:1"
totalRaisedInsQuery="select count(*) from RAISEDINCIDENCTTABLE WHERE docId=:1"
raisedInsidentPerPriorityQuery="select PRIORITY, count(*) from RAISEDINCIDENCTTABLE WHERE docId=:1 GROUP by PRIORITY"
backlogInsidentPerPriorityQuery="select PRIORITY, count(*) from BACKLOGINCIDENCTTABLE WHERE docId=:1 GROUP by PRIORITY"
noOfInsPerCauseQuery="select t1.INC_TYPE, t1.raisedCount,t2.closedCount from (select INC_TYPE, count(*) raisedCount from RAISEDINCIDENCTTABLE WHERE docId=:1 group by INC_TYPE) t1 join (select INC_TYPE, count(*) closedCount from CLOSEDINCIDENCTTABLE  WHERE docId=:1 group by INC_TYPE) t2 on t1.INC_TYPE=t2.INC_TYPE"
noOfP1SLAQuery="select count(*) from RAISEDINCIDENCTTABLE where (INCIDENT_STATUS='Resolved' and PRIORITY='Crítica' and  docId=:1)"
avgTimeP1SLAQuery="select sum(extract(hour from (resolution_date_time - CREATE_DATE_TIME)))*60 + sum(extract(minute from RESOLUTION_DATE_TIME - CREATE_DATE_TIME)) mins, count(*)  from CLOSEDINCIDENCTTABLE where (PRIORITY='Crítica' and docId=:1)"
noOfInsPerCustomerQuery="select count(*), CUSTOMER_COMPANY from BACKLOGINCIDENCTTABLE WHERE docId=:1 group by CUSTOMER_COMPANY"

raisedIncidenctTableQuery = 'CREATE TABLE RaisedIncidenctTable(incidenct_code varchar2(100), docId varchar2(50), customer_company_group varchar2(30), customer_company varchar2(30), create_date_time TIMESTAMP, resolution_date_time TIMESTAMP, incident_status varchar2(15), priority varchar2(10), inc_type varchar2(100) )'
closedIncidenctTableQuery = 'CREATE TABLE ClosedIncidenctTable(incidenct_code varchar2(100), docId varchar2(50), customer_company varchar2(30), create_date_time TIMESTAMP, resolution_date_time TIMESTAMP, incident_status varchar2(15), support_group varchar2(50), priority varchar2(10), inc_type varchar2(100), inc_element varchar2(100))'
backlogIncidenctTableQuery = 'CREATE TABLE BacklogIncidenctTable(incidenct_code varchar2(100), docId varchar2(50), customer_company_group varchar2(30), customer_company varchar2(30), create_date_time TIMESTAMP, resolution_date_time TIMESTAMP, incident_status varchar2(15), priority varchar2(10), inc_category varchar2(50), inc_type varchar2(100), inc_element varchar2(100) )'

insertRaisedIncidenctQuery="INSERT INTO RaisedIncidenctTable (incidenct_code, docId , customer_company_group, customer_company , create_date_time, resolution_date_time, incident_status, priority, inc_type) VALUES (:1, :2, :3, :4, TO_DATE(:5, 'DD/MM/YYYY HH24:MI'),TO_DATE(:6, 'DD/MM/YYYY HH24:MI'), :7, :8, :9)"
insertClosedIncidenctQuery="INSERT INTO ClosedIncidenctTable (incidenct_code, docId , customer_company , create_date_time, resolution_date_time, incident_status,support_group, priority, inc_type,inc_element) VALUES (:1, :2, :3, TO_DATE(:4, 'DD/MM/YYYY HH24:MI'),TO_DATE(:5, 'DD/MM/YYYY HH24:MI'),:6, :7, :8, :9, :10)"
insertBacklogIncidenctQuery="INSERT INTO BacklogIncidenctTable (incidenct_code, docId , customer_company_group,customer_company , create_date_time, resolution_date_time, incident_status, priority, inc_category, inc_type,inc_element) VALUES (:1, :2, :3, :4, TO_DATE(:5, 'DD/MM/YYYY HH24:MI'),TO_DATE(:6, 'DD/MM/YYYY HH24:MI'), :7, :8, :9, :10, :11)"
# Create a table
def createTable():
  try:
    cursor.execute(userTableQuery)
    cursor.execute(documentTableQuery)
    cursor.execute(raisedIncidenctTableQuery)
    cursor.execute(closedIncidenctTableQuery)
    cursor.execute(backlogIncidenctTableQuery)

    connection.commit()
  except Exception as e:
    print(e)

def registerUser(val):
  try:
    data=[]
    data.append(val)
    cursor.executemany(addUserQuery, data)
    connection.commit()
    print("data insert success")
    return True
  except Exception as e:
    print("data insertion fail")
    print(e)
    return False

def loginUser(val):
  try:
    for id in cursor.execute(loginQuery, val):
      return id[0]
    print("login success and user id is ",id)
    return False
  except Exception as e:
    print(e)
    return False
  
def insertDoc(userId,fileName):
  try:
    docId = calendar.timegm(time.gmtime())
    data=[]
    data.append((docId,userId,fileName))
    cursor.executemany(addDocQuery, data)
    connection.commit()
    print("document insertion success")
    return docId
  except Exception as e:
    print("document insertion fail")
    print(e)
    return False
def insertIncidentData(data1,data2,data3):
    try:
      cursor.executemany(insertRaisedIncidenctQuery, data1)
      cursor.executemany(insertClosedIncidenctQuery, data2)
      cursor.executemany(insertBacklogIncidenctQuery, data3)
      connection.commit()
      print("incidents data insertion success")
      return True
    except Exception as e:
      print("data insertion fail")
      print(e)
      return False

def getAllDocs(id):
  try:
    cursor.execute(getAllDOcQuery,(id))
    print("Get all docs")
    val=cursor.fetchall()
    print(val)
    return val
  except Exception as e:
    print(e)
    return False

def getKpisVal(id):
  try:
    cursor.execute(getTotalP1Query,[(id)])
    totalP1=cursor.fetchall()[0][0]
    print('totalP1',totalP1)
    
    cursor.execute(totalRaisedInsQuery,[(id)])
    totalRaisedIns=cursor.fetchall()[0][0]
    print('totalRaisedIns',totalRaisedIns)

    cursor.execute(raisedInsidentPerPriorityQuery,[(id)])
    raisedInsidentPerPriority=dict((key, val) for (key, val) in cursor.fetchall())
    print('raisedInsidentPerPriority',raisedInsidentPerPriority)

    cursor.execute(backlogInsidentPerPriorityQuery,[(id)])
    backlogInsidentPerPriority=dict((key, val) for (key, val) in cursor.fetchall())
    print('backlogInsidentPerPriority',backlogInsidentPerPriority)

    cursor.execute(noOfInsPerCauseQuery,[(id)])
    noOfInsPerCause = []
    for i in cursor.fetchall():
      noOfInsPerCause.append({ "name": i[0],"Closed": i[2],"Raised": i[1]})

    print('noOfInsPerCause',noOfInsPerCause)

    cursor.execute(noOfP1SLAQuery,[(id)])
    noOfP1SLA=cursor.fetchall()[0][0]
    print('noOfP1SLA',noOfP1SLA)

    precentageNoOfP1SLA=(noOfP1SLA/totalP1)*100
    print('precentageNoOfP1SLA',precentageNoOfP1SLA)

    noOfP1NotSLA = totalP1 - noOfP1SLA
    print('noOfP1NotSLA',noOfP1NotSLA)

    precentageNoOfP1NotSLA = (noOfP1NotSLA/totalP1)*100
    print('precentageNoOfP1NotSLA',precentageNoOfP1NotSLA)

    # calculate avarge P1 SLA
    cursor.execute(avgTimeP1SLAQuery,[(id)])
    val =cursor.fetchall()
    avgTimeInMin=(val[0][0])/(val[0][1])
    hours = int(avgTimeInMin//60)
    min = int(avgTimeInMin - 60 * hours)
    avgTimeP1SLA = str(hours)+"hrs "+str(min)+"min"
    print('avgTimeP1SLA',avgTimeP1SLA)
    
    cursor.execute(noOfInsPerCustomerQuery,[(id)])
    noOfInsPerCustomer=dict((key, val) for (val, key) in cursor.fetchall())
    print('noOfInsPerCustomern',noOfInsPerCustomer)

    print("Get all kpis")
    kpis = {
            "totalP1":totalP1,
            "totalRaisedIns":totalRaisedIns,
            "raisedInsidentPerPriority":raisedInsidentPerPriority,
            "backlogInsidentPerPriority":backlogInsidentPerPriority,
            "noOfInsPerCause":noOfInsPerCause,
            "noOfP1SLA":noOfP1SLA,
            "precentageNoOfP1SLA":precentageNoOfP1SLA,
            "noOfP1NotSLA":noOfP1NotSLA,
            "precentageNoOfP1NotSLA":precentageNoOfP1NotSLA,
            "avgTimeP1SLA":avgTimeP1SLA,
            "noOfInsPerCustomer":noOfInsPerCustomer
        }
    return kpis
  except Exception as e:
    print(e)
    return False