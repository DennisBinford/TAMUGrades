from Utils.pdfparsing import get_extra_grade_info
from Utils.database import get_mongodb_collection
from Utils.constants import DATABASE_NAME, MONGODB_URI


def get_aggregation(get_collection_name, filter):
    GET_COLLECTION = get_mongodb_collection(
        DATABASE_NAME, get_collection_name, MONGODB_URI)
    aggregation = GET_COLLECTION.aggregate([{
        '$group': {
            '_id': filter,
            'a': {'$sum': '$grades.a'},
            'b': {'$sum': '$grades.b'},
            'c': {'$sum': '$grades.c'},
            'd': {'$sum': '$grades.d'},
            'f': {'$sum': '$grades.f'},
            'i': {'$sum': '$grades.i'},
            's': {'$sum': '$grades.s'},
            'u': {'$sum': '$grades.u'},
            'x': {'$sum': '$grades.x'},
            'q': {'$sum': '$grades.q'}
        }}])
    return aggregation


def get_grade_categories(document):
    A = document["a"]
    B = document["b"]
    C = document["c"]
    D = document["d"]
    F = document["f"]
    I = document["i"]
    S = document["s"]
    U = document["u"]
    X = document["x"]
    Q = document["q"]
    return A, B, C, D, F, I, S, U, X, Q


def populate_grades(entry, A, B, C, D, F, I, S, U, X, Q, GPA, Q_PERCENT, A_PERCENT, B_PERCENT, C_PERCENT):
    entry["grades"] = {
        "a" : A,
        "b" : B,
        "c" : C,
        "d" : D,
        "f" : F,
        "i" : I,
        "s" : S,
        "u" : U,
        "x" : X,
        "q" : Q,
        "gpa" : GPA,
        "q_percent" : Q_PERCENT,
        "a_percent" : A_PERCENT,
        "b_percent" : B_PERCENT,
        "c_percent" : C_PERCENT
    }
    return entry


def populate_document_type(document, document_type):
    if document_type == "course":
        department = document["_id"]["department"]
        course = document["_id"]["course"]
        entry = {
            "_id": department + course,
            "department": department,
            "course": course
        }
    elif document_type == "department":
        department = document["_id"]
        entry = {
            "_id": department,
            "department": department
        }
    elif document_type == "professor_total":
        professor = document["_id"]
        entry = {
            "_id": professor,
            "professor": professor,
            "department": "all",
            "course": "all",
            "type": "total"
        }
    elif document_type == "professor_department":
        professor = document["_id"]["professor"]
        department = document["_id"]["department"]
        entry = {
            "_id": professor + " " + department,
            "professor": professor,
            "department": department,
            "course": "all",
            "type": "department"
        }
    elif document_type == "professor_course":
        professor = document["_id"]["professor"]
        department = document["_id"]["department"]
        course = document["_id"]["course"]
        entry = {
            "_id": professor + " " + department + " " + course,
            "professor": professor,
            "department": department,
            "course": course,
            "type": "course"
        }
    return entry


def aggregate_collection(get_collection_name, set_collection_name, filter, document_type):

    aggregation = get_aggregation(get_collection_name, filter)

    SET_COLLECTION = get_mongodb_collection(
        DATABASE_NAME, set_collection_name, MONGODB_URI)

    entries = []

    for document in aggregation:
        A, B, C, D, F, I, S, U, X, Q = get_grade_categories(document)
        GPA, Q_PERCENT, A_PERCENT, B_PERCENT, C_PERCENT = get_extra_grade_info(
            A, B, C, D, F, I, S, U, X, Q)
        entry = populate_document_type(document, document_type)
        # FIXME: may want to make another function that merges this, if not note that entry is a two step process where the second step always happens
        entry = populate_grades(entry, A, B, C, D, F, I, S, U,
                                X, Q, GPA, Q_PERCENT, A_PERCENT, B_PERCENT, C_PERCENT)
        entries.append(entry)
    SET_COLLECTION.insert_many(entries)
    entries = []
