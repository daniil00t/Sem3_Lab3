#pragma once

#include "dependencies/TestEnvironment.h"
#include "dependencies/SequenceAssertions.h"
#include "dependencies/HashMap.h"

#include "AdjacencyList.h"
#include "Graph.h"
#include "GraphFactory.h"
#include "GraphPathfinder.h"
#include "MaxStreamFinder.h"

void testAdjacencyList();

void basicGraphTest();

void topologyGenerationTest();

void testDijkstra();

void testEdmondsKarp();