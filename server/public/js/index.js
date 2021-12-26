var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Adapter = /** @class */ (function () {
    function Adapter() {
    }
    Adapter.parseGraphToString = function (input) {
        var output = "";
        input.getEdges().map(function (edge) {
            output += edge.from.index - 1 + ";" + (edge.to.index - 1) + ";" + edge.getWeight() + "|";
        });
        output = output.substr(0, output.length - 1);
        return output;
    };
    Adapter.parseStringToGraph = function (input, countVertices) {
        var output = new Graph();
        var getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        // add vertices
        for (var index = 0; index < countVertices; index++) {
            output.addVertex(Math.ceil(getRandomArbitrary(10, canvas.width - 10)), Math.ceil(getRandomArbitrary(10, canvas.height - 10)));
        }
        var arrayOfVertices = input.substr(1, input.length - 2).split(";");
        arrayOfVertices = arrayOfVertices.slice(0, arrayOfVertices.length - 1);
        arrayOfVertices.map(function (vertex) {
            vertex.split(",").map(function (_vertex) {
                if (!!_vertex.trim()) {
                    try {
                        var matchEdge = _vertex.match(/-\[(\d+)\]->\((\d+)\)/i);
                        var indexStartVertex = Number(vertex.trim().substr(0, 1));
                        var indexEndVertex = Number(matchEdge[2]);
                        var weightVertex = Number(matchEdge[1]);
                        output.addEdge(output.getVertex(indexStartVertex), output.getVertex(indexEndVertex), weightVertex);
                        console.log(indexStartVertex, indexEndVertex, weightVertex);
                    }
                    catch (e) { }
                }
            });
        });
        // Parse
        // input.split("|").map((stringEdge, index) => {
        // 	const separateStringEdge = stringEdge.split(";")
        // 	const startVertex = Number(separateStringEdge[0])
        // 	const endVertex = Number(separateStringEdge[1])
        // 	const weightVertex = Number(separateStringEdge[2])
        // 	output.addEdge(output.getVertex(startVertex), output.getVertex(endVertex), weightVertex)
        // })
        return output;
    };
    return Adapter;
}());
var Painter = /** @class */ (function () {
    function Painter(canvas, contex) {
        this.strokeStyle = '#009999';
        this.fillStyle = '#22cccc';
        this.markfillStyle = "red";
        this.markStartStyle = "blue";
        this.markEndStyle = "red";
        this.canvas = canvas;
        this.ctx = contex;
    }
    Painter.prototype.draw = function (vertices, edges, path) {
        var _this = this;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        var getColor = function (edge) {
            if (edge.marked)
                return _this.markfillStyle;
            return _this.strokeStyle;
        };
        for (var i = 0; i < edges.length; i++) {
            var fromNode = edges[i].from;
            var toNode = edges[i].to;
            this.ctx.beginPath();
            this.ctx.strokeStyle = getColor(edges[i]);
            this.ctx.moveTo(fromNode.x, fromNode.y);
            this.ctx.lineTo(toNode.x, toNode.y);
            this.ctx.font = "12px sans-serif";
            this.ctx.fillStyle = "red";
            this.ctx.fillText(String(edges[i].weight || edges[i].getWeight()), (fromNode.x + toNode.x) / 2 - 6, (fromNode.y + toNode.y) / 2 + 6);
            this.ctx.stroke();
        }
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            this.ctx.beginPath();
            this.ctx.fillStyle = vertex.selected ? vertex.selectedFill : vertex.fillStyle;
            this.ctx.arc(vertex.x, vertex.y, vertex.radius, 0, Math.PI * 2, true);
            if (vertex.isStart)
                this.ctx.fillStyle = this.markStartStyle;
            else if (vertex.isEnd)
                this.ctx.fillStyle = this.markEndStyle;
            else
                this.ctx.fillStyle = vertex.selected ? vertex.selectedFill : vertex.fillStyle;
            this.ctx.strokeStyle = (vertex.strokeStyle || this.strokeStyle);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.textAlign = "center";
            this.ctx.font = "16px sans-serif";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(String(i), vertex.x, vertex.y + 6);
        }
    };
    Painter.prototype.resize = function () {
        canvas.width = window.innerWidth - 270;
        canvas.height = window.innerHeight;
    };
    Painter.prototype.clearPlane = function (x, y) {
        if (x === void 0) { x = this.canvas.width; }
        if (y === void 0) { y = this.canvas.height; }
        this.ctx.clearRect(0, 0, x, y);
    };
    return Painter;
}());
var Edge = /** @class */ (function () {
    function Edge(to, from, weight) {
        this.weight = 0;
        this.marked = false;
        this.to = to;
        this.from = from;
        this.weight = weight || 0;
    }
    Edge.prototype.getWeight = function () {
        return this.weight || Math.ceil(Math.sqrt(Math.pow(this.from.x - this.to.x, 2) +
            Math.pow(this.from.y - this.to.y, 2)));
    };
    Edge.prototype.setMark = function (marked) {
        this.marked = marked;
        return this;
    };
    return Edge;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.vertices = [];
        this.edges = [];
        this.selection = null;
        this.painter = new Painter(canvas, context);
        this.painter.resize();
    }
    Graph.prototype.within = function (x, y) {
        return this.vertices.find(function (n) {
            return x > (n.x - n.radius) &&
                y > (n.y - n.radius) &&
                x < (n.x + n.radius) &&
                y < (n.y + n.radius);
        });
    };
    Graph.prototype.move = function (e) {
        if (this.selection && e.buttons) {
            this.selection.x = e.x;
            this.selection.y = e.y;
            this.painter.draw(this.getVertices(), this.getEdges());
        }
    };
    Graph.prototype.up = function (e) {
        if (!this.selection) {
            this.addVertex(e.x, e.y);
            console.log(this);
        }
        if (this.selection && !this.selection.selected) {
            this.selection = null;
        }
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    Graph.prototype.down = function (e) {
        var target = this.within(e.x, e.y);
        if (this.selection && this.selection.selected) {
            this.selection.selected = false;
        }
        if (target) {
            if (e.altKey) {
                this.deleteVertex(target);
                this.selection = target;
                this.selection.selected = false;
            }
            else if (e.ctrlKey) {
                this.markVertex(target, "start");
                this.startVertex = target;
                this.selection = target;
                this.selection.selected = false;
                e.preventDefault();
            }
            else if (e.shiftKey) {
                this.markVertex(target, "end");
                this.endVertex = target;
                this.selection = target;
                this.selection.selected = false;
                e.preventDefault();
            }
            else {
                console.log("Тоже ");
                if (this.selection && this.selection !== target) {
                    this.edges.push(new Edge(target, this.selection));
                }
                this.selection = target;
                this.selection.selected = true;
                this.painter.draw(this.getVertices(), this.getEdges());
            }
        }
    };
    Graph.prototype.markVertex = function (target, color) {
        if (color === "start")
            this.vertices = __spreadArray([], this.getVertices().map(function (vertex) { return vertex.index === target.index ? __assign(__assign({}, vertex), { isStart: true }) : __assign(__assign({}, vertex), { isStart: false }); }), true);
        else if (color === "end")
            this.vertices = __spreadArray([], this.getVertices().map(function (vertex) { return vertex.index === target.index ? __assign(__assign({}, vertex), { isEnd: true }) : __assign(__assign({}, vertex), { isEnd: false }); }), true);
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    Graph.prototype.markPath = function (path) {
        var edges = this.getEdges().map(function (edge) { return edge.setMark(false); });
        console.log(edges);
        for (var index = 0; index < path.length - 1; index++) {
            var pathBetweenVertices = [path[index], path[index + 1]];
            for (var i = 0; i < edges.length; i++) {
                var fromNode = edges[i].from;
                var toNode = edges[i].to;
                if (pathBetweenVertices[0] === fromNode.index - 1 && pathBetweenVertices[1] === toNode.index - 1 ||
                    pathBetweenVertices[1] === fromNode.index - 1 && pathBetweenVertices[0] === toNode.index - 1) {
                    this.edges[i].marked = true;
                }
            }
        }
        console.log(edges);
        this.painter.draw(this.getVertices(), edges);
    };
    Graph.prototype.addVertex = function (x, y) {
        this.vertices.push({
            index: this.getVertices().length + 1,
            x: x,
            y: y,
            radius: 20,
            fillStyle: '#22cccc',
            strokeStyle: '#009999',
            selectedFill: '#88aaaa',
            selected: false,
            isStart: false,
            isEnd: false
        });
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    Graph.prototype.addEdge = function (to, from, weight) {
        this.edges.push(new Edge(to, from, weight));
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    Graph.prototype.getVertex = function (index) {
        return this.vertices[index];
    };
    Graph.prototype.getVertices = function () {
        return this.vertices;
    };
    Graph.prototype.equalVertex = function (v1, v2) {
        return v1.x === v2.x && v2.y === v2.y;
    };
    Graph.prototype.deleteVertex = function (target) {
        var _this = this;
        console.log(target, this.getVertices(), this.getEdges());
        this.vertices = this.vertices.filter(function (vertex) { return !_this.equalVertex(vertex, target); });
        this.edges = this.edges.filter(function (edge) { return !_this.equalVertex(edge.from, target) && !_this.equalVertex(edge.to, target); });
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    Graph.prototype.getEdges = function () {
        return this.edges;
    };
    // animateGraph(){
    // 	const lenghtOffsetXY = 100
    // 	const getRandomArbitrary = (min, max) => {
    // 		return Math.random() * (max - min) + min;
    // 	 }
    // 	// const stepOffsetVertex = () => {
    // 	// 	this.vertices = this.vertices.map(vertex => {
    // 	// 		const dx = getRandomArbitrary(-lenghtOffsetXY, lenghtOffsetXY)
    // 	// 		const dy = getRandomArbitrary(-lenghtOffsetXY, lenghtOffsetXY)
    // 	// 		return {...vertex, x: vertex.x + dx, y: vertex.y + dy}
    // 	// 	})
    // 	// 	this.painter.draw(this.getVertices(), this.getEdges())
    // 	// 	requestAnimationFrame(stepOffsetVertex)
    // 	// }
    // 	// requestAnimationFrame(stepOffsetVertex)
    // 	// ///
    // 	let deg = +(Math.random() * 360).toFixed()
    // 	const maxRotate = 55
    // 	const step = 5
    // 	const distance = 500
    // 	const interval = 0.1
    // 	const getShift = (deg, step) => {
    // 		return {
    // 			x: +(Math.cos(deg * Math.PI / 180) * step).toFixed(),
    // 			y: +(Math.sin(deg * Math.PI / 180) * step).toFixed(),
    // 		};
    // 	};
    // 	const tick = () => {
    // 		deg += +(Math.random() * maxRotate * 2 - maxRotate).toFixed();
    // 		let shift = getShift(deg, step);
    // 		this.vertices = this.vertices.map(vertex => {
    // 			// while (Math.abs(vertex.x + shift.x) >= distance || Math.abs(vertex.y + shift.y) >= distance) {
    // 				deg += +(Math.random() * maxRotate * 2 - maxRotate).toFixed();
    // 				shift = getShift(deg, step);
    // 			// }
    // 			return {...vertex, x: vertex.x + shift.x, y: vertex.y + shift.y}
    // 		})
    // 		this.painter.draw(this.getVertices(), this.getEdges())
    // 		requestAnimationFrame(tick)
    // 	}
    // 	requestAnimationFrame(tick)
    // }
    Graph.prototype.deleteGraph = function () {
        this.edges = [];
        this.vertices = [];
        this.painter.draw(this.getVertices(), this.getEdges());
    };
    return Graph;
}());
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
// *******************************
// TODO:
// 	1. Arrows
// 	2. main implemenation to UI.cpp
// 	3. time run
// 	4. /tests
// 	5. Edmons-Karp
// Instances
var graph = new Graph();
// graph.addVertex(200, 200);
// graph.addVertex(500, 600);
// graph.addEdge(graph.getVertex(0), graph.getVertex(1))
// Global Events
canvas.onmousemove = graph.move.bind(graph);
canvas.onmousedown = graph.down.bind(graph);
canvas.onmouseup = graph.up.bind(graph);
window.onresize = graph.painter.resize.bind(graph);
var button_run_dijkstra = document.getElementById("run_dijkstra");
var button_clear_graph = document.getElementById("clear");
var button_anumate_graph = document.getElementById("animate");
var button_create_graph = document.getElementById("create_graph");
var button_find_max_stream = document.getElementById("find_max_stream");
var button_return_find_max_stream = document.getElementById("return_find_max_stream");
var button_run_tests = document.getElementById("run_tests");
var path_cnt = document.getElementById("path_cnt");
var distation_cnt = document.getElementById("distation_cnt");
var time_cnt = document.getElementById("time_cnt");
var tests_cnt = document.getElementById("tests");
button_run_dijkstra.onclick = function (e) {
    if (graph.getVertices().length > 2) {
        var params_1 = {
            graph: Adapter.parseGraphToString(graph),
            countVertices: graph.getVertices().length,
            start: graph.startVertex.index - 1,
            end: graph.endVertex.index - 1
        };
        var query = Object.keys(params_1)
            .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params_1[k]); })
            .join('&');
        fetch("http://localhost:8080/dijkstra?" + query)
            .then(function (data) { return data.json().then(function (data) {
            path_cnt.innerHTML = data.path.join(", ");
            distation_cnt.innerHTML = data.distation;
            time_cnt.innerHTML = data.time + "ms";
            graph.markPath(data.path);
        }); });
    }
    else {
        alert("Граф не задан");
    }
};
button_clear_graph.onclick = function (e) {
    graph.deleteGraph();
};
// button_anumate_graph.onclick = (e) => {
// 	graph.animateGraph()
// }
button_create_graph.onclick = function (e) {
    var countVertices = Number(prompt("Количество вершин:"));
    var countEdges = Number(prompt("Количество ребер в %:"));
    console.log(countVertices, countEdges);
    var getRandomArbitrary = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    for (var index = 0; index < countVertices; index++) {
        graph.addVertex(Math.ceil(getRandomArbitrary(10, canvas.width - 10)), Math.ceil(getRandomArbitrary(10, canvas.height - 10)));
    }
    for (var i = 0; i < Math.ceil(countVertices * countEdges / 100); i++) {
        for (var j = i + 1; j < Math.ceil(countVertices * countEdges / 100); j++) {
            graph.addEdge(graph.getVertex(i), graph.getVertex(j));
            graph.addEdge(graph.getVertex(j), graph.getVertex(i));
        }
    }
};
button_find_max_stream.onclick = function (e) {
    if (graph.getVertices().length > 2) {
        var params_2 = {
            graph: Adapter.parseGraphToString(graph),
            countVertices: graph.getVertices().length,
            start: graph.startVertex.index - 1,
            end: graph.endVertex.index - 1
        };
        var query = Object.keys(params_2)
            .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params_2[k]); })
            .join('&');
        fetch("http://localhost:8080/find_max_stream?" + query)
            .then(function (data) { return data.json().then(function (data) {
            console.log(data);
            // path_cnt.innerHTML = data.path.join(", ")
            distation_cnt.innerHTML = data.distation;
            time_cnt.innerHTML = data.time + "ms";
            var maxStream = Adapter.parseStringToGraph(data.graph, graph.getVertices().length);
            // graph.markPath(data.path)
        }); });
    }
    else {
        alert("Граф не задан");
    }
};
button_return_find_max_stream.onclick = function (e) {
    graph.painter.draw(graph.getVertices(), graph.getEdges());
};
button_run_tests.onclick = function (e) {
    fetch("http://localhost:8080/run_tests")
        .then(function (data) { return data.json().then(function (data) {
        console.log(data);
        tests_cnt.style.display = "block";
        tests_cnt.innerHTML = data.tests;
        time_cnt.innerHTML = data.time + "ms";
        setTimeout(function () {
            tests_cnt.style.display = "none";
        }, 5000);
        // graph.markPath(data.path)
    }); });
};
