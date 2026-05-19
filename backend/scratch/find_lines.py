target_classes = [
    "C113TeacherBodies",
    "C212Reservation",
    "C263PassPercentage",
    "C313Events",
    "C333Outreach",
    "C341Collaborations",
    "C3SanctionedPosts",
    "C4Expenditure"
]

with open("models/models.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    for cls in target_classes:
        if f"class {cls}" in line:
            print(f"Class {cls} found at line {i+1}: {line.strip()}")
            # print next 5 lines
            for j in range(1, 6):
                if i + j < len(lines):
                    print(f"  Line {i+j+1}: {lines[i+j].rstrip()}")
