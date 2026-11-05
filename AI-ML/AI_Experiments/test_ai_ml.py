# ==================================================
# PROJECT: RABINDRA AI/ML
# MODULE: PYTHON DEBUGGING AND TESTING
# ==================================================

import sys

# 1. Student Information
student = {
    "name": "Rabindra",
    "age": 21,
    "course": "CSE AI & ML",
    "project": "Rabindra AI Website",
    "skills": ["Python", "Java", "React", "TypeScript"],
}


# 2. Calculate Average Marks
def calculate_average(marks):

    total = sum(marks)  # Set breakpoint here

    average = total / len(marks)

    return average


# 3. Display Student Details
def display_student():

    print("\n========== STUDENT DETAILS ==========")

    print("Name:", student["name"])
    print("Age:", student["age"])
    print("Course:", student["course"])
    print("Project:", student["project"])

    print("\nTechnical Skills:")

    for index, skill in enumerate(student["skills"], start=1):
        print(f"{index}. {skill}")


# 4. Display Academic Performance
def display_performance():

    marks = [85, 78, 92, 80, 88]

    print("\n========== ACADEMIC PERFORMANCE ==========")

    print("Student Marks:", marks)

    average = calculate_average(marks)

    print("Average Marks:", average)
    print("Maximum Marks:", max(marks))
    print("Minimum Marks:", min(marks))

    if average >= 90:
        print("Grade: A+")

    elif average >= 80:
        print("Grade: A")

    elif average >= 70:
        print("Grade: B")

    else:
        print("Grade: C")


# 5. Main Function
def main():

    print("======================================")
    print("       RABINDRA AI/ML ENVIRONMENT")
    print("======================================")

    print("Python Version:", sys.version.split()[0])

    display_student()

    display_performance()

    print("\n======================================")
    print("     ALL TESTS COMPLETED SUCCESSFULLY")
    print("======================================")


# 6. Program Execution
if __name__ == "__main__":
    main()
