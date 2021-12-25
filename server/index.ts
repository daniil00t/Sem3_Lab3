const express = require("express")
const path = require("path")
const cors = require("cors")
const child_process = require("child_process");
const app = express()
const pathFileExute = "D:\\labs\\sem_3\\Lab3\\Graphs\\x64\\Debug\\Lab_3_sem3.exe"
const port = 8080

app.use(express.static('public'));
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
	const str = "some string"
	const queries: Record<string, string> = req.query
	const params: string[] = Object.keys(queries).reduce((prev, curr) => [...prev, curr, queries[curr]], [])

	console.log(params)
	const StreamExuct = child_process.spawnSync(pathFileExute, ["--createGraph", "0;1;20|1;2;30", "--countVertices", "3"]);
	console.log(StreamExuct.stdout.toString())
	// StreamExuct.stdin.write("1")
	// StreamExuct.stdin.end()
	// StreamExuct.stdin.write("20")
	// StreamExuct.stdin.end()
	// StreamExuct.stdin.write("9")
	// StreamExuct.stdin.end()


	// console.log(req)
  	// res.sendFile(path.join(__dirname, "/public", "index.html"))
	res.send(req.query)
})

app.get("/dijkstra", (req, res) => {
	const str = "some string"
	const queries: Record<string, string> = req.query
	const queriesToApp = {
		"--createGraph": queries.graph,
		"--countVertices": Number(queries.countVertices),
		"--indexStart": Number(queries.start),
		"--indexEnd": Number(queries.end)
	}
	const params: string[] = Object.keys(queriesToApp).reduce((prev, curr) => [...prev, curr, queriesToApp[curr]], [])

	console.log(params)
	const StreamExuct = child_process.spawnSync(pathFileExute, params);
	const output: string = StreamExuct.stdout.toString()
	const path = output.split("|")[0].substr(1, output.split("|")[0].length - 2).trim().split(" ").map(i => Number(i))
	const distation: number = Number(output.split("|")[1])
	console.log(path, distation)
	res.json({path, distation})
})

app.listen(port, () => {
  console.log(`✨ Example app listening at http://localhost:${port}`)
})


