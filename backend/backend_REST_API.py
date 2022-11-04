import db_utils as db

# POST /api/addUser
def addUser(name, email):
    """
    Make new table for user
    """
    db.execute("INSERT IGNORE INTO users (name, email, calendar) VALUES (%s, %s, %s);", (name, email, ""))
    return

# POST /api/importDARS
def importDARS(email, dars_calendar):
    return

# POST /api/saveCalendar
def saveCalendar(email, calendar):
    """
    Update calendar of user
    """
    return

# POST /api/checkCalendar
def checkCalendar(calendar):
    return

# POST /api/getClasses
def getClasses(filters):
    return