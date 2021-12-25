interface Vertex{
	index: number
	radius: number
	x: number
	y: number
	weight?: number
	fillStyle: string
   strokeStyle: string
   selectedFill: string
   selected: boolean
	isStart: boolean
	isEnd: boolean
}

interface IEdge{
	to: Vertex
	from: Vertex
	weight?: number
	marked: boolean
}

type Path = number[]

class Edge implements IEdge{
	public to: Vertex
	public from: Vertex
	public weight = 0
	public marked = false

	constructor(to: Vertex, from: Vertex, weight?: number){
		this.to = to
		this.from = from
		this.weight = weight || 0
	}

	getWeight(): number{
		return this.weight || Math.ceil(
			Math.sqrt(
				Math.pow(this.from.x - this.to.x, 2) + 
				Math.pow(this.from.y - this.to.y, 2)
			)
		)
	}
}

class Graph{
	public vertices: Vertex[] = []
	public edges: Edge[] = []
	public selection: Vertex | null = null
	public painter = new Painter(canvas, context)
	public startVertex: Vertex
	public endVertex: Vertex

	constructor(){
		this.painter.resize()
	}

	within(x: number, y: number): Vertex {
		return this.vertices.find(n => {
			return x > (n.x - n.radius) && 
				y > (n.y - n.radius) &&
				x < (n.x + n.radius) &&
				y < (n.y + n.radius);
		});
  	}

	move(e) {
		if (this.selection && e.buttons) {
			 this.selection.x = e.x;
			 this.selection.y = e.y;
			this.painter.draw(this.getVertices(), this.getEdges());
		}
	}

	up(e: MouseEvent) {
		if (!this.selection) {
			this.addVertex(e.x, e.y)
			console.log(this)
		}
		if (this.selection && !this.selection.selected) {
			this.selection = null;
		}
		this.painter.draw(this.getVertices(), this.getEdges());
	}
	
  	down(e: MouseEvent) {
		let target = this.within(e.x, e.y);

		if (this.selection && this.selection.selected) {
			this.selection.selected = false;
		}

		if (target) {
			if(e.altKey){
				this.deleteVertex(target)
				this.selection = target
				this.selection.selected = false
			}
			else if(e.ctrlKey){
				this.markVertex(target, "start")
				this.startVertex = target
				this.selection = target
				this.selection.selected = false
				e.preventDefault()
			}
			else if(e.shiftKey){
				this.markVertex(target, "end")
				this.endVertex = target
				this.selection = target
				this.selection.selected = false
				e.preventDefault()
			}
			else{
				console.log("Тоже ")
				if (this.selection && this.selection !== target) {
					this.edges.push(new Edge(target, this.selection));
				}
				this.selection = target;
				this.selection.selected = true;
				this.painter.draw(this.getVertices(), this.getEdges());
			}
			
			
		}
	}

	public markVertex(target: Vertex, color: "start" | "end"){
		if(color === "start")
			this.vertices = [...this.getVertices().map(vertex => vertex.index === target.index? {...vertex, isStart: true}: {...vertex, isStart: false})]
		else if(color === "end")
			this.vertices = [...this.getVertices().map(vertex => vertex.index === target.index? {...vertex, isEnd: true}: {...vertex, isEnd: false})]

		this.painter.draw(this.getVertices(), this.getEdges())
	}

	public markPath(path: Path){
		const edges = this.getEdges();
		for (let index = 0; index < path.length - 1; index++) {
			const pathBetweenVertices: [number, number] = [path[index], path[index + 1]];
			for (let i = 0; i < edges.length; i++) {
				let fromNode = edges[i].from;
				let toNode = edges[i].to;
				if(pathBetweenVertices[0] === fromNode.index - 1 && pathBetweenVertices[1] === toNode.index - 1 || 
					pathBetweenVertices[1] === fromNode.index - 1 && pathBetweenVertices[0] === toNode.index - 1)
				{
					this.edges[i].marked = true
				}
			}
		}
		this.painter.draw(this.getVertices(), this.getEdges())
	}

	addVertex(x: number, y: number){
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
		})
		this.painter.draw(this.getVertices(), this.getEdges());
	}	

	addEdge(to: Vertex, from: Vertex){
		this.edges.push(new Edge(to, from))
		this.painter.draw(this.getVertices(), this.getEdges());
	}	

	getVertex(index: number){
		return this.vertices[index]
	}

	getVertices(){
		return this.vertices
	}

	equalVertex(v1: Vertex, v2: Vertex){
		return v1.x === v2.x && v2.y === v2.y
	}

	deleteVertex(target: Vertex){
		console.log(target, this.getVertices(), this.getEdges())
		this.vertices = this.vertices.filter(vertex => !this.equalVertex(vertex, target))
		this.edges = this.edges.filter(edge => !this.equalVertex(edge.from, target) && !this.equalVertex(edge.to, target))
		this.painter.draw(this.getVertices(), this.getEdges())
	}

	getEdges(){
		return this.edges
	}
	
	animateGraph(){
		const lenghtOffsetXY = 100
		const getRandomArbitrary = (min, max) => {
			return Math.random() * (max - min) + min;
		 }
		// const stepOffsetVertex = () => {
		// 	this.vertices = this.vertices.map(vertex => {
		// 		const dx = getRandomArbitrary(-lenghtOffsetXY, lenghtOffsetXY)
		// 		const dy = getRandomArbitrary(-lenghtOffsetXY, lenghtOffsetXY)
		// 		return {...vertex, x: vertex.x + dx, y: vertex.y + dy}
		// 	})
		// 	this.painter.draw(this.getVertices(), this.getEdges())
		// 	requestAnimationFrame(stepOffsetVertex)
		// }
		// requestAnimationFrame(stepOffsetVertex)

		// ///


		let deg = +(Math.random() * 360).toFixed()
		const maxRotate = 55
		const step = 5
		const distance = 500
		const interval = 0.1


		const getShift = (deg, step) => {
			return {
				x: +(Math.cos(deg * Math.PI / 180) * step).toFixed(),
				y: +(Math.sin(deg * Math.PI / 180) * step).toFixed(),
			};
		};

		const tick = () => {

			deg += +(Math.random() * maxRotate * 2 - maxRotate).toFixed();

			let shift = getShift(deg, step);
			this.vertices = this.vertices.map(vertex => {
				// while (Math.abs(vertex.x + shift.x) >= distance || Math.abs(vertex.y + shift.y) >= distance) {
					deg += +(Math.random() * maxRotate * 2 - maxRotate).toFixed();
					shift = getShift(deg, step);
				// }
				return {...vertex, x: vertex.x + shift.x, y: vertex.y + shift.y}
			})
			this.painter.draw(this.getVertices(), this.getEdges())
			requestAnimationFrame(tick)
		}

		requestAnimationFrame(tick)

	
	}

	public deleteGraph(){
		this.edges = []
		this.vertices = []
		this.painter.draw(this.getVertices(), this.getEdges())
	}

}