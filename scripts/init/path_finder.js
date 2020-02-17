class Graph {
    constructor() {
        this.edges = {};
    }

    add_edge(u, v) {
        this.add_directed_edge(u, v);
        this.add_directed_edge(v, u);
    }

    add_directed_edge(u, v) {
        if (this.edges.hasOwnProperty(u)) {
            this.edges[u].push(v);
        } else {
            this.edges[u] = [v];
        }
    }

    get_adjacent(u) {
        if (this.edges.hasOwnProperty(u)) {
            return this.edges[u];
        }
        return [];
    }
}

class AStar {
    constructor(graph, distance_estimation) {
        this.graph = graph;
        this.distance_heuristic = distance_estimation;
    }

    reset(from, to) {
        this.from = from;
        this.to = to;
        this.prev = {};
        this.dist = {};
    }

    run(from, to) {
        this.reset(from, to);
        let [graph, prev, dist, h] = [this.graph, this.prev, this.dist, this.distance_heuristic];
        prev[from] = from;
        dist[from] = 0;
        let heap = new BinaryHeap();
        heap.insert(h(from, to), from);
        while (!heap.isEmpty() && !prev[to]) {
            let u = heap.extractMinimum().value;
            graph.get_adjacent(u).forEach(v => {
                if (dist[v] === undefined || dist[v] > dist[u] + 1) { // default edge len: 1
                    prev[v] = u;
                    dist[v] = dist[u] + 1;
                    heap.insert(h(v, to) + dist[v], v);
                }
            });
        }
        this.path = this.get_path();
    }

    get_path() {
        if (!this.prev[this.to]) return [];
        let path = [];
        let ptr = this.to;
        while (this.prev[ptr] !== ptr) {
            path.push(ptr);
            ptr = this.prev[ptr];
        }
        path.push(ptr);
        path.reverse();
        return path;
    }
}

function GetBFSPathFinder(graph) {
    return new AStar(graph, (u, v) => 0);
}

function GetManhattanAStarPathFinder(graph) {
    return new AStar(graph, (u, v) => math.norm(math.subtract(u, v), 1));
}