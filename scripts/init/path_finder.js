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
        this.blocked = [];
    }

    reset(from, to) {
        this.from = from;
        this.to = to;
        this.prev = {};
        this.dist = {};
        this.tin = {};
        this.memory = 0;
        this.time = 0;
    }

    run(from, to) {
        let t = new Timer();
        this.reset(from, to);
        let timer = 0;
        let [graph, prev, dist, tin, h] = [this.graph, this.prev, this.dist, this.tin, this.distance_heuristic];
        prev[from] = from;
        dist[from] = 0;
        tin[from] = timer++;
        let heap = new BinaryHeap();
        heap.insert(h(from, to, timer) + dist[from], from);
        let visits = 0;
        while (!heap.isEmpty() && !prev[to]) {
            let u = heap.extractMinimum().value;
            visits++;
            graph.get_adjacent(u).forEach(v => {
                if (this.blocked.some(o => eq(v, o))) return;
                if (dist[v] === undefined || dist[v] > dist[u] + 1) { // default edge len: 1
                    prev[v] = u;
                    dist[v] = dist[u] + 1;
                    tin[v] = timer++;
                    heap.insert(h(v, to, timer) + dist[v], v);
                }
            });
            this.memory = Math.max(this.memory, heap.size()*32);
        }
        this.path = this.get_path();
        this.time = t.get_delta();
        this.memory += 3*32*visits;
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

function GetDFSPathFinder(graph) {
    return new AStar(graph, (u, v, t) => -t);
}

function GetBFSPathFinder(graph) {
    return new AStar(graph, (u, v) => 0);
}

function GetManhattanAStarPathFinder(graph) {
    return new AStar(graph, (u, v) => math.norm(math.subtract(u, v), 1));
}