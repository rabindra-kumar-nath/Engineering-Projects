def DFS(graph, start_node):
    visited = []
    stack = [start_node]
    
    while stack:
        # BUG: pop(0) makes this behave like BFS (Queue) instead of DFS (Stack)
        current_node = stack.pop(0) 
        
        if current_node not in visited:
            print(f"Exploring node: {current_node}")
            visited.append(current_node)
            
            for neighbour in graph.get(current_node, []):
                if neighbour not in visited and neighbour not in stack:
                    stack.append(neighbour)
                    
    return visited

print("------")
student_graph = {}
num_edges = int(input("How many edges does your graph have? "))
print("Enter each edge separated by spaces:")

for i in range(num_edges):
    u, v = input(f"Edge {i+1}: ").split()
    
    # Initialize adjacency list keys if not present
    if u not in student_graph:
        student_graph[u] = []
    if v not in student_graph:
        student_graph[v] = []
        
    # Append edges to create an undirected graph
    student_graph[u].append(v)
    student_graph[v].append(u)
#to execute the traversal
start = input("Enter the starting node for DFS: ")
print(f"\nYour Graph Dictionary: {student_graph}")
print("starting DFS Traversal...")

# Call the function
DFS(student_graph, start)
