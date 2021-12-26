#include <iostream>

#include "dependencies/TestEnvironment.h"
#include "dependencies/SequenceAssertions.h"
#include "dependencies/HashMap.h"

#include "AdjacencyList.h"
#include "Graph.h"
#include "GraphFactory.h"
#include "GraphPathfinder.h"
#include "MaxStreamFinder.h"

#include "GraphTests.h"
#include "Interface.hpp"

#include "Parser.hpp"

using namespace dictionary;

using std::cin;
using std::cout;
using std::endl;

#define RUN_INTERFACE "--runInterface"
#define RUN_DIJSKSTRA_ALGORITHM "--runDijkstraAlgorithm"
#define RUN_MAX_STREAM_FINDER "--runMaxStreamFinder"
#define RUN_TESTS "--runTests"





int main(int argc, char** argv) {

    // args
    // --createGraph -> string pattern
    // --countVertices -> int
    // --runAlgorithm -> string enum { Dijkstra, EdmondsKarpStreamFinder }

    // **Flags**
    enum class RUN_FLAG { 
        FLAG_RUN_INTERFACE, 
        FLAG_RUN_DIJKSTRA_ALGORITHM, 
        FLAG_RUN_MAX_STREAM_FINDER, 
        FLAG_RUN_TESTS
    };

    RUN_FLAG flag = RUN_FLAG::FLAG_RUN_INTERFACE;

    string createGraphPattern;
    int countVertices = 0;
    int indexStart = 0;
    int indexEnd = 1;

    vector<pair<char*, char*>> args;
    // find mode run
    for (size_t i = 1; i < argc; i+=2){
        char* command = argv[i];
        char* dataCommand = argv[i + 1];


        if (!strcmp(command, RUN_INTERFACE)) {
            flag = RUN_FLAG::FLAG_RUN_INTERFACE;
            Interface::loop();
        }
        else if (!strcmp(command, RUN_DIJSKSTRA_ALGORITHM)) {
            flag = RUN_FLAG::FLAG_RUN_DIJKSTRA_ALGORITHM;
        }
        else if (!strcmp(command, RUN_MAX_STREAM_FINDER)) {
            flag = RUN_FLAG::FLAG_RUN_MAX_STREAM_FINDER;
        }
        else if (!strcmp(command, RUN_TESTS)) {
            flag = RUN_FLAG::FLAG_RUN_TESTS;
            Interface::runTests();
        }

        // Catch params for FLAG_RUN_DIJKSTRA_ALGORITHM and FLAG_RUN_MAX_STREAM_FINDER
        if (!strcmp(command, "--createGraph")) {
            createGraphPattern = dataCommand;
        }
        if (!strcmp(command, "--countVertices")) {
            countVertices = atoi(dataCommand);
        }
        if (!strcmp(command, "--indexStart")) {
            indexStart = atoi(dataCommand);
        }
        if (!strcmp(command, "--indexEnd")) {
            indexEnd = atoi(dataCommand);
        }
 
        args.push_back({ command, dataCommand });
    }

    if (flag == RUN_FLAG::FLAG_RUN_INTERFACE) {
        Interface::loop();
    }
    else if (flag == RUN_FLAG::FLAG_RUN_DIJKSTRA_ALGORITHM) {
        if (createGraphPattern.size() != 0 && countVertices != 0) {
            Graph<int>* graph = GraphCreator::createGraphFromString(countVertices, createGraphPattern);
            try{
                DijkstraPathfinder<int>* pathfinder = new DijkstraPathfinder<int>(graph, indexStart);

                cout << *dynamic_cast<ArraySequence<int>*>(pathfinder->GetPath(indexEnd)) << "|" << pathfinder->GetDistance(indexEnd) << '\n';

                delete(pathfinder);
            }
            catch (...) {
                cout << "[]|" << INT_MAX;
            }
           
        }
    }
    else if (flag == RUN_FLAG::FLAG_RUN_MAX_STREAM_FINDER) {
        if (createGraphPattern.size() != 0 && countVertices != 0) {
            Graph<int>* graph = GraphCreator::createGraphFromString(countVertices, createGraphPattern);

            EdmondsKarpStreamFinder<int>* streams = new EdmondsKarpStreamFinder<int>(graph, indexStart, indexEnd);

            cout << streams->FindStream() << '|'
                << *streams->GetStreams();
        }
    }


    return 0;
}