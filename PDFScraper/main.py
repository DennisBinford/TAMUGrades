import os
import glob
import time

from Utils.databaselink import MONGODB_URI
from Utils.constants import SECTION_PATTERN, MONGODB_URI, DATABASE_NAME, PROCESS_FILE_PATH, SAVE_FILE_PATH, FAIL_FILE_PATH, START_TIME, VALID_SEMESTERS, VALID_YEARS
from Utils.pymongo import get_mongodb_collection
from Utils.parsing import *

if __name__ == "__main__":

    collection = get_mongodb_collection(
        "TAMUGrades", "Sections", MONGODB_URI)
    grade_pdfs = glob.glob(os.path.join(PROCESS_FILE_PATH, '*.pdf'))
    section_documents_list = []
    file_count = 0
    skip_file = False

    for grade_pdf in grade_pdfs:
        print(time.time() - START_TIME)
        file_count += 1
        print(file_count, ":", grade_pdf)
        section_tag_indices, pdf_text = get_section_tag_indices_and_retain_pdf_text(
            grade_pdf)
        if grade_file_follows_format(grade_pdf):
            file_format_match = grade_file_follows_format(grade_pdf)
            file_name = file_format_match.group(0)
            pdf_semester, pdf_year = get_semester_and_year(
                pdf_text, VALID_SEMESTERS, VALID_YEARS)
            semester, year = get_semester_and_year(
                pdf_text, VALID_SEMESTERS, VALID_YEARS, True, file_name)
            college = get_college_from_file(file_name)
            if (semester != pdf_semester or year != pdf_year):
                print("ALERT: mismatch in pdf and file name for semester and year")
            if is_old_pdf(year, semester):
                section_documents_list = populate_section_info(section_tag_indices, pdf_text,
                                                               semester, year, section_documents_list, college, "OLD")
            else:
                section_documents_list = populate_section_info(section_tag_indices, pdf_text,
                                                               semester, year, section_documents_list, college, "NEW")
        else:
            print("ALERT:", grade_pdf, "does not match the file pattern")
        if (file_count % 10 == 0):
            try:
                print(time.time() - START_TIME)
                collection.insert_many(section_documents_list)
                section_documents_list = []
                print("Mass wrote successfully")
                # for grade_pdf in grade_pdfs:
                #     os.replace(grade_pdf, SAVE_FILE_PATH + grade_pdf[-14:-1] + 'f')
            except Exception as e:
                print(e)
                print("ALERT: collection entry having problems")
    try:
        print(time.time() - START_TIME)
        collection.insert_many(section_documents_list)
        section_documents_list = []
        print("Mass wrote successfully")
        # for grade_pdf in grade_pdfs:
        #     os.replace(grade_pdf, SAVE_FILE_PATH + grade_pdf[-14:-1] + 'f')
    except Exception as e:
        print(e)
        print("ALERT: collection entry having problems")

# FIXME: Galveston (GV) and Qatar (QT) have duplicate keys as they use the same number for sections
# School of Law has an exception as it is LAW which violates section pattern