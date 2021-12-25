#pragma once

#include <iostream>

#include "Sequence.h"
#include "ArraySequence.h"
#include "ListSequence.h"
#include "SequenceIterator.h"


#include "TestEnvironment.h"

using namespace sequences;
using namespace sequences::iterators;

template<class T>
void AssertSequenceEquals(Sequence<T>* expected, Sequence<T>* actual)
{
	if (expected == actual)
		return;

	TestEnvironment::Assert((expected->GetLength()) == (actual->GetLength()));

	SequenceIterator<T>* expectedIter = expected->begin();
	SequenceIterator<T>* actualIter = actual->begin();

	for (; (*expectedIter != *expected->end()) && (*actualIter != *actual->end());
		++(*expectedIter), ++(*actualIter)) {
		TestEnvironment::Assert((**expectedIter) == (**actualIter));
	}

}

template<class T>
void AssertSequenceEquals(std::initializer_list<T> expected, Sequence<T>* actual)
{
	TestEnvironment::Assert((expected.size()) == (actual->GetLength()));

	auto expectedIter = expected.begin();
	SequenceIterator<T>* actualIter = actual->begin();

	for (; (expectedIter != expected.end()) && (*actualIter != *actual->end());
		++(expectedIter), ++(*actualIter)) {
		TestEnvironment::Assert((*expectedIter) == (**actualIter));
	}
}

//compare must return negative value if parameters are in wrong onder, non-negarive elsewhere
template<class T>
void AssertSequenceSorted(Sequence<T>* actual, std::function<int(T, T)> compare)
{
	SequenceIterator<T>* firstIter = actual->begin();
	SequenceIterator<T>* nextIter = actual->begin();

	++(*nextIter);

	for (; (*nextIter) != (*actual->end()); ++(*firstIter), ++(*nextIter)) {
		TestEnvironment::Assert(compare(**firstIter, **nextIter) >= 0);
		//std::cout << (compare(**firstIter, **nextIter)) << std::endl;
	}
}