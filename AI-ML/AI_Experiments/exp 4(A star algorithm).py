def a_star(graph, heuristic, start, goal):
    open_list = [start]
    closed_list = []

    # Cost from the start node to each node
    g_cost = {start: 0}

    # Parent dictionary to reconstruct the path
    parent = {start: None}

    while open_list:
        # Select the node with minimum f(n) = g(n) + h(n)
        current = open_list[0]

        for node in open_list:
            f_current = g_cost[current] + heuristic[current]
            f_node = g_cost[node] + heuristic[node]

            if f_node < f_current:
                current = node

        # Check whether the goal has been reached
        if current == goal:
            path = []
            temp = current

            while temp is not None:
                path.append(temp)
                temp = parent[temp]

            path.reverse()

            print("\nShortest Path:", " -> ".join(path))
            print("Total Cost:", g_cost[goal])
            return

        open_list.remove(current)
        closed_list.append(current)

        # Check all neighboring nodes
        for neighbor, cost in graph[current]:
            new_cost = g_cost[current] + cost

            # Update if a better path is found
            if new_cost < g_cost.get(neighbor, float("inf")):
                g_cost[neighbor] = new_cost
                parent[neighbor] = current

                # Reopen the node if a better path is found
                if neighbor in closed_list:
                    closed_list.remove(neighbor)

                if neighbor not in open_list:
                    open_list.append(neighbor)

    print("\nNo path found.")


# ---------------- USER INPUT ----------------

graph = {}

n = int(input("Enter number of nodes: "))

print("\nEnter node names:")
nodes = []

for i in range(n):
    node = input(f"Node {i + 1}: ").strip()
    nodes.append(node)
    graph[node] = []

# Enter edges
e = int(input("\nEnter number of edges: "))

print("\nEnter edges in the following format:")
print("Source Destination Cost")

for i in range(e):
    source = input(f"\nEdge {i + 1} source: ").strip()
    destination = input(f"Edge {i + 1} destination: ").strip()
    cost = int(input("Cost: "))

    if source not in graph or destination not in graph:
        print("Error: Enter only previously defined nodes.")
        raise SystemExit

    if cost < 0:
        print("Error: Edge costs must be non-negative.")
        raise SystemExit

    graph[source].append((destination, cost))

# Enter heuristic values
heuristic = {}

print("\nEnter heuristic values h(n):")

for node in nodes:
    heuristic[node] = int(input(f"h({node}): "))

# Enter start and goal nodes
start = input("\nEnter start node: ").strip()
goal = input("Enter goal node: ").strip()

if start not in graph or goal not in graph:
    print("Error: Start or goal node does not exist.")
    raise SystemExit

# Run A* Algorithm
a_star(graph, heuristic, start, goal)
