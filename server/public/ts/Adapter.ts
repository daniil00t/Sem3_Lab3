class Adapter{
	public static parseGraphToString(input: Graph): string{
		let output: string = ""
		input.getEdges().map(edge => {
			output += `${edge.from.index - 1};${edge.to.index - 1};${edge.getWeight()}|`
		})
		output = output.substr(0, output.length - 1)

		return output
	}
	public static parseStringToGraph(input: string, countVertices: number): Graph{
		const output = new Graph()
		const getRandomArbitrary = (min, max) => {
			return Math.random() * (max - min) + min;
		}
		// add vertices
		for (let index = 0; index < countVertices; index++) {
			output.addVertex(Math.ceil(getRandomArbitrary(10, canvas.width - 10)), Math.ceil(getRandomArbitrary(10, canvas.height - 10)))
		}
		let arrayOfVertices = input.substr(1, input.length - 2).split(";")
		arrayOfVertices = arrayOfVertices.slice(0, arrayOfVertices.length - 1)
		arrayOfVertices.map(vertex => {
			vertex.split(",").map(_vertex => {
				if(!!_vertex.trim()){
					try{
						const matchEdge = _vertex.match(/-\[(\d+)\]->\((\d+)\)/i)
						const indexStartVertex = Number(vertex.trim().substr(0, 1))
						const indexEndVertex = Number(matchEdge[2])
						const weightVertex = Number(matchEdge[1])
						output.addEdge(output.getVertex(indexStartVertex), output.getVertex(indexEndVertex), weightVertex)
						console.log(indexStartVertex, indexEndVertex, weightVertex)
					}
					catch(e){}
				}
				
			})
		})



		// Parse
		// input.split("|").map((stringEdge, index) => {
		// 	const separateStringEdge = stringEdge.split(";")
		// 	const startVertex = Number(separateStringEdge[0])
		// 	const endVertex = Number(separateStringEdge[1])
		// 	const weightVertex = Number(separateStringEdge[2])
		// 	output.addEdge(output.getVertex(startVertex), output.getVertex(endVertex), weightVertex)
		// })
		return output
	}
}