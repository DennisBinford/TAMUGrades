if __name__ == "__main__":
    import os
    import glob
    import time
    from Utils.constants import MONGODB_URI, DATABASE_NAME, SECTION_COLLECTION_NAME, PROCESS_FILE_PATH, FAIL_FILE_PATH, START_TIME, VALID_SEMESTERS, VALID_YEARS
    from Utils.database import get_mongodb_collection
    from Utils.pdfparsing import *

    SECTION_COLLECTION = get_mongodb_collection(
        DATABASE_NAME, SECTION_COLLECTION_NAME, MONGODB_URI)
    grade_pdfs = glob.glob(os.path.join(PROCESS_FILE_PATH, '*.pdf'))
    section_documents_list = []
    file_count = 0
    skip_file = False

    for grade_pdf in grade_pdfs:
        print(time.time() - START_TIME)
        file_count += 1
        print(file_count, ":", grade_pdf)
        try:
            section_documents = get_section_documents(grade_pdf)
            section_documents_list.extend(section_documents)
        except Exception as e:
            print(e)
            os.replace(grade_pdf, FAIL_FILE_PATH + "/" + grade_pdf[-14:-1] + 'f') # FIXME: polish this up
        if (file_count % 100 == 0):
            try:
                print(time.time() - START_TIME)
                SECTION_COLLECTION.insert_many(section_documents_list)
                section_documents_list = []
                print("Mass wrote successfully")

            except Exception as e:
                print(e)
                print("ALERT: collection entry having problems")
    try:
        print(time.time() - START_TIME)
        SECTION_COLLECTION.insert_many(section_documents_list)
        section_documents_list = []
        print("Mass wrote successfully")
        # for grade_pdf in grade_pdfs:
        #     os.replace(grade_pdf, SAVE_FILE_PATH + grade_pdf[-14:-1] + 'f')
    except Exception as e:
        print(e)
        print("ALERT: collection entry having problems")
