class Painter{
	private canvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	private readonly strokeStyle: string = '#009999'
	public readonly fillStyle: string = '#22cccc'
	private readonly markfillStyle: string = "red"
	public readonly markStartStyle: string  = "blue"
	public readonly markEndStyle: string  = "red"

	constructor(canvas, contex){
		this.canvas = canvas
		this.ctx = contex
	}

	draw(vertices: Vertex[], edges: Edge[], path?: Path) {
		context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		console.log(vertices)
  		const getColor = (edge: Edge) => {
			if(edge.marked)
				return this.markfillStyle
			return this.strokeStyle
		}
		
		for (let i = 0; i < edges.length; i++) {
			let fromNode = edges[i].from;
			let toNode = edges[i].to;
			this.ctx.beginPath();
			this.ctx.strokeStyle = getColor(edges[i]);
			this.ctx.moveTo(fromNode.x, fromNode.y);
			this.ctx.lineTo(toNode.x, toNode.y);
			this.ctx.font = "12px sans-serif";
			this.ctx.fillStyle = "red";
				this.ctx.fillText(
				String(edges[i].weight || edges[i].getWeight()), (fromNode.x + toNode.x) / 2 - 6, (fromNode.y + toNode.y) / 2 + 6);
			this.ctx.stroke();
		}
		
  
		for (let i = 0; i < vertices.length; i++) {
			let vertex = vertices[i];
			this.ctx.beginPath();
			
			
			this.ctx.fillStyle = vertex.selected ? vertex.selectedFill : vertex.fillStyle;
			this.ctx.arc(vertex.x, vertex.y, vertex.radius, 0, Math.PI * 2, true);
			if(vertex.isStart)
				this.ctx.fillStyle = this.markStartStyle
			else if(vertex.isEnd)
				this.ctx.fillStyle = this.markEndStyle;
			else
				this.ctx.fillStyle = vertex.selected ? vertex.selectedFill : vertex.fillStyle;
			this.ctx.strokeStyle = (vertex.strokeStyle || this.strokeStyle);
			this.ctx.stroke();
			this.ctx.fill();

			this.ctx.textAlign = "center"
			this.ctx.font = "16px sans-serif";
			this.ctx.fillStyle = "white";
			this.ctx.fillText(String(i), vertex.x, vertex.y + 6);
		}
		
  	}




	resize() {
		canvas.width = window.innerWidth - 270;
		canvas.height = window.innerHeight;
  }
}
