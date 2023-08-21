from databaselink import MONGODB_URI
from Utils.pymongo import get_mongodb_collection
from Utils.constants import START_TIME
import time


if __name__ == "__main__":

    get_collection = get_mongodb_collection(
        "TAMUGrades", "Dev", MONGODB_URI)
    
    set_collection = get_mongodb_collection(
        "TAMUGrades", "Courses", MONGODB_URI)
    
    course_aggregation = get_collection.aggregate([
    {
        '$group': {
            '_id': {"department" : "$department", "course" : "$course"}, 
            'A': {
                '$sum': '$grades.A'
            }, 
            'B': {
                '$sum': '$grades.B'
            }, 
            'C': {
                '$sum': '$grades.C'
            }, 
            'D': {
                '$sum': '$grades.D'
            }, 
            'F': {
                '$sum': '$grades.F'
            }, 
            'I': {
                '$sum': '$grades.I'
            }, 
            'S': {
                '$sum': '$grades.S'
            }, 
            'U': {
                '$sum': '$grades.U'
            }, 
            'X': {
                '$sum': '$grades.X'
            }, 
            'Q': {
                '$sum': '$grades.Q'
            }
        }
    }
    ])

    course_entries = []
    for document in course_aggregation:
        department = document["_id"]["department"]
        course = document["_id"]["course"]
        A = document["A"]
        B = document["B"]
        C = document["C"]
        D = document["D"]
        F = document["F"]
        I = document["I"]
        S = document["S"]
        U = document["U"]
        X = document["X"]
        Q = document["Q"]
        course_entry = {
            "_id" : department + course,
            "department" : department,
            "course" : course,
            "grades" : {
                "A" : A,
                "B" : B,
                "C" : C,
                "D" : D,
                "F" : F,
                "I" : I,
                "S" : S,
                "U" : U,
                "X" : X,
                "Q" : Q,
                "GPA" : round((A * 4.0 + B * 3.0 + C * 2.0 + D * 1.0) / (A+B+C+D+F), 3),
                "Q_drop_percentage" : round(Q / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
                "A_percentage" : round(A / (A+B+C+D+F+I+S+U+X+Q) * 100, 2) ,
                "B_and_above_percentage" : round((A+B) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
                "pass_percentage" : round((A+B+C) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
            }
        }
        course_entries.append(course_entry)
    set_collection.insert_many(course_entries)
    course_entries = []
