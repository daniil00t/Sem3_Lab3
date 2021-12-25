const button_run_dijkstra = document.getElementById("run_dijkstra")
const button_clear_graph = document.getElementById("clear")
const button_anumate_graph = document.getElementById("animate")
const path_cnt = document.getElementById("path_cnt")
const distation_cnt = document.getElementById("distation_cnt")

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
			graph.markPath(data.path)
			path_cnt.innerHTML = data.path.join(", ")
			distation_cnt.innerHTML = data.distation
		}))
	}
	else{
		alert("Граф не задан")
	}
	
}

button_clear_graph.onclick = (e) => {
	graph.deleteGraph()
}

button_anumate_graph.onclick = (e) => {
	graph.animateGraph()
}