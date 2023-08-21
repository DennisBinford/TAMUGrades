from databaselink import MONGODB_URI
from Utils.pymongo import get_mongodb_collection
from Utils.constants import START_TIME
import time


if __name__ == "__main__":

    get_collection = get_mongodb_collection(
        "TAMUGrades", "Dev", MONGODB_URI)
    
    set_collection = get_mongodb_collection(
        "TAMUGrades", "Professors", MONGODB_URI)
    
    #aggregation_type = "COURSE"
    # aggregation_type = "DEPARTMENT"
    
    # departments = get_collection.distinct('department')
    # print(departments, len(departments))
    # course_entries = []
    # department_entries = []
    # for department in departments:
    #     if(aggregation_type == "COURSE"):
    #         courses = get_collection.find({"department" : department}).distinct('course')
    #         print(len(courses), "courses in", department)
    #         for course in courses:
    #             sections = get_collection.find({"department" : department, "course" : course})
    #             A, B, C, D, F, I, S, U, X, Q = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    #             for section in sections:
    #                 A += section['grades']['A']
    #                 B += section['grades']['B']
    #                 C += section['grades']['C']
    #                 D += section['grades']['D']
    #                 F += section['grades']['F']
    #                 I += section['grades']['I']
    #                 S += section['grades']['S']
    #                 U += section['grades']['U']
    #                 X += section['grades']['X']
    #                 Q += section['grades']['Q']
    #             course_entry = {
    #                 "_id" : department + course,
    #                 "department" : department,
    #                 "course" : course,
    #                 "grades" : {
    #                     "A" : A,
    #                     "B" : B,
    #                     "C" : C,
    #                     "D" : D,
    #                     "F" : F,
    #                     "I" : I,
    #                     "S" : S,
    #                     "U" : U,
    #                     "X" : X,
    #                     "Q" : Q,
    #                     "GPA" : round((A * 4.0 + B * 3.0 + C * 2.0 + D * 1.0) / (A+B+C+D+F), 3),
    #                     "Q_drop_percentage" : round(Q / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
    #                     "A_percentage" : round(A / (A+B+C+D+F+I+S+U+X+Q) * 100, 2) ,
    #                     "B_and_above_percentage" : round((A+B) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
    #                     "pass_percentage" : round((A+B+C) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    #                 }
    #             }
    #             course_entries.append(course_entry)
    #         if len(course_entries) > 100:
    #             set_collection.insert_many(course_entries)
    #             course_entries = []
    #         print(time.time() - START_TIME)
    #     else:
    #         courses = get_collection.find({"department" : department}).distinct('course')
    #         sections = get_collection.find({"department" : department})
    #         A, B, C, D, F, I, S, U, X, Q = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    #         for section in sections:
    #             A += section['grades']['A']
    #             B += section['grades']['B']
    #             C += section['grades']['C']
    #             D += section['grades']['D']
    #             F += section['grades']['F']
    #             I += section['grades']['I']
    #             S += section['grades']['S']
    #             U += section['grades']['U']
    #             X += section['grades']['X']
    #             Q += section['grades']['Q']
    #         department_entry = {
    #             "_id" : department,
    #             "department" : department,
    #             "courses" : courses,
    #             "grades" : {
    #                 "A" : A,
    #                 "B" : B,
    #                 "C" : C,
    #                 "D" : D,
    #                 "F" : F,
    #                 "I" : I,
    #                 "S" : S,
    #                 "U" : U,
    #                 "X" : X,
    #                 "Q" : Q,
    #                 "GPA" : round((A * 4.0 + B * 3.0 + C * 2.0 + D * 1.0) / (A+B+C+D+F), 3),
    #                 "Q_drop_percentage" : round(Q / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
    #                 "A_percentage" : round(A / (A+B+C+D+F+I+S+U+X+Q) * 100, 2) ,
    #                 "B_and_above_percentage" : round((A+B) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2),
    #                 "pass_percentage" : round((A+B+C) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    #             }
    #         }
    #         department_entries.append(department_entry)
    #         set_collection.insert_many(department_entries)
    #         department_entries = []
    # set_collection.insert_many(course_entries)
    # course_entries = []

    professor_entries = []
    professors = get_collection.distinct('professor')
    for professor in professors:
        departments = get_collection.find({"professor" : professor}).distinct('department')
        sections = get_collection.find({"professor" : professor})
        A, B, C, D, F, I, S, U, X, Q = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        for section in sections:
            A += section['grades']['A']
            B += section['grades']['B']
            C += section['grades']['C']
            D += section['grades']['D']
            F += section['grades']['F']
            I += section['grades']['I']
            S += section['grades']['S']
            U += section['grades']['U']
            X += section['grades']['X']
            Q += section['grades']['Q']
        professor_entry = {
            "_id" : professor,
            "professor" : professor,
            "department" : "all",
            "course" : "all",
            "type" : "total",
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
        professor_entries.append(professor_entry)
        for department in departments:
            courses = get_collection.find({"professor" : professor, "department" : department}).distinct("course")
            sections = get_collection.find({"professor" : professor, "department" : department})
            A, B, C, D, F, I, S, U, X, Q = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            for section in sections:
                A += section['grades']['A']
                B += section['grades']['B']
                C += section['grades']['C']
                D += section['grades']['D']
                F += section['grades']['F']
                I += section['grades']['I']
                S += section['grades']['S']
                U += section['grades']['U']
                X += section['grades']['X']
                Q += section['grades']['Q']
            professor_entry = {
                "_id" : professor + department,
                "professor" : professor,
                "department" : department,
                "course" : "all",
                "type" : "department",
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
            professor_entries.append(professor_entry)
            for course in courses:
                sections = get_collection.find({"professor" : professor, "department" : department, "course" : course})
                A, B, C, D, F, I, S, U, X, Q = 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                for section in sections:
                    A += section['grades']['A']
                    B += section['grades']['B']
                    C += section['grades']['C']
                    D += section['grades']['D']
                    F += section['grades']['F']
                    I += section['grades']['I']
                    S += section['grades']['S']
                    U += section['grades']['U']
                    X += section['grades']['X']
                    Q += section['grades']['Q']
                professor_entry = {
                    "_id" : professor + department + course,
                    "professor" : professor,
                    "department" : department,
                    "course" : course,
                    "type" : "course",
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
                professor_entries.append(professor_entry)
        if len(professor_entries) > 1000:
            set_collection.insert_many(professor_entries)
            professor_entries = []
        print(time.time() - START_TIME)


    




















# agg_result= get_collection.aggregate([{
    #     "$group" : {
    #         "_id" : {
    #             "department" : "$department", 
    #             "course" : "$course"}, 
    #         "grades" :  {"$sum" : "$grades.A", "$sum" : "$grades.B"}
    #             # "B" : {"$sum" : "$grades.B"},
    #             # "C" : {"$sum" : "$grades.C"},
    #             # "D" : {"$sum" : "$grades.D"},
    #             # "F" : {"$sum" : "$grades.F"},
    #             # "I" : {"$sum" : "$grades.I"},
    #             # "S" : {"$sum" : "$grades.S"},
    #             # "U" : {"$sum" : "$grades.U"},
    #             # "X" : {"$sum" : "$grades.X"},
    #             # "A" : {"$sum" : "$grades.Q"}
    #     }}
    # ])
    # # for i in agg_result:
    # #     print(i)
    # # print(type(agg_result))
