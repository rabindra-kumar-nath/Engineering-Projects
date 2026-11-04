# Min-Max Algorithm in Python

def mini_max(depth, node_index, is_max, scores, height):

    if depth == height:
        return scores[node_index]

    if is_max:
        left = mini_max(depth + 1, node_index * 2,
                        False, scores, height)

        right = mini_max(depth + 1, node_index * 2 + 1,
                         False, scores, height)

        return max(left, right)

    else:
        left = mini_max(depth + 1, node_index * 2,
                        True, scores, height)

        right = mini_max(depth + 1, node_index * 2 + 1,
                         True, scores, height)

        return min(left, right)


# -------------------- USER INPUT --------------------

n = int(input("Enter number of leaf nodes:"))

scores = []

print("Enter the values of leaf nodes:")

for i in range(n):
    value = int(input(f"Value {i+1}:"))
    scores.append(value)

height = 0
temp = n
