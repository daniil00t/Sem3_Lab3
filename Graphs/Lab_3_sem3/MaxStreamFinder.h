#pragma once

#include "Graph.h"


template<class T>
class EdmondsKarpStreamFinder
{
private:
	Graph<T>* maxStreams;

	Graph<T>* currentStreams;
	Graph<T>* remainingGrid;

	T startVertex;
	T endVertex;

	bool algorithmStarted = false;
	bool streamsInUse = false;
public:
	EdmondsKarpStreamFinder<T>(Graph<T>* graph, T startVertex, T endVertex):
		maxStreams(graph), startVertex(startVertex), endVertex(endVertex),
		currentStreams(new Graph<T>(graph->GetHashFunction())), remainingGrid(new Graph<T>(graph->GetHashFunction()))
	{
		if (startVertex == endVertex)
			throw std::invalid_argument("Start and end of a stream cannot be the same vertex!");

		auto vertexIter = graph->begin();

		for (; vertexIter != graph->end(); ++vertexIter)
		{
			currentStreams->AddVertex((*vertexIter).first);
		}

		vertexIter = graph->begin();

		for (; vertexIter != graph->end(); ++vertexIter)
		{
			auto edgeStart = (*vertexIter).first;
			auto edgeIter = graph->AdjacentIterator(edgeStart);

			for (; edgeIter != graph->AdjacentEnd(); ++edgeIter)
			{
				auto edgeEnd = (*edgeIter)->GetEnd();

				currentStreams->SetAdjacent(edgeStart, edgeEnd, 0);
				currentStreams->SetAdjacent(edgeEnd, edgeStart, 0);

			}

		
		}

		CreateRemainingGrid();

		//std::cout << *currentStreams << '\n' << *remainingGrid << '\n';
	}

	int FindStream()
	{
		algorithmStarted = true;

		while (true)
		{
			Sequence<T>* increasingPath = FindIncreasingPath();

			if (increasingPath == nullptr)
				break;

			TracePath(increasingPath);

			CreateRemainingGrid();

			//std::cout << *dynamic_cast<ArraySequence<T>*>(increasingPath) << '\n';
			//std::cout << *currentStreams << '\n';// << *remainingGrid << '\n';
		}

		auto iter = currentStreams->AdjacentIterator(endVertex);

		int sum = 0;

		for (; iter != currentStreams->AdjacentEnd(); ++iter)
			sum += (*iter)->GetWeight();

		return -sum;
	}

	Graph<T>* GetStreams()
	{
		if (!algorithmStarted)
			FindStream();

		streamsInUse = true;

		return currentStreams;
	}

private:
	void CreateRemainingGrid()
	{
		delete(remainingGrid);

		remainingGrid = new Graph<T>(maxStreams->GetHashFunction());

		auto vertexIter = maxStreams->begin();

		for (; vertexIter != maxStreams->end(); ++vertexIter)
		{
			remainingGrid->AddVertex((*vertexIter).first);
		}

		vertexIter = maxStreams->begin();

		for (; vertexIter != maxStreams->end(); ++vertexIter)
		{
			auto edgeStart = (*vertexIter).first;
			auto edgeIter = maxStreams->AdjacentIterator(edgeStart);

			for (; edgeIter != maxStreams->AdjacentEnd(); ++edgeIter)
			{
				auto edgeEnd = (*edgeIter)->GetEnd();

				if ((*edgeIter)->GetWeight() != currentStreams->EdgeLength(edgeStart, edgeEnd))
					remainingGrid->SetAdjacent(edgeStart, edgeEnd, 1);
			}
		}
	}

	Sequence<T>* FindIncreasingPath()
	{
		DijkstraPathfinder<T>* pathfinder = new DijkstraPathfinder<T>(remainingGrid, startVertex);

		if (pathfinder->GetDistance(endVertex) >= DijkstraPathfinder<T>::inf)
			return nullptr;

		return pathfinder->GetPath(endVertex);
	}

	void TracePath(Sequence<T>* path)
	{
		int min = DijkstraPathfinder<T>::inf;

		for (int i = 0; i < path->GetLength() - 1; i++)
		{
			int remainderStream = maxStreams->EdgeLength(path->Get(i), path->Get(i + 1)) -
				currentStreams->EdgeLength(path->Get(i), path->Get(i + 1));

			if (remainderStream < min)
				min = remainderStream;
		}

		for (int i = 0; i < path->GetLength() - 1; i++)
		{
			currentStreams->SetAdjacent(path->Get(i), path->Get(i + 1),
				currentStreams->EdgeLength(path->Get(i), path->Get(i + 1)) + min);

			currentStreams->SetAdjacent(path->Get(i + 1), path->Get(i),
				currentStreams->EdgeLength(path->Get(i + 1), path->Get(i)) - min);
		}
	}

public:
	~EdmondsKarpStreamFinder()
	{
		if(!streamsInUse)
			delete(currentStreams);

		delete(remainingGrid);
	}

};