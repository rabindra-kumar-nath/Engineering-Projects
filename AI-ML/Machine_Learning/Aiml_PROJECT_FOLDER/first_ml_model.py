from sklearn.linear_model import LinearRegression

# Sample training data: study hours and marks
X = [[1], [2], [3], [4], [5], [6], [7], [8]]
y = [35, 42, 50, 58, 65, 73, 80, 88]

# Train the model
model = LinearRegression()
model.fit(X, y)

# Predict marks for 6.5 hours of study
hours = [[6.5]]
prediction = model.predict(hours)

print("Study hours:", hours[0][0])
print("Predicted marks:", round(prediction[0], 2))
