def get_file_pattern(grade_file):
    from Utils.constants import FILE_PATTERN
    import re
    file_pattern_match = re.search(FILE_PATTERN, grade_file)
    file_pattern = file_pattern_match.group(0)
    return file_pattern


def get_semester_year_college(file_pattern):
    year = file_pattern[0:4]
    college = file_pattern[5:7]
    semester_number = file_pattern[4]
    match semester_number:
        case '1':
            semester = "SPRING"
        case '2':
            semester = "SUMMER"
        case '3':
            semester = "FALL"
        case _:
            print("Semester was not found in file name.")
    return semester, year, college


def valid_section_tag(section_tag):
    if not isinstance(section_tag, str):
        raise TypeError("Section tag must be a string")
        return False
    if not is_section_tag(section_tag):
        print("Section tag did not match the pattern")
        return False
    return True


def parse_section_tag(section_tag):
    if not valid_section_tag(section_tag):
        return
    if (section_tag[4] == '-'):
        department = section_tag[0:4].upper()
        course = section_tag[5:8]
        section = section_tag[9:12]
    else:  # School of Law Exception
        department = section_tag[0:3].upper()
        course = section_tag[4:7]
        section = section_tag[8:11]
    return department, course, section


def get_professor_entry(text_list, section_tag_index, pdf_type="NEW", in_loop_first_time=True):
    if pdf_type == "OLD":
        counter = 2
        if not valid_section_tag(text_list[section_tag_index]):
            return
        default_text = text_list[section_tag_index + counter]
        # corner case where there was no professor listed, need to manually verify these
        if is_section_tag(default_text) or default_text == "COURSE" or default_text == "SECTION":
            professor = "None"
            return professor
        professor = default_text
        loop_exit_condition = 0
        while (loop_exit_condition <= 50):
            counter += 1
            text = text_list[section_tag_index + counter]
            # FIXME: section breakpoints function?
            if '%' in text:
                break
            else:
                professor = professor + " " + text
            loop_exit_condition += 1
        return professor
    else:
        counter = 18
        if not valid_section_tag(text_list[section_tag_index]):
            return
        default_text = text_list[section_tag_index + counter]
        # corner case where there was no professor listed, need to manually verify these
        if is_section_tag(default_text) or default_text == "COURSE" or default_text == "SECTION":
            professor = "None"
            return professor
        professor = default_text
        loop_exit_condition = 0
        while (loop_exit_condition <= 50):
            counter += 1
            text = text_list[section_tag_index + counter]
            # FIXME: section breakpoints function?
            if is_section_tag(text) or text == "COURSE" or text == "SECTION":
                break
            else:
                professor = professor + " " + text
            loop_exit_condition += 1
        return professor


def extract_grades_from_pdf(section_tag_index, pdf_text, pdf_type="NEW"):
    if pdf_type == "OLD":
        counter = 1
        percent_location = 0
        while (counter < 50):
            if '%' in pdf_text[section_tag_index+counter]:
                percent_location = counter
            if percent_location > 0:
                A = int(pdf_text[section_tag_index+percent_location+1])
                B = int(pdf_text[section_tag_index+percent_location+2])
                C = int(pdf_text[section_tag_index+percent_location+3])
                D = int(pdf_text[section_tag_index+percent_location+4])
                F = int(pdf_text[section_tag_index+percent_location+5])
                I = int(pdf_text[section_tag_index+percent_location+7])
                S = int(pdf_text[section_tag_index+percent_location+8])
                U = int(pdf_text[section_tag_index+percent_location+9])
                Q = int(pdf_text[section_tag_index+percent_location+10])
                X = int(pdf_text[section_tag_index+percent_location+11])
                break
            counter += 1
    else:
        A = int(pdf_text[section_tag_index+1])
        B = int(pdf_text[section_tag_index+3])
        C = int(pdf_text[section_tag_index+5])
        D = int(pdf_text[section_tag_index+7])
        F = int(pdf_text[section_tag_index+9])
        I = int(pdf_text[section_tag_index+12])
        S = int(pdf_text[section_tag_index+13])
        U = int(pdf_text[section_tag_index+14])
        Q = int(pdf_text[section_tag_index+15])
        X = int(pdf_text[section_tag_index+16])
    return A, B, C, D, F, I, S, U, Q, X


def get_extra_grade_info(A, B, C, D, F, I, S, U, Q, X):
    GPA = round((A * 4.0 + B * 3.0 + C * 2.0 + D * 1.0) / (A+B+C+D+F), 3)
    Q_PERCENT = round(Q / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    A_PERCENT = round(A / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    B_PERCENT = round((A+B) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    C_PERCENT = round((A+B+C) / (A+B+C+D+F+I+S+U+X+Q) * 100, 2)
    return GPA, Q_PERCENT, A_PERCENT, B_PERCENT, C_PERCENT


def get_section_grades(section_tag_index, pdf_text, pdf_type="NEW"):
    A, B, C, D, F, I, S, U, Q, X = extract_grades_from_pdf(
        section_tag_index, pdf_text, pdf_type)
    GPA, Q_PERCENT, A_PERCENT, B_PERCENT, C_PERCENT = get_extra_grade_info(
        A, B, C, D, F, I, S, U, Q, X)
    grades = {
        "a": A,
        "b": B,
        "c": C,
        "d": D,
        "f": F,
        "i": I,
        "s": S,
        "u": U,
        "q": Q,
        "x": X,
        "gpa": GPA,
        "q_percent": Q_PERCENT,
        "a_percent": A_PERCENT,
        "b_percent": B_PERCENT,
        "c_percent": C_PERCENT
    }
    return grades


def extract_pdf_text(pdf):
    from PyPDF2 import PdfReader
    reader = PdfReader(pdf)
    pdf_text_list = []
    for page_number in range(len(reader.pages)):
        page = reader.pages[page_number]
        text = page.extract_text().split()
        pdf_text_list.extend(text)
    return pdf_text_list


def is_section_tag(section_tag):
    from Utils.constants import SECTION_PATTERN
    import re
    return re.fullmatch(SECTION_PATTERN, section_tag)


def get_section_tag_indices(text_list):
    section_tag_indices = []
    for i, text in enumerate(text_list):
        if is_section_tag(text):
            section_tag_indices.append(i)
    return section_tag_indices


def populate_section_document(pdf_text, section_tag_index, semester, year, college, pdf_type):
    section_tag = pdf_text[section_tag_index]
    department, course, section = parse_section_tag(section_tag)
    grades = get_section_grades(section_tag_index, pdf_text, pdf_type)
    professor = get_professor_entry(pdf_text, section_tag_index, pdf_type)
    # Galveston and Qatar section id collisions fixed by appending college to id, also helps with identifying which pdf the section is from
    section_id = department + course + section + semester + year + college
    section_document = {
        '_id': section_id,
        "department": department,
        "course": course,
        "semester": semester,
        "year": year,
        "section": section,
        "professor": professor,
        "grades": grades
    }
    return section_document


def is_old_pdf(semester, year):
    if int(year) < 2016:
        return True
    if int(year) == 2016 and semester == "SPRING":
        return True
    if int(year) == 2016 and semester == "SUMMER":
        return True
    return False


def get_section_documents(file):
    section_documents = []
    file_name = get_file_pattern(file)
    pdf_text_list = extract_pdf_text(file)
    section_tag_indices = get_section_tag_indices(pdf_text_list)
    semester, year, college = get_semester_year_college(file_name)

    beginning_text = pdf_text_list[0:50]
    if semester not in beginning_text or year not in beginning_text:
        raise Exception("Semester", semester, "and year", year, "mismatch")

    if is_old_pdf(semester, year):
        pdf_type = "OLD"
    else:
        pdf_type = "NEW"

    for section_tag_index in section_tag_indices:
        section_document = populate_section_document(
            pdf_text_list, section_tag_index, semester, year, college, pdf_type)
        section_documents.append(section_document)

    return section_documents
