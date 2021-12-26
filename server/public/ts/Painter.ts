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
  		const getColor = (edge: Edge) => {
			if(edge.marked)
				return this.markfillStyle
			return this.strokeStyle
		}
		function canvas_arrow(context, fromx, fromy, tox, toy) {
			var headlen = 20; // length of head in pixels
			var dx = tox - fromx;
			var dy = toy - fromy;
			var angle = Math.atan2(dy, dx);
			let sgnX = Math.sign(Math.cos(angle))
			let sgnY = Math.sign(Math.sin(angle))

			let offset = 20
			tox = tox - sgnX * offset * Math.abs(Math.cos(angle))
			toy = toy - sgnY * offset * Math.abs(Math.sin(angle))
			context.moveTo(fromx, fromy);
			context.lineTo(tox, toy);

			context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
			context.moveTo(tox, toy);
			context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		}
		
		for (let i = 0; i < edges.length; i++) {
			let fromNode = edges[i].from;
			let toNode = edges[i].to;
			this.ctx.beginPath();
			this.ctx.strokeStyle = getColor(edges[i]);
			canvas_arrow(this.ctx, fromNode.x, fromNode.y, toNode.x, toNode.y)
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
	clearPlane(x = this.canvas.width, y = this.canvas.height){
		this.ctx.clearRect(0, 0, x, y)
	}
}
