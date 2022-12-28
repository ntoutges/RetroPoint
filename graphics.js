const charsets = {
  HP48: {
    "A": [" ||| ","|   |","|   |","|   |","|||||","|   |","|   |","|   |","|   |"],
    "B": ["|||| ","|   |","|   |","|   |","|||| ","|   |","|   |","|   |","|||| "],
    "C": [" ||| ","|   |","|    ","|    ","|    ","|    ","|    ","|   |"," ||| "],
    "D": ["|||| ","|   |","|   |","|   |","|   |","|   |","|   |","|   |","|||| "],
    "E": ["|||||","|    ","|    ","|    ","|||| ","|    ","|    ","|    ","|||||"],
    "F": ["|||||","|    ","|    ","|    ","|||| ","|    ","|    ","|    ","|    "],
    "G": [" ||| ","|   |","|    ","|    ","|    ","|  ||","|   |","|   |"," ||||"],
    "H": ["|   |","|   |","|   |","|   |","|||||","|   |","|   |","|   |","|   |"],
    "I": [" ||| ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  "," ||| "],
    "J": ["    |","    |","    |","    |","    |","|   |","|   |","|   |"," ||| "],
    "K": ["|   |","|   |","|  | ","| |  ","||   ","| |  ","|  | ","|   |","|   |"],
    "L": ["|    ","|    ","|    ","|    ","|    ","|    ","|    ","|    ","|||||"],
    "M": ["|   |","|| ||","| | |","| | |","| | |","|   |","|   |","|   |","|   |"],
    "N": ["|   |","||  |","||  |","| | |","| | |","|  ||","|  ||","|   |","|   |"],
    "O": [" ||| ","|   |","|   |","|   |","|   |","|   |","|   |","|   |"," ||| "],
    "P": ["|||| ","|   |","|   |","|   |","|||| ","|    ","|    ","|    ","|    "],
    "Q": [" ||| ","|   |","|   |","|   |","|   |","|   |","| | |","|  | "," || |"],
    "R": ["|||| ","|   |","|   |","|   |","|||| ","| |  ","|  | ","|   |","|   |"],
    "S": [" ||| ","|   |","|    ","|    "," ||| ","    |","    |","|   |"," ||| "],
    "T": ["|||||","  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  "],
    "U": ["|   |","|   |","|   |","|   |","|   |","|   |","|   |","|   |"," ||| "],
    "V": ["|   |","|   |","|   |","|   |","|   |"," | | "," | | ","  |  ","  |  "],
    "W": ["|   |","|   |","|   |","|   |","| | |","| | |","| | |","|| ||","|   |"],
    "X": ["|   |","|   |","|   |"," | | ","  |  "," | | ","|   |","|   |","|   |"],
    "Y": ["|   |","|   |","|   |"," | | ","  |  ","  |  ","  |  ","  |  ","  |  "],
    "Z": ["|||||","|   |","   | ","   | ","  |  "," |   "," |   ","|   |","|||||"],
    "a": ["     ","     ","     "," ||| ","    |"," ||||","|   |","|   |"," ||||"],
    "b": ["|    ","|    ","|    ","|||| ","|   |","|   |","|   |","|   |","|||| "],
    "c": ["     ","     ","     "," ||||","|    ","|    ","|    ","|    "," ||||"],
    "d": ["    |","    |","    |"," ||||","|   |","|   |","|   |","|   |"," ||||"],
    "e": ["     ","     ","     "," ||| ","|   |","|||||","|    ","|    "," ||| "],
    "f": ["  || "," |  |"," |   "," |   ","|||  "," |   "," |   "," |   "," |   "],
    "g": ["     ","     ","     "," ||| ","|   |","|   |"," ||||","    |","    |"," ||| "],
    "h": ["|    ","|    ","|    ","|||| ","|   |","|   |","|   |","|   |","|   |"],
    "i": ["     ","  |  ","     "," ||  ","  |  ","  |  ","  |  ","  |  "," ||| "],
    "j": ["     ","   | ","     ","  || ","   | ","   | ","   | ","   | ","|  | "," ||  "],
    "k": ["|    ","|    ","|    ","|  | ","|  | ","| |  ","||   ","| |  ","|  | "],
    "l": [" ||  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  "," ||| "],
    "m": ["     ","     ","     ","|| | ","| | |","| | |","| | |","| | |","| | |"],
    "n": ["     ","     ","     ","|||| ","|   |","|   |","|   |","|   |","|   |"],
    "o": ["     ","     ","     "," ||| ","|   |","|   |","|   |","|   |"," ||| "],
    "p": ["     ","     ","     "," ||| ","|   |","|   |","|||| ","|    ","|    ","|    "],
    "q": ["     ","     ","     "," ||| ","|   |","|   |"," ||||","    |","    |","    |"],
    "r": ["     ","     ","     ","| |||","||   ","|    ","|    ","|    ","|    "],
    "s": ["     ","     ","     "," ||||","|    "," ||| ","    |","    |","|||| "],
    "t": [" |   "," |   "," |   ","|||  "," |   "," |   "," |   "," | | ","  |  "],
    "u": ["     ","     ","     ","|   |","|   |","|   |","|   |","|   |"," ||||"],
    "v": ["     ","     ","     ","|   |","|   |","|   |","|   |"," | | ","  |  "],
    "w": ["     ","     ","     ","|   |","|   |","|   |","| | |","| | |"," | | "],
    "x": ["     ","     ","     ","|   |","|   |"," | | ","  |  "," | | ","|   |"],
    "y": ["     ","     ","     ","|   |","|   |","|   |"," ||||","    |","    |"," ||| "],
    "z": ["     ","     ","     ","|||||","   | ","  |  "," |   ","|    ","|||||"],
    " ": [],
    
    "0": [" ||| ","|   |","|   |","|  ||","| | |","||  |","|   |","|   |"," ||| "],
    "1": ["  |  "," ||  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  "," ||| "],
    "2": [" ||| ","|   |","|   |","   | ","  |  "," |   ","|    ","|    ","|||||"],
    "3": [" ||| ","|   |","    |","    |"," ||| ","    |","    |","|   |"," ||| "],
    "4": ["   | ","  || "," | | ","|  | ","|||||","   | ","   | ","   | ","   | "],
    "5": ["|||||","|    ","|    ","|||| ","    |","    |","    |","|   |"," ||| "],
    "6": ["  || "," |   ","|    ","|    ","|||| ","|   |","|   |","|   |"," ||| "],
    "7": ["|||||","    |","    |","   | ","  |  "," |   "," |   "," |   "," |   "],
    "8": [" ||| ","|   |","|   |","|   |"," ||| ","|   |","|   |","|   |"," ||| "],
    "9": [" ||| ","|   |","|   |","|   |"," ||||","    |","    |","   | "," ||  "],

    "+": ["     ","     ","  |  ","  |  ","|||||","  |  ","  |  ","     ","     "],
    "-": ["     ","     ","     ","     ","|||||","     ","     ","     ","     "],
    "*": ["     ","     "," | | ","  |  ","|||||","  |  "," | | ","     ","     "],
    "/": ["     ","     ","    |","   | ","  |  "," |   ","|    ","     ","     "],
    "=": ["     ","     ","     ","|||||","     ","|||||","     ","     ","     "],

    ".": ["     ","     ","     ","     ","     ","     ","     "," ||  "," ||  "],
    ",": ["     ","     ","     ","     ","     ","     "," ||  "," ||  ","  |  "," |   "],

    "\'": ["  |  ","  |  ","  |  ","  |  ","     ","     ","     ","     ","     "],
    "\"": [" | | "," | | "," | | "," | | ","     ","     ","     ","     ","     "],
    "!":  ["  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","  |  ","     ","  |  "],
    "@":  [" ||| ","|   |","|   |","| | |","| |||","| |  ","|    ","|    "," ||||"],
    "#":  [" | | "," | | "," | | ","|||||"," | | ","|||||"," | | "," | | "," | | "],
    "^":  ["  |  "," | | ","|   |","     ","     ","     ","     ","     ","     "],
    "&":  [" |   ","| |  ","| |  ","| |  "," |   ","| | |","|  | ","|  | "," || |"],
    "_":  ["     ","     ","     ","     ","     ","     ","     ","     ","|||||"],
    ":":  ["     ","     "," ||  "," ||  ","     "," ||  "," ||  ","     ","     "],
    ";":  ["     ","     "," ||  "," ||  ","     "," ||  "," ||  ","  |  "," |   "],
    "\n": ["     ","     ","  | |"," |  |","|||||"," |   ","  |  ","     ","     "],

    "(": ["   | ","  |  "," |   "," |   "," |   "," |   "," |   ","  |  ","   | "],
    ")": [" |   ","  |  ","   | ","   | ","   | ","   | ","   | ","  |  "," |   "],
    "[": [" ||| "," |   "," |   "," |   "," |   "," |   "," |   "," |   "," ||| "],
    "]": [" ||| ","   | ","   | ","   | ","   | ","   | ","   | ","   | "," ||| "],
    "<<": ["     ","     ","  | |"," | | ","| |  "," | | ","  | |","     ","     "],
    ">>": ["     ","     ","| |  "," | | ","  | |"," | | ","| |  ","     ","     "],
    "{": ["  || "," |   "," |   "," |   ","|    "," |   "," |   "," |   ","  || "],
    "}": [" ||  ","   | ","   | ","   | ","    |","   | ","   | ","   | "," ||  "],

    "<": ["    |","   | ","  |  "," |   ","|    "," |   ","  |  ","   | ","    |"],
    ">": ["|    "," |   ","  |  ","   | ","    |","   | ","  |  "," |   ","|    "],

    "pi":  ["     ","     ","    |","|||||"," | | "," | | "," | | "," | | "," | | "],
    "tau": ["     ","     ","    |"," ||| ","| |  ","  |  ","  |  ","  | |","   | "],

    "...": ["     ","     ","     ","     ","     ","     ","     ","| | |","| | |"],
    
    "->": ["     ","     ","  |  ","   | ","|||||","   | ","  |  "],
    "<-": ["     ","     ","  |  "," |   ","|||||"," |   ","  |  "],
    "|^": ["     ","     ","  |  "," ||| ","| | |","  |  ","  |  "],
    "|v": ["     ","     ","  |  ","  |  ","| | |"," ||| ","  |  "],
    
    "\\": ["     ","     ","|    "," |   ","  |  ","   | ","    |"],
    
    "=>":  ["     "," |   "," ||  ","|||| ","|||||","|||| "," ||  "," |   ","     "],
    "<=":  ["     ","   | ","  || "," ||||","|||||"," ||||","  || ","   | ","     "],
    "< =": ["     ","   | ","  |  "," |  |","|   |"," |  |","  |  ","   | "],
    "= >": ["     "," |   ","  |  ","|  | ","|   |","|  | ","  |  "," |   "],
    
    unknown: [
      "     ",
      "     ",
      " ||| ",
      " ||| ",
      " ||| ",
      " ||| ",
      " ||| ",
      "     ",
      "     "
    ]
  },
  PETSCII: {
    "@": ["   |||  ","  |   | "," |  | | "," | | || "," |  ||  ","  |     ","   |||| "],
    "a": ["        ","        ","  |||   ","     |  ","  ||||  "," |   |  ","  ||| | "],
    "b": [" |      "," |      "," | |||  "," ||   | "," |    | "," ||   | "," | |||  "],
    "c": ["        ","        ","  ||||  "," |    | "," |      "," |    | ","  ||||  "],
    "d": ["      | ","      | ","  ||| | "," |   || "," |    | "," |   || ","  ||| | "],
    "e": ["        ","        ","  ||||  "," |    | "," |||||| "," |      ","  ||||  "],
    "f": ["    ||  ","   |  | ","   |    "," |||||  ","   |    ","   |    ","   |    "],
    "g": ["        ","        ","  ||| | "," |   || "," |   || ","  ||| | ","      | ","  ||||  "],
    "h": [" |      "," |      "," | |||  "," ||   | "," |    | "," |    | "," |    | "],
    "i": ["    |   ","        ","   ||   ","    |   ","    |   ","    |   ","   |||  "],
    "j": ["     |  ","        ","    ||  ","     |  ","     |  ","     |  "," |   |  ","  |||   "],
    "k": [" |      "," |      "," |   |  "," |  |   "," | |    "," || |   "," |   |  "],
    "l": ["   ||   ","    |   ","    |   ","    |   ","    |   ","    |   ","   |||  "],
    "m": ["        ","        "," ||| || "," |  |  |"," |  |  |"," |  |  |"," |  |  |"],
    "n": ["        ","        "," | |||  "," ||   | "," |    | "," |    | "," |    | "],
    "o": ["        ","        ","  ||||  "," |    | "," |    | "," |    | ","  ||||  "],
    "p": ["        ","        "," | |||  "," ||   | "," ||   | "," | |||  "," |      "," |      "],
    "q": ["        ","        ","  ||| | "," |   || "," |   || ","  ||| | ","      | ","      | "],
    "r": ["        ","        "," | |||  "," ||   | "," |      "," |      "," |      "],
    "s": ["        ","        ","  ||||| "," |      ","  ||||  ","      | "," |||||  "],
    "t": ["   |    ","   |    "," |||||  ","   |    ","   |    ","   |  | ","    ||  "],
    "u": ["        ","        "," |    | "," |    | "," |    | "," |   || ","  ||| | "],
    "v": ["        ","        "," |    | "," |    | "," |    | ","  |  |  ","   ||   "],
    "w": ["        ","        "," |     |"," |  |  |"," |  |  |"," |  |  |","  || || "],
    "x": ["        ","        "," |    | ","  |  |  ","   ||   ","  |  |  "," |    | "],
    "y": ["        ","        "," |    | "," |    | "," |   || ","  ||| | ","      | ","  ||||  "],
    "z": ["        ","        "," |||||| ","     |  ","   ||   ","  |     "," |||||| "],
    "A": ["   ||   ","  |  |  "," |    | "," |||||| "," |    | "," |    | "," |    | "],
    "B": [" |||||  ","  |   | ","  |   | ","  ||||  ","  |   | ","  |   | "," |||||  "],
    "C": ["   |||  ","  |   | "," |      "," |      "," |      ","  |   | ","   |||  "],
    "D": [" ||||   ","  |  |  ","  |   | ","  |   | ","  |   | ","  |  |  "," ||||   "],
    "E": [" |||||| "," |      "," |      "," ||||   "," |      "," |      "," |||||| "],
    "F": [" |||||| "," |      "," |      "," ||||   "," |      "," |      "," |      "],
    "G": ["   |||  ","  |   | "," |      "," |  ||| "," |    | ","  |   | ","   |||  "],
    "H": [" |    | "," |    | "," |    | "," |||||| "," |    | "," |    | "," |    | "],
    "I": ["   |||  ","    |   ","    |   ","    |   ","    |   ","    |   ","   |||  "],
    "J": ["    ||| ","     |  ","     |  ","     |  ","     |  "," |   |  ","  |||   "],
    "K": [" |    | "," |   |  "," |  |   "," |||    "," |  |   "," |   |  "," |    | "],
    "L": [" |      "," |      "," |      "," |      "," |      "," |      "," |||||| "],
    "M": [" |    | "," ||  || "," | || | "," | || | "," |    | "," |    | "," |    | "],
    "N": [" |    | "," ||   | "," | |  | "," |  | | "," |   || "," |    | "," |    | "],
    "O": ["   ||   ","  |  |  "," |    | "," |    | "," |    | ","  |  |  ","   ||   "],
    "P": [" |||||  "," |    | "," |    | "," |||||  "," |      "," |      "," |      "],
    "Q": ["   ||   ","  |  |  "," |    | "," |    | "," |  | | ","  |  |  ","   || | "],
    "R": [" |||||  "," |    | "," |    | "," |||||  "," |  |   "," |   |  "," |    | "],
    "S": ["  ||||  "," |    | "," |      ","  ||||  ","      | "," |    | ","  ||||  "],
    "T": ["  ||||| ","    |   ","    |   ","    |   ","    |   ","    |   ","    |   "],
    "U": [" |    | "," |    | "," |    | "," |    | "," |    | "," |    | ","  ||||  "],
    "V": [" |    | "," |    | "," |    | ","  |  |  ","  |  |  ","   ||   ","   ||   "],
    "W": [" |    | "," |    | "," |    | "," | || | "," | || | "," ||  || "," |    | "],
    "X": [" |    | "," |    | ","  |  |  ","   ||   ","  |  |  "," |    | "," |    | "],
    "Y": ["  |   | ","  |   | ","  |   | ","   |||  ","    |   ","    |   ","    |   "],
    "Z": [" |||||| ","      | ","     |  ","   ||   ","  |     "," |      "," |||||| "],
    " ": [],

    "0": ["  ||||  "," |    | "," |   || "," | || | "," ||   | "," |    | ","  ||||  "],
    "1": ["    |   ","   ||   ","  | |   ","    |   ","    |   ","    |   ","  ||||| "],
    "2": ["  ||||  "," |    | ","      | ","    ||  ","  ||    "," |      "," |||||| "],
    "3": ["  ||||  "," |    | ","      | ","   |||  ","      | "," |    | ","  ||||  "],
    "4": ["     |  ","    ||  ","   | |  ","  |  |  "," |||||| ","     |  ","     |  "],
    "5": [" |||||| "," |      "," ||||   ","     |  ","      | "," |   |  ","  |||   "],
    "6": ["   |||  ","  |     "," |      "," |||||  "," |    | "," |    | ","  ||||  "],
    "7": [" |||||| "," |    | ","     |  ","    |   ","   |    ","   |    ","   |    "],
    "8": ["  ||||  "," |    | "," |    | ","  ||||  "," |    | "," |    | ","  ||||  "],
    "9": ["  ||||  "," |    | "," |    | ","  ||||| ","      | ","     |  ","  |||   "],
    
    "*": ["    |   ","  | | | ","   |||  ","  ||||| ","   |||  ","  | | | ","    |   "],
    "+": ["        ","    |   ","    |   ","  ||||| ","    |   ","    |   "],
    "-": ["        ","        ","        "," |||||| "],
    "/":  ["       |","      | ","     |  ","    |   ","   |    ","  |     "," |      ","|       "],
    
    ",": ["        ","        ","        ","        ","        ","    |   ","    |   ","   |    "],
    ".": ["        ","        ","        ","        ","        ","   ||   ","   ||   "],
    
    "\"": ["  |  |  ","  |  |  ","  |  |  "],
    "\'": ["     |  ","    |   ","   |    "],
    "!": ["    |   ","    |   ","    |   ","    |   ","        ","        ","    |   "],
    "#": ["  |  |  ","  |  |  "," |||||| ","  |  |  "," |||||| ","  |  |  ","  |  |  "],
    "$": ["    |   ","   |||| ","  | |   ","   |||  ","    | | ","  ||||  ","    |   "],
    "%": ["        "," ||   | "," ||  |  ","    |   ","   |    ","  |  || "," |   || "],
    "&": ["  ||    "," |  |   "," |  |   ","  ||    "," |  | | "," |   |  ","  ||| | "],
    ":": ["        ","        ","    |   ","        ","        ","    |   "],
    ";": ["        ","        ","    |   ","        ","        ","    |   ","    |   ","   |    "],
    "?": ["  ||||  "," |    | ","      | ","    ||  ","   |    ","        ","   |    "],

    "[": ["  ||||  ","  |     ","  |     ","  |     ","  |     ","  |     ","  ||||  "],
    "]": ["  ||||  ","     |  ","     |  ","     |  ","     |  ","     |  ","  ||||  "],
    "(": ["     |  ","    |   ","   |    ","   |    ","   |    ","    |   ","     |  "],
    ")": ["  |     ","   |    ","    |   ","    |   ","    |   ","   |    ","  |     "],

    "<": ["    ||| ","   ||   ","  ||    "," ||     ","  ||    ","   ||   ","    ||| "],
    "=": ["        ","        "," |||||| ","        "," |||||| "],
    ">": [" |||    ","   ||   ","    ||  ","     || ","    ||  ","   ||   "," |||    "],
    
    "|^": ["        ","    |   ","   |||  ","  | | | ","    |   ","    |   ","    |   ","    |   "],
    "<-": ["        ","        ","   |    ","  |     "," |||||||","  |     ","   |    "],
    
    "\\": ["|       "," |      ","  |     ","   |    ","    |   ","     |  ","      | ","       |"],

    "--": ["        ","        ","        ","        ","||||||||"],
    "-+1": ["    |   ","    |   ","    |   ","    |   ","||||||||","    |   ","    |   ","    |   "],
    "-+2": ["    |   ","    |   ","    |   ","    |   ","    ||||","    |   ","    |   ","    |   "],
    "-+3": ["    |   ","    |   ","    |   ","    |   ","    ||||"],
    "-+4": ["        ","        ","        ","        ","|||||   ","    |   ","    |   ","    |   "],
    "-+5": ["        ","        ","        ","        ","    ||||","    |   ","    |   ","    |   "],
    "-+6": ["    |   ","    |   ","    |   ","    |   ","||||||||"],
    "-+7": ["        ","        ","        ","        ","||||||||","    |   ","    |   ","    |   "],
    "-+8": ["    |   ","    |   ","    |   ","    |   ","|||||   ","    |   ","    |   ","    |   "],
    "-+9": ["    |   ","    |   ","    |   ","    |   ","|||||   "],
    "-|": ["    |   ","    |   ","    |   ","    |   ","    |   ","    |   ","    |   ","    |   "],
    "-v": ["       |","      | "," |   |  "," |  |   "," | |    "," ||     "," |      "],
    
    "-#1<": ["| |     "," | |    ","| |     "," | |    ","| |     "," | |    ","| |     "," | |    "],
    "-#1v": ["        ","        ","        ","        ","| | | | "," | | | |","| | | | "," | | | |"],

    "-#2": ["||  ||  ","||  ||  ","  ||  ||","  ||  ||","||  ||  ","||  ||  ","  ||  ||","  ||  ||"],
    "-#3": ["| | | | "," | | | |","| | | | "," | | | |","| | | | "," | | | |","| | | | "," | | | |"],
    
    "-\\": ["||  ||  "," ||  || ","  ||  ||","|  ||  |","||  ||  "," ||  || ","  ||  ||","|  ||  |"],
    "-//": ["|  ||  |","  ||  ||"," ||  || ","||  ||  ","|  ||  |","  ||  ||"," ||  || ","||  ||  "],
    

    "-^": ["||||||||"],
    "_": ["        ","        ","        ","        ","        ","        ","        ","||||||||"],
    "-<": ["|       ","|       ","|       ","|       ","|       ","|       ","|       ","|       "],
    "->": ["       |","       |","       |","       |","       |","       |","       |","       |"],
    
    "--^": ["||||||||","||||||||"],
    "--v": ["        ","        ","        ","        ","        ","        ","||||||||","||||||||"],
    "--<": ["||      ","||      ","||      ","||      ","||      ","||      ","||      ","||      "],
    "-->": ["      ||","      ||","      ||","      ||","      ||","      ||","      ||","      ||"],
    
    "---^": ["||||||||","||||||||","||||||||"],
    "---v": ["        ","        ","        ","        ","        ","||||||||","||||||||","||||||||"],
    "---<": ["|||     ","|||     ","|||     ","|||     ","|||     ","|||     ","|||     ","|||     "],
    "--->": ["     |||","     |||","     |||","     |||","     |||","     |||","     |||","     |||"],

    "0b0001": ["        ","        ","        ","        ","    ||||","    ||||","    ||||","    ||||"],
    "0b0010": ["        ","        ","        ","        ","||||    ","||||    ","||||    ","||||    "],
    "0b0011": ["||||||||","||||||||","||||||||","||||||||"],
    "0b0100": ["||||    ","||||    ","||||    ","||||    "],
    "0b0101": ["||||    ","||||    ","||||    ","||||    ","    ||||","    ||||","    ||||","    ||||"],
    "0b0110 ": ["||||    ","||||    ","||||    ","||||    ","||||    ","||||    ","||||    ","||||    "],
    "0b0111": ["||||||||","||||||||","||||||||","||||||||","||||    ","||||    ","||||    ","||||    "],
    "0b1000": ["    ||||","    ||||","    ||||","    ||||"],
    "0b1001": ["    ||||","    ||||","    ||||","    ||||","    ||||","    ||||","    ||||","    ||||"],
    "0b1010": ["    ||||","    ||||","    ||||","    ||||","||||    ","||||    ","||||    ","||||    "],
    "0b1011": ["    ||||","    ||||","    ||||","    ||||","||||||||","||||||||","||||||||","||||||||"],
    "0b1100": ["||||||||","||||||||","||||||||","||||||||"],
    "0b1101": ["||||||||","||||||||","||||||||","||||||||"],
    "0b1110": ["||||||||","||||||||","||||||||","||||||||","||||    ","||||    ","||||    ","||||    "],
    "0b1111": ["||||||||","||||||||","||||||||","||||||||","||||||||","||||||||","||||||||","||||||||"],

    "=>":  ["   ||   ","   |||  "," |||||| "," |||||||"," |||||| ","   |||  ","   ||   "],
    "<=":  ["   ||   ","  |||   "," |||||| ","||||||| "," |||||| ","  |||   ","   ||   "],
    "< =": ["   ||   ","  |     "," |    | ","|     | "," |    | ","  |     ","   ||   "],
    "= >": ["   ||   ","     |  "," |    | "," |     |"," |    | ","     |  ","   ||   "],
    
    unknown: [
      "||    ||",
      "| |||| |",
      "|||||| |",
      "||||  ||",
      "||| ||||",
      "||||||||",
      "||| ||||",
      "||||||||"
    ]
  }
};

const spacings = {
  "HP48": {
    x: 6,
    y: 10
  },
  "PETSCII": {
    x: 8,
    y: 8
  }
}

export var bitmaps = charsets.HP48;
export var spacing = spacings.HP48

export function changeCharset(charsetName) {
  if (!(charsetName in charsets)) throw new Error("Charset does not exist!");
  bitmaps = charsets[charsetName];
  spacing = spacings[charsetName];
}