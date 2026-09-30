class DisjointSet:
    def __init__(self, vertices):
        self.parent = {vertex: vertex for vertex in vertices}

    def find(self, vertex):
        if self.parent[vertex] != vertex:
            self.parent[vertex] = self.find(self.parent[vertex])
        return self.parent[vertex]

    def union(self, left, right):
        self.parent[self.find(left)] = self.find(right)


def kruskal(vertices, edges):
    """Return the edges of a minimum spanning forest."""
    forest = DisjointSet(vertices)
    chosen = []

    for weight, u, v in sorted(edges):
        if forest.find(u) != forest.find(v):
            forest.union(u, v)
            chosen.append((u, v, weight))

    return chosen
