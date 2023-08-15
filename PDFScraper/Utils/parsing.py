import re
from PyPDF2 import PdfReader


# FIXME: update this to have future years
def get_semester_and_year(text, valid_semesters, valid_years, from_file_name=False, file_name=""):
    if from_file_name:
        year = file_name[0:4]
        semester_indicator = file_name[4]
        if semester_indicator == '1':
            semester = "SPRING"
        elif semester_indicator == '2':
            semester = "SUMMER"
        elif semester_indicator == '3':
            semester = "FALL"
        else:
            print(
                "ALERT: semester indicator is not valid, the fifth number in the filename should be 1, 2, or 3")
        return semester, year
    if not isinstance(text, list) and not isinstance(text, str):
        raise TypeError(
            "Text passed to get semester and year must be a list or a string")
    num_of_valid_semesters = 0
    num_of_valid_years = 0
    beginning_of_pdf_text = text[0:50]
    for valid_semester in valid_semesters:
        if valid_semester in beginning_of_pdf_text:
            num_of_valid_semesters += 1
            semester = valid_semester
    if num_of_valid_semesters == 0:
        print("No valid semester found in parsed text!")
    elif num_of_valid_semesters > 1:
        print("More than one valid semester found in parsed text!")
    for valid_year in valid_years:
        if valid_year in beginning_of_pdf_text:
            num_of_valid_years += 1
            year = valid_year
    if num_of_valid_years == 0:
        print("No valid year found in parsed text!")
    elif num_of_valid_years > 1:
        print("More than one valid year found in parsed text!")
    return semester, year


def is_section_tag(section_tag):
    from Utils.constants import SECTION_PATTERN
    return re.fullmatch(SECTION_PATTERN, section_tag)


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


def get_section_grades_list(section_tag_index, pdf_text, pdf_type="NEW"):
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
                X = int(pdf_text[section_tag_index+percent_location+10])
                Q = int(pdf_text[section_tag_index+percent_location+11])
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
        X = int(pdf_text[section_tag_index+15])
        Q = int(pdf_text[section_tag_index+16])
    grades = [A, B, C, D, F, I, S, U, X, Q]
    return grades


def get_section_tag_indices_and_retain_pdf_text(grade_file):
    reader = PdfReader(grade_file)
    pdf_text = []
    section_tag_indices = []
    for page_number in range(len(reader.pages)):
        page = reader.pages[page_number]
        text = page.extract_text().split()
        pdf_text.extend(text)
    for i, text in enumerate(pdf_text):
        if is_section_tag(text):
            section_tag_indices.append(i)
    return section_tag_indices, pdf_text


def populate_section_info(section_tag_indices, pdf_text, semester, year, section_documents_list, college="", pdf_type="NEW"):
    for i, section_tag_index in enumerate(section_tag_indices):
        section_tag = pdf_text[section_tag_index]
        department, course, section = parse_section_tag(section_tag)
        grades = get_section_grades_list(section_tag_index, pdf_text, pdf_type)
        professor = get_professor_entry(pdf_text, section_tag_index, pdf_type)
        # Galveston and Qatar section id collisions fixed by appending GV and QT
        if (college == "GV" or college == "QT"):
            section_id = department + course + section + semester + year + college
        else:
            section_id = department + course + section + semester + year + college
        section_documents_list.append(
            {
                '_id': section_id,
                "department": department,
                "course": course,
                "semester": semester,
                "year": year,
                "section": section,
                "professor": professor,
                "grades": grades
            }
        )
    return section_documents_list


def grade_file_follows_format(grade_file):
    from Utils.constants import FILE_PATTERN
    return re.search(FILE_PATTERN, grade_file)


def get_college_from_file(file_name):
    college = file_name[5:7]
    return college


def is_old_pdf(year, semester):
    if (int(year) < 2016):
        return True
    if (int(year) == 2016 and semester == "SPRING"):
        return True
    if (int(year) == 2016 and semester == "SUMMER"):
        return True
    return False
