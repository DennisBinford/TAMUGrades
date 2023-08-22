import os
import time
from dotenv import load_dotenv

load_dotenv()

SECTION_PATTERN = r"([A-Z]{4}-\d{3}-.{1}\d{2})|([A-Z]{3}-\d{3}-.{1}\d{2})"
FILE_PATTERN = r"(\d{5}[A-Z]{2})"
DATABASE_NAME = "TAMUGrades"
PROCESS_FILE_PATH = './GradePDFs/process'
FAIL_FILE_PATH = './GradePDFs/failed'
START_TIME = time.time()
VALID_YEARS = ["2012", "2013", "2014", "2015", "2016", "2017",
               "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"] # FIXME: make this generated based on year we are at
VALID_SEMESTERS = ["FALL", "SUMMER", "SPRING"]
MONGODB_URI = os.getenv("MONGODB_URI")
SECTION_COLLECTION_NAME = "TestDev"
COURSE_COLLECTION_NAME = "Courses"
DEPARTMENT_COLLECTION_NAME = "Departments"
PROFESSOR_COLLECTION_NAME = "Professors"
