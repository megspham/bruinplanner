import cons
VERBOSE = True

# Note: BEARER expires roughly every half hour
# Update BEARER by logging into https://developer.api.ucla.edu/api/261#/Classes/ extracting headers from curl command for some request
BEARER = cons.bearer_token
HEADERS = {'accept': 'application/json', 'authorization': 'Bearer ' + BEARER}

# Manually parsed from https://catalog.registrar.ucla.edu/major/2021/ComputerScienceBS
REQUIRED_CS_COURSES = [
    ("COM SCI 1", "lower-cs"),
    ("COM SCI 31", "lower-cs"),
    ("COM SCI 32", "lower-cs"),
    ("COM SCI 33", "lower-cs"),
    ("COM SCI M51A", "lower-cs"),
    ("COM SCI 111", "req-cs"),
    ("COM SCI 118", "req-cs"),
    ("COM SCI 131", "req-cs"),
    ("COM SCI 151B", "req-cs"),
    ("COM SCI M152A", "req-cs"),
    ("COM SCI 180", "req-cs"),
    ("COM SCI 181", "req-cs"),
    ("STATS 100A", "req-cs"),
    ("MATH 31A", "lower-math"),
    ("MATH 31B", "lower-math"),
    ("MATH 32A", "lower-math"),
    ("MATH 32B", "lower-math"),
    ("MATH 33A", "lower-math"),
    ("MATH 33B", "lower-math"),
    ("MATH 61", "lower-math"),
    ("PHYSICS 1A", "lower-physics"),
    ("PHYSICS 1B", "lower-physics"),
    ("PHYSICS 1C", "lower-physics"),
    ("PHYSICS 4AL", "lower-physics"),
    ("PHYSICS 4BL", "lower-physics")
]

GE_CATEGORIES = [
    "GE-AH-LC",
    "GE-AH-VP",
    "GE-AH-PL",
    "GE-SC-HA",
    "GE-SC-SA",
    "GE-SI-LS"
]

PAST_TERMS = ["22F", "22S", "22W", "21F", "21S", "21W", "20F", "20S", "20W", "19F"]