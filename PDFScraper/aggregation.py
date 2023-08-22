from Utils.collectionaggregation import aggregate_collection
from Utils.constants import COURSE_COLLECTION_NAME, DEPARTMENT_COLLECTION_NAME, PROFESSOR_COLLECTION_NAME, SECTION_COLLECTION_NAME


if __name__ == "__main__":
    aggregate_collection(SECTION_COLLECTION_NAME, COURSE_COLLECTION_NAME, {
                         "department": "$department", "course": "$course"}, "course")
    aggregate_collection(SECTION_COLLECTION_NAME, DEPARTMENT_COLLECTION_NAME,
                         "$department", "department")
    aggregate_collection(SECTION_COLLECTION_NAME, PROFESSOR_COLLECTION_NAME, {
                         "professor": '$professor', "department": "$department", "course": "$course"}, "professor_course")
    aggregate_collection(SECTION_COLLECTION_NAME, PROFESSOR_COLLECTION_NAME, {
                         "professor": '$professor', "department": "$department"}, "professor_department")
    aggregate_collection(SECTION_COLLECTION_NAME, PROFESSOR_COLLECTION_NAME,
                         "$professor", "professor_total")
