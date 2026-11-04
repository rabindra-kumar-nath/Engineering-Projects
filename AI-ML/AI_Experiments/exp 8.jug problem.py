import collections
from collections import deque

#Function to solve water jug problem using BFS
def water_jug(capacity1, capacity2, target):
  visited = set()
  queue = deque()

  #Initial state:both jugs are empty
  queue.append((0, 0, []))

  while queue:
    jug1, jug2, path = queue.popleft()

    #skip if the state has already been visited
    if (jug1, jug2) in visited:
      continue

    visited.add((jug1, jug2))

    #Add current state to the path
    path = path + [(jug1, jug2)]

    #Check if target is reached
    if jug1 == target or jug2 == target:
       return path
    #Generate all possible next states
    next_states = [

      #Fill jug 1
      (capacity1, jug2),

      #Fill jug 2
      (jug1, capacity2),

      #Empty Jug1
      (0, jug2),

      #Empty jug2
      (jug1, 0),

      #Pour jug 1-> jug 2
      (jug1 - min(jug1, capacity2 - jug2),
       jug2 + min(jug1, capacity2 - jug2)
       ),

       #Pour jug 2 -> jug 1
       (
        jug1 + min(jug2, capacity1 - jug1),
        jug2 - min(jug2, capacity1 - jug1)
       )
    ]

    #Add unvisited states to the queue
    for state in next_states:
      if state not in visited:
        queue.append((state[0], state[1], path))

  #No solution found
  return None

#Main Program
jug1 = int(input("Enter capacity of jug 1: "))
jug2 = int(input("Enter capacity of jug 2: "))
target = int(input("Enter target amount: "))

solution = water_jug(jug1, jug2, target)

if solution:
  print("\nSteps to reach the target:")

  for step in solution:
    print(step)

else:
  print("No solution exists.")

