#pragma once

#include <limits>

#include "Graph.h"
#include "Optional.h"
#include "dependencies/ArraySequence.h"

template<class T>
class DijkstraPathfinder
{
public:
	static const int inf = std::numeric_limits<int>::max() / 2;
private:
	Graph<T>* graph;
	int n;

	//Sequence<int>* distances;
	//Sequence<bool>* checked;
	//Sequence<T>* prev;
	IDictionary<T, int>* distances;
	IDictionary<T, bool>* checked;//TODO keep in linked list instead
	IDictionary<T, T>* prev;

	T startVertex;

	bool algorithmStarted = false;

public:
	DijkstraPathfinder(Graph<T>* graph, T startVertex) :
		graph(graph), startVertex(startVertex), n(graph->VertexCount()),
		distances(new HashMap<T, int>(graph->GetHashFunction())),
		checked(new HashMap<T, bool>(graph->GetHashFunction())),
		prev(new HashMap<T, T>(graph->GetHashFunction()))
	{
		
		auto iter = graph->begin();

		for (; iter != graph->end(); ++iter)
		{
			distances->Add((*iter).first, inf);
			checked->Add((*iter).first, false);
		}
		
		distances->Add(startVertex, 0);
	}

	void Dijkstra()
	{
		algorithmStarted = true;

		for (int i = 0; i < n; i++)
		{
			//std::cout << *dynamic_cast<HashMap<T, int>*>(distances) << std::endl;

			Optional<T> v = Optional<T>();

			auto iter = graph->begin();

			// For temporarily keeping vertices
			T tmp;

			//Finding unchecked vertex with closest distance
			for (; iter != graph->end(); ++iter)
			{
				tmp = (*iter).first;
				if (!checked->Get(tmp) &&
					(!v.HasValue() || distances->Get(tmp) < distances->Get(*v)))
				{
					v.SetValue(tmp);
				}
			}

			// If minimum distance is infinity, some vertices are unreachable
			// and we found ways to everything that's reachable
			if (distances->Get(*v) == inf)
				break;
			
			checked->Add(*v, true);
			
			auto edgeIter = graph->AdjacentIterator(*v);

			//Relaxation
			for (; edgeIter != graph->AdjacentEnd(); ++edgeIter)
			{
				tmp = (*edgeIter)->GetEnd();
				int len = (*edgeIter)->GetWeight();

				if (distances->Get(*v) + len < distances->Get(tmp))
				{
					distances->Add(tmp, distances->Get(*v) + len);
					prev->Add(tmp, *v);
				}

			}
			
		}
	}

	int GetDistance(T endVertex)
	{
		if (!algorithmStarted)
			Dijkstra();

		return distances->Get(endVertex);
	}

	Sequence<T>* GetPath(T endVertex)
	{
		if (!algorithmStarted)
			Dijkstra();

		Sequence<T>* path = new ArraySequence<T>();

		T tmp = endVertex;
		T previous;

		while (tmp != startVertex)
		{
			previous = prev->Get(tmp);

			path->Append(tmp);
			tmp = previous;
		}

		path->Append(tmp);

		int pathLength = path->GetLength();

		//Reverse sequence
		

		for (int i = 0; i < pathLength / 2; i++)
		{
			path->Swap(i, pathLength - i - 1);
		}

		//std::cout << *dynamic_cast<ArraySequence<T>*>(path) << std::endl;

		return path;
	}

	~DijkstraPathfinder()
	{
		delete(distances);
		delete(checked);
		delete(prev);
	}
	
};