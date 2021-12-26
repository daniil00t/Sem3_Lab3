const button_run_dijkstra = document.getElementById("run_dijkstra")
const button_clear_graph = document.getElementById("clear")
const button_anumate_graph = document.getElementById("animate")
const button_create_graph = document.getElementById("create_graph")
const button_find_max_stream = document.getElementById("find_max_stream")
const button_return_find_max_stream = document.getElementById("return_find_max_stream")
const button_run_tests = document.getElementById("run_tests")
const path_cnt = document.getElementById("path_cnt")
const distation_cnt = document.getElementById("distation_cnt")
const time_cnt = document.getElementById("time_cnt")
const tests_cnt = document.getElementById("tests")

button_run_dijkstra.onclick = (e: MouseEvent) => {

	if(graph.getVertices().length > 2){
		const params = {
			graph: Adapter.parseGraphToString(graph), 
			countVertices: graph.getVertices().length,
			start: graph.startVertex.index - 1, 
			end: graph.endVertex.index - 1
		}
		const query = Object.keys(params)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&')

		fetch("http://localhost:8080/dijkstra?" + query)
			.then(data => data.json().then(data => {
				path_cnt.innerHTML = data.path.join(", ")
				distation_cnt.innerHTML = data.distation
				time_cnt.innerHTML = data.time + "ms"
				graph.markPath(data.path)
			}))
	}
	else{
		alert("Граф не задан")
	}
	
}

button_clear_graph.onclick = (e) => {
	graph.deleteGraph()
}

// button_anumate_graph.onclick = (e) => {
// 	graph.animateGraph()
// }

button_create_graph.onclick = (e) => {
	const countVertices = Number(prompt("Количество вершин:"))
	const countEdges = Number(prompt("Количество ребер в %:"))
	console.log(countVertices, countEdges)
	const getRandomArbitrary = (min, max) => {
		return Math.random() * (max - min) + min;
	}

	const distation = 400
	const offsetAngle = 2 * Math.PI / countVertices
	const center = {x: canvas.width / 2, y: canvas.height / 2}

	for (let index = 0; index < countVertices; index++) {
		graph.addVertex(Math.ceil(center.x + distation * Math.cos(offsetAngle * index)), Math.ceil(center.y + distation * Math.sin(offsetAngle * index)))
	}
	for (let i = 0; i < Math.ceil(countVertices * countEdges / 100); i++) {
		for (let j = i + 1; j < Math.ceil(countVertices * countEdges / 100); j++) {
			graph.addEdge(graph.getVertex(i), graph.getVertex(j))
			graph.addEdge(graph.getVertex(j), graph.getVertex(i))
		}
	}
}



button_find_max_stream.onclick = e => {
	if(graph.getVertices().length > 2){
		const params = {
			graph: Adapter.parseGraphToString(graph), 
			countVertices: graph.getVertices().length,
			start: graph.startVertex.index - 1, 
			end: graph.endVertex.index - 1
		}
		const query = Object.keys(params)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&')

		fetch("http://localhost:8080/find_max_stream?" + query)
			.then(data => data.json().then(data => {
				console.log(data)
				// path_cnt.innerHTML = data.path.join(", ")
				distation_cnt.innerHTML = data.distation
				time_cnt.innerHTML = data.time + "ms"
				const maxStream = Adapter.parseStringToGraph(data.graph, graph.getVertices().length)
				// graph.markPath(data.path)
			}))
	}
	else{
		alert("Граф не задан")
	}
}


button_return_find_max_stream.onclick = e => {
	graph.painter.draw(graph.getVertices(), graph.getEdges())
}

button_run_tests.onclick = e => {
	fetch("http://localhost:8080/run_tests")
		.then(data => data.json().then(data => {
			console.log(data)
			tests_cnt.style.display = "block";
			tests_cnt.innerHTML = data.tests
			time_cnt.innerHTML = data.time + "ms"
			setTimeout(() => {
				tests_cnt.style.display = "none";
			}, 5000)
			// graph.markPath(data.path)
		}))
}