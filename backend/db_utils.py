import mysql.connector
import cons

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password=cons.password,
  database="bruinplanner"
)

mycursor = mydb.cursor()

def execute(*args):
    mycursor.execute(*args)
    mydb.commit()
    myresult = mycursor.fetchall()
    return myresult