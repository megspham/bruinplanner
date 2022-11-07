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
    """
    Function that executes a certain query in the database and fetches result.
    """
    mycursor.execute(*args)
    myresult = mycursor.fetchall()
    mydb.commit()
    return myresult
