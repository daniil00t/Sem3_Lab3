const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');




// Instances

const graph = new Graph()

// graph.addVertex(200, 200);
// graph.addVertex(500, 600);
// graph.addEdge(graph.getVertex(0), graph.getVertex(1))

// Global Events

canvas.onmousemove = graph.move.bind(graph);
canvas.onmousedown = graph.down.bind(graph);
canvas.onmouseup = graph.up.bind(graph);
window.onresize = graph.painter.resize.bind(graph);

