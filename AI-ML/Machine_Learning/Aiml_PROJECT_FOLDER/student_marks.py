
import pandas as pd
import matplotlib.pyplot as plt

# Student marks data
data = {
    "Subject": ["Python", "Mathematics", "Statistics", "AI/ML", "DBMS"],
    "Marks": [85, 78, 92, 88, 81]
}

# Create a DataFrame
df = pd.DataFrame(data)

# Display marks analysis
print("STUDENT MARKS ANALYSIS")
print(df.to_string(index=False))

print(f"\nAverage marks: {df['Marks'].mean():.1f}")
print(f"Highest marks: {df['Marks'].max()}")
print(f"Lowest marks: {df['Marks'].min()}")

# Create the bar chart
ax = df.plot(
    x="Subject",
    y="Marks",
    kind="bar",
    legend=False,
    figsize=(9, 5)
)

ax.set_title("Student Marks Analysis")
ax.set_xlabel("Subject")
ax.set_ylabel("Marks")
ax.set_ylim(0, 100)

plt.xticks(rotation=20)
plt.tight_layout()

# Save the graph instead of opening a separate window
plt.savefig("student_marks.png", dpi=150, bbox_inches="tight")
plt.close()

print("\nGraph saved successfully as student_marks.png")
