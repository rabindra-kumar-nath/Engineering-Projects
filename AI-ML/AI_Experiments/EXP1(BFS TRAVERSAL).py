def bfs(graph, start):
    visited = []
    queue = []

    visited.append(start)
    queue.append(start)

    while queue:
        node = queue.pop(0)
        print(node, end=" ")

        for neighbour in graph[node]:
            if neighbour not in visited:
                visited.append(neighbour)
                queue.append(neighbour)


print("----- Build your graph -----")

student_graph = {}

num_edges = int(input("How many edges does your graph have? "))

print("Enter each edge separated by a space:")

for i in range(num_edges):
    u, v = input(f"Edge {i+1}: ").split()

    if u not in student_graph:
        student_graph[u] = []

    if v not in student_graph:
        student_graph[v] = []

    student_graph[u].append(v)
    student_graph[v].append(u)

start = input("Enter the starting node for BFS: ")

print("\nYour graph dictionary:", student_graph)
print("Starting BFS traversal:")
bfs(student_graph, start)
