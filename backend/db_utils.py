import mysql.connector
import cons

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password=cons.password,
  database="bruinplanner"
)

mycursor = mydb.cursor(buffered = True)

def execute(*args):
    """
    Function that executes a certain query in the database and fetches result.
    """
    mycursor.execute(*args)
    if (args[0].split(" ")[0] == "INSERT"):
      myresult = None
    else:
      myresult = mycursor.fetchall()
    mydb.commit()
    return myresult