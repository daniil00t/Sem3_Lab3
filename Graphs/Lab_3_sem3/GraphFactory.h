#pragma once

#include "Graph.h"

#include "IntHash.h"

enum class Direction
{
	// From vertices with lower numbers to higher
	FORWARDS,
	// From vertices with higher numbers to lower
	BACKWARDS,
	// In both directions
	BIDIRECTIONAL
};

#define CLOCKWISE FORWARDS
#define COUNTERCLOCKWISE BACKWARDS

#define TO_CENTER FORWARDS
#define FROM_CENTER BACKWARDS

class IntegerGraphFactory
{
public:
	static Graph<int>* Empty(size_t vertexCount)
	{
		//CheckVerticesMinimum(vertexCount, 1,
			//"To create a graph with no vertices, use graph constructor");

		Graph<int>* res = new Graph<int>(intHash);

		for (int i = 0; i < vertexCount; i++)
		{
			res->AddVertex(i);
		}

		return res;
	}

	static Graph<int>* Complete(size_t vertexCount, int defaultLength = 1)
	{
		CheckVerticesMinimum(vertexCount, 1,
			"To create a graph with no vertices, use empty function");

		Graph<int>* res = new Graph<int>(intHash);

		for (int i = 0; i < vertexCount; i++)
		{
			res->AddVertex(i);

			Graph<int>::GraphIterator iter = res->begin();

			for (; iter != res->end(); ++iter)
			{
				auto tmp = *iter;

				if (tmp.first != i)
					res->SetBidirectionalEdge(i, tmp.first, defaultLength);
			}
		}

		return res;
	}

	static Graph<int>* Chain(
		size_t vertexCount,
		int defaultLength = 1,
		Direction direction = Direction::BIDIRECTIONAL
	)
	{
		CheckVerticesMinimum(vertexCount, 2,
			"Chain must contain at least 2 vertices. To create a trivial graph, use Complete() function");

		Graph<int>* res = new Graph<int>(intHash);

		res->AddVertex(0);

		for (int i = 1; i < vertexCount; i++)
		{
			res->AddVertex(i);

			AddConnection(res, i - 1, i, defaultLength, direction);
		}

		return res;
	}

	static Graph<int>* Cycle(
		size_t vertexCount,
		int defaultLength = 1,
		Direction direction = Direction::BIDIRECTIONAL
	)
	{
		CheckVerticesMinimum(vertexCount, 3, "Cycle must contain at least 3 vertices");

		Graph<int>* res = Chain(vertexCount, defaultLength, direction);

		AddConnection(res, res->VertexCount() - 1, 0, defaultLength, direction);

		return res;
	}

	static Graph<int>* Wheel(
		size_t vertexCount,
		int sideLength = 1,
		int ribLength = 1,
		Direction circleDirection = Direction::BIDIRECTIONAL,
		Direction raysDirection = Direction::BIDIRECTIONAL
	)
	{
		CheckVerticesMinimum(vertexCount, 4, "Wheel must contain at least 4 vertices");

		Graph<int>* res = Cycle(vertexCount - 1, sideLength, circleDirection);

		res->AddVertex(vertexCount - 1);

		Graph<int>::GraphIterator iter = res->begin();

		for (; iter != res->end(); ++iter)
		{
			auto tmp = *iter;

			if (tmp.first != vertexCount - 1)
				AddConnection(res, tmp.first, vertexCount - 1, ribLength, raysDirection);
		}

		return res;
	}

private:
	static void AddConnection(Graph<int>* graph, int vertex1, int vertex2, int distance, Direction direction)
	{

		switch (direction)
		{
		case Direction::FORWARDS:
			graph->SetAdjacent(vertex1, vertex2, distance);
			break;
		case Direction::BACKWARDS:
			graph->SetAdjacent(vertex2, vertex1, distance);
			break;
		case Direction::BIDIRECTIONAL:
			graph->SetBidirectionalEdge(vertex1, vertex2, distance);
			break;
		default:
			break;
		}
	}
	static void CheckVerticesMinimum(int actual, int expected, const char* message)
	{
		if (actual < expected)
			throw std::invalid_argument(message);
	}
};