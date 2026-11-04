
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

# 1. Create a sample student dataset
data = {
    "StudyHours": [1, 2, 3, 4, 5, 6, 7, 8, 2, 5, 7, 3],
    "Attendance": [50, 55, 60, 65, 70, 75, 80, 90, 60, 85, 95, 70],
    "PreviousMarks": [40, 45, 50, 55, 60, 65, 75, 85, 48, 68, 78, 52],
    "FinalMarks": [35, 40, 48, 52, 60, 68, 78, 90, 42, 70, 82, 50]
}

df = pd.DataFrame(data)

# 2. Select input features and target
X = df[["StudyHours", "Attendance", "PreviousMarks"]]
y = df["FinalMarks"]

# 3. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42
)

# 4. Train the machine-learning model
model = LinearRegression()
model.fit(X_train, y_train)

# 5. Evaluate the model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)

print("=" * 40)
print("STUDENT PERFORMANCE PREDICTION")
print("=" * 40)

print(f"\nMean Absolute Error: {mae:.2f} marks")

# 6. Predict marks for a new student
new_student = pd.DataFrame([{
    "StudyHours": 6,
    "Attendance": 80,
    "PreviousMarks": 70
}])

predicted_marks = model.predict(new_student)[0]

print("\nNEW STUDENT DETAILS")
print("Study hours: 6")
print("Attendance: 80%")
print("Previous marks: 70")
print(f"Predicted final marks: {predicted_marks:.2f}")

# 7. Plot actual marks against predicted marks
plt.figure(figsize=(7, 5))

plt.scatter(
    y_test,
    predictions,
    label="Test predictions"
)

# Ideal prediction reference line
plt.plot(
    [0, 100],
    [0, 100],
    "r--",
    label="Ideal prediction"
)

plt.xlabel("Actual Marks")
plt.ylabel("Predicted Marks")
plt.title("Actual vs Predicted Student Marks")
plt.xlim(0, 100)
plt.ylim(0, 100)
plt.grid(True)
plt.legend()
plt.tight_layout()

# 8. Save the graph and close the figure
plt.savefig(
    "performance_prediction.png",
    dpi=150,
    bbox_inches="tight"
)
plt.close()

print("\nGraph saved as performance_prediction.png")
print("\nProgram completed successfully!")
