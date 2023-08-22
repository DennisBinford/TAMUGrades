from Utils.collectionaggregation import aggregate_collection


if __name__ == "__main__":
    aggregate_collection("Sections", "Courses", {"department" : "$department", "course" : "$course"}, "course")
    aggregate_collection("Sections", "Departments", "$department", "department")
    aggregate_collection("Sections", "Professors", {"professor" : '$professor', "department" : "$department", "course" : "$course"}, "professor_course")
    aggregate_collection("Sections", "Professors", {"professor" : '$professor', "department" : "$department"}, "professor_department")
    aggregate_collection("Sections", "Professors", "$professor", "professor_total")
    