#pragma once

#include "dependencies/IDictionary.h"
#include "dependencies/HashMap.h"

#include "AdjacencyList.h"

using namespace dictionary;

template<class T>
class Graph {
public:
	typedef iterators::ListIterator<Edge<T>*> AdjacentVerticesIterator;
	typedef dictionary::HashMapIterator<T, AdjacencyList<T>*> GraphIterator;
private:
	IDictionary<T, AdjacencyList<T>*>* vertices;

	std::function<int(T, int)> hashFunction;
public:
	Graph(std::function<int(T, int)> hashFunc):
		vertices(new HashMap<T, AdjacencyList<T>*>(hashFunc)), hashFunction(hashFunc)
	{}

	int VertexCount()
	{
		return vertices->Count();
	}

	Edge<T>* GetEdge(T edgeStart, T edgeEnd)
	{
		return TryGetAdjacent(edgeStart)->GetEdge(edgeEnd);
	}

	bool AreConnected(T edgeStart, T edgeEnd)
	{
		try {
			if (GetEdge(edgeStart, edgeEnd) == nullptr)
				return false;
			else
				return true;
		}
		catch(vertex_not_found){
			return false;
		}
	}

	int EdgeLength(T edgeStart, T edgeEnd)
	{
		auto startVertex = TryGetAdjacent(edgeStart);

		if (edgeStart == edgeEnd)
			return 0;

		return startVertex->EdgeLength(edgeEnd);
	}

	void AddVertex(T vertex)
	{
		vertices->Add(vertex, new AdjacencyList<T>());
	}

	void RemoveVertex(T vertex)
	{
		//Remove everything that is pointing at it
		GraphIterator iter = begin();

		for (; iter != end(); ++iter)
		{
			try {
				(*iter).second->RemoveAdjacent(vertex);
			}
			catch (vertex_not_found e) {}
		}

		vertices->Remove(vertex);
	}

	int AdjacentCount(T vertex)
	{
		return TryGetAdjacent(vertex)->SequenceSize();
	}

	void SetAdjacent(T edgeStart, T edgeEnd, int length)
	{
		if (edgeStart == edgeEnd)
			throw std::invalid_argument("Loop to itself not allowed!");

		TryGetAdjacent(edgeEnd);

		TryGetAdjacent(edgeStart)->SetAdjacent(edgeEnd, length);
	}

	void SetBidirectionalEdge(T vertex1, T vertex2, int length)
	{
		SetAdjacent(vertex1, vertex2, length);
		SetAdjacent(vertex2, vertex1, length);
	}

	void RemoveAdjacent(T edgeStart, T edgeEnd)
	{
		TryGetAdjacent(edgeStart)->RemoveAdjacent(edgeEnd);
	}

	void RemoveBidirectionalEdge(T vertex1, T vertex2)
	{
		try {
			Remove(vertex1, vertex2);
		}
		catch(vertex_not_found e){}
		try {
			Remove(vertex2, vertex1);
		}
		catch (vertex_not_found e) {}
	}

	std::function<int(T, int)> GetHashFunction()
	{
		return hashFunction;
	}

public:
	AdjacentVerticesIterator AdjacentIterator(T vertex)
	{
		return TryGetAdjacent(vertex)->begin();
	}
	AdjacentVerticesIterator AdjacentEnd()
	{
		return AdjacentVerticesIterator(nullptr);
	}
	GraphIterator begin()
	{
		return dynamic_cast<HashMap<T, AdjacencyList<T>*>*>(vertices)->Iterator();
	}
	GraphIterator end()
	{
		return dynamic_cast<HashMap<T, AdjacencyList<T>*>*>(vertices)->End();
	}
private:
	AdjacencyList<T>* TryGetAdjacent(T vertex)
	{
		try {
			return vertices->Get(vertex);
		}
		catch (key_not_found e)
		{
			throw vertex_not_found("No such vertex in the graph");
		}
	}
public:
	~Graph()
	{
		delete(vertices);
	}
public:

	template<class T1>
	friend std::ostream& operator<< (std::ostream& stream, Graph<T1>& graph);
};

template<class T1>
std::ostream& operator<<(std::ostream& stream, Graph<T1>& graph)
{
	auto iter = graph.begin();

	stream << '{';

	for (; iter != graph.end(); ++iter)
	{
		stream << (*iter).first << ": " << *((*iter).second) << "; ";
	}

	stream << '}';

	return stream;
}
