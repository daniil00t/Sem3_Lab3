class Adapter{
	public static parseGraphToString(input: Graph): string{
		let output: string = ""
		input.getEdges().map(edge => {
			output += `${edge.from.index - 1};${edge.to.index - 1};${edge.getWeight()}|`
		})
		output = output.substr(0, output.length - 1)

		return output
	}
}