#pragma once

#include <utility>
#include <stdexcept>

#include "dependencies/Sequence.h"
#include "dependencies/ListSequence.h"

#include "Edge.h"

using namespace sequences;

using std::pair;

class vertex_not_found: public std::exception {
public:
	vertex_not_found(): std::exception()
	{}

	vertex_not_found(const char* message) : std::exception(message)
	{}
};

template<class T>
class AdjacencyList
{
public:
	typedef iterators::ListIterator<Edge<T>*> AdjacentEdgesIterator;
private:
	Sequence<Edge<T>*>* adjacent = new ListSequence<Edge<T>*>();
public:
	int SequenceSize() const
	{
		return adjacent->GetLength();
	}
	// nullptr if not found
	Edge<T>* GetEdge(T vertex) const
	{
		AdjacentEdgesIterator iter = begin();

		for (int i = 0; (iter != end()) && (i < SequenceSize()); ++iter, ++i)
		{
			if ((*iter)->GetEnd() == vertex)
			{
				return *iter;
			}
		}
		return nullptr;
	}
	int EdgeLength(T vertex) const
	{
		Edge<T>* edge = GetEdge(vertex);

		if (edge == nullptr)
			throw vertex_not_found("No connection or vertex does not exist");

		return edge->GetWeight();
	}
	void SetAdjacent(T vertex, int distance)
	{
		Edge<T>* edge = GetEdge(vertex);

		if (edge == nullptr)
			adjacent->Append(new Edge<T>(vertex, distance));
		else
			edge->SetWeight(distance);
	}
	void RemoveAdjacent(T vertex)
	{
		int vertexIndex = Find(vertex);

		if (vertexIndex == -1)
			throw vertex_not_found("No connection or vertex does not exist");

		dynamic_cast<ListSequence<Edge<T>*>*>(adjacent)->Remove(vertexIndex);
	}
	
	AdjacentEdgesIterator begin() const
	{
		return *dynamic_cast<AdjacentEdgesIterator*>(adjacent->begin());
	}
	AdjacentEdgesIterator end() const
	{
		return *dynamic_cast<AdjacentEdgesIterator*>(adjacent->end());
	}

private:
	int Find(T vertex) const
	{
		AdjacentEdgesIterator iter = begin();

		for (int i = 0; (iter != end()) && (i < SequenceSize()); ++iter, ++i)
		{
			if ((*iter)->GetEnd() == vertex)
			{
				return i;
			}
		}
		return -1;

	}

	~AdjacencyList()
	{
		delete(adjacent);
	}
public:
	template<class T1>
	friend std::ostream& operator<< (std::ostream& stream, AdjacencyList<T1>& list);
};

template<class T1>
std::ostream& operator<<(std::ostream& stream, AdjacencyList<T1>& list)
{
	auto iter = list.begin();

	stream << '[';

	while(iter != list.end()) {
		
		Edge<T1>* edge = *iter;

		if (edge->GetWeight() > 0) {
			stream << *edge;

			if (++iter != list.end())
				stream << ", ";
		}
		else
			++iter;
	}

	stream << ']';

	return stream;
}
