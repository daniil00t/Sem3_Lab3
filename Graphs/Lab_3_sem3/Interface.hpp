#pragma once
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

using namespace dictionary;

using std::cin;
using std::cout;
using std::endl;

void inputNumber(int* number)
{
    std::cin >> *number;

    if (std::cin.fail())
    {
        cin.clear();
        cin.ignore(32767, '\n');
        //cout << "Incorrect input!" << endl;
        *number = -1;
    }
}

int inputNumberInRange(int lowerBound = 0, int upperBound = INT_MAX)
{
    int number;

    do
    {
        cout << "> ";
        inputNumber(&number);

        if (number < lowerBound || number > upperBound)
            std::cout << "Incorrect input, try again\n";
    } while (number < lowerBound || number > upperBound);

    return number;
}

int inputEdgeWeight(const char* message = "Input edge weight")
{
    cout << message << '\n';

    return inputNumberInRange();
}

Direction inputEdgeDirection(
    const char* message1 = "forwards",
    const char* message2 = "backwards",
    const char* message = "Input edges direction"
)
{
    cout << message << '\n';
    cout << "1 - " << message1 << '\n';
    cout << "2 - " << message2 << '\n';
    cout << "3 - bidirectional" << '\n';

    int dir = inputNumberInRange(1, 3);

    return static_cast<Direction>(dir - 1);
}

Graph<int>* createGraphWithTopology(int topology, int size)
{
    int vertexCount = 0;
    int weight = 0;

    Direction direction = Direction::BIDIRECTIONAL;

    int sideWeight = 0;
    int radiusWeight = 0;

    Direction sideDirection = Direction::BIDIRECTIONAL;
    Direction radiusDirection = Direction::BIDIRECTIONAL;

    switch (topology)
    {
    case 1:
        cout << "Input vertex count:\n";

        vertexCount = inputNumberInRange();

        return IntegerGraphFactory::Empty(vertexCount);
    case 2:
        cout << "Input vertex count:\n";

        vertexCount = inputNumberInRange(1);

        weight = inputEdgeWeight();

        return IntegerGraphFactory::Complete(vertexCount, weight);
    case 3:
        cout << "Input vertex count:\n";

        vertexCount = inputNumberInRange(2);

        weight = inputEdgeWeight();

        direction = inputEdgeDirection();

        return IntegerGraphFactory::Chain(vertexCount, weight, direction);
    case 4:
        cout << "Input vertex count:\n";

        vertexCount = inputNumberInRange(3);

        weight = inputEdgeWeight();

        direction = inputEdgeDirection("clockwise", "counter-clockwise");

        return IntegerGraphFactory::Cycle(vertexCount, weight, direction);
    case 5:
        cout << "Input vertex count:\n";

        vertexCount = inputNumberInRange(4);

        sideWeight = inputEdgeWeight("Input side weight");
        radiusWeight = inputEdgeWeight("Input radius weight");

        sideDirection = inputEdgeDirection("clockwise", "counter-clockwise", "Input sides direction");
        radiusDirection = inputEdgeDirection("to center", "from center", "Input radius direction");

        return IntegerGraphFactory::Wheel(vertexCount, sideWeight, radiusWeight, sideDirection, radiusDirection);
    default:
        return nullptr;
        break;
    }
}

void header()
{
    cout << "Commands:\n"
        << "1. Create graph\n"
        << "2. Add vertex\n"
        << "3. Add edge\n"
        << "4. Add bidirectional edge\n"
        << "5. Remove vertex\n"
        << "6. Remove edge\n"
        << "7. Find shortest way (Dijkstra algorithm)\n"
        << "8. Find maximum stream (Edmonds-Karp algorithm)\n"
        << "9. Print graph\n"
        << "10. Run tests\n"
        << "0. Exit\n";
}

class Interface {
public:
	static void loop() {
        int command = -1;
        Graph<int>* graph = nullptr;
        int index = 0;

        while (command != 0)
        {
            header();
            int vertexCount = 0;
            int topology = 0;

            int start = 0;
            int end = 0;
            int edgeWeight = 0;

            command = inputNumberInRange(0, 10);

            TestEnvironment* env = new TestEnvironment();

            ADD_NEW_TEST(*env, "AdjacencyList test", testAdjacencyList);
            ADD_NEW_TEST(*env, "Basic graph test", basicGraphTest);
            ADD_NEW_TEST(*env, "Topology generation test", topologyGenerationTest);
            ADD_NEW_TEST(*env, "Dijkstra test", testDijkstra);
            ADD_NEW_TEST(*env, "Edmonds-Karp algorithm test", testEdmondsKarp);

            try {
                switch (command)
                {
                case 1:
                    if (graph != nullptr) {
                        delete(graph);
                        graph = nullptr;
                    }

                    cout << "Select topology:\n";
                    cout << "1 - empty graph\n";
                    cout << "2 - complete graph\n";
                    cout << "3 - chain graph\n";
                    cout << "4 - cycle graph\n";
                    cout << "5 - wheel graph\n";

                    topology = inputNumberInRange(1, 5);

                    graph = createGraphWithTopology(topology, vertexCount);

                    index = graph->VertexCount();

                    cout << "Graph successfully created\n";
                    break;
                case 2:
                    if (graph != nullptr) {
                        graph->AddVertex(index);
                        cout << "Added vertex with index " << index << '\n';
                        index++;
                    }
                    else
                        cout << "Create graph first!\n";

                    break;
                case 3:
                    if (graph != nullptr) {
                        cout << "Input edge start\n";
                        start = inputNumberInRange(0, index - 1);

                        cout << "Input edge end\n";
                        end = inputNumberInRange(0, index - 1);

                        cout << "Input edge weight\n";
                        edgeWeight = inputNumberInRange();

                        graph->SetAdjacent(start, end, edgeWeight);
                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 4:
                    if (graph != nullptr) {
                        cout << "Input first vertex\n";
                        start = inputNumberInRange(0, index - 1);

                        cout << "Input second vertex\n";
                        end = inputNumberInRange(0, index - 1);

                        cout << "Input edge weight\n";
                        edgeWeight = inputNumberInRange();

                        graph->SetBidirectionalEdge(start, end, edgeWeight);
                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 5:
                    if (graph != nullptr) {
                        cout << "Input vertex index\n";
                        start = inputNumberInRange(0, index - 1);

                        graph->RemoveVertex(start);
                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 6:
                    if (graph != nullptr) {
                        cout << "Input edge start\n";
                        start = inputNumberInRange(0, index - 1);

                        cout << "Input edge end\n";
                        end = inputNumberInRange(0, index - 1);

                        graph->RemoveAdjacent(start, end);
                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 7:
                    if (graph != nullptr) {
                        cout << "Input path start\n";
                        start = inputNumberInRange(0, index - 1);

                        cout << "Input path end\n";
                        end = inputNumberInRange(0, index - 1);

                        DijkstraPathfinder<int>* pathfinder = new DijkstraPathfinder<int>(graph, start);

                        cout << *dynamic_cast<ArraySequence<int>*>(pathfinder->GetPath(end)) << ", distance = "
                            << pathfinder->GetDistance(end) << '\n';

                        delete(pathfinder);
                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 8:
                    if (graph != nullptr) {
                        cout << "Input stream start\n";
                        start = inputNumberInRange(0, index - 1);

                        cout << "Input stream end\n";
                        end = inputNumberInRange(0, index - 1);

                        EdmondsKarpStreamFinder<int>* streams = new EdmondsKarpStreamFinder<int>(graph, start, end);

                        cout << "Max stream = " << streams->FindStream() << '\n'
                            << *streams->GetStreams() << '\n';

                    }
                    else
                        cout << "Create graph first!\n";
                    break;
                case 9:
                    if (graph != nullptr)
                        cout << *graph << endl;
                    else
                        cout << "Create graph first!\n";

                    break;
                case 10:
                    env->RunAll();
                default:
                    cin.clear();
                    cin.ignore(32767, '\n');
                    //cout << "Incorrect input!" << endl;
                }
            }
            catch (vertex_not_found e) {
                cout << "Exception occured! " << e.what() << '\n';
            }
            catch (std::invalid_argument e) {
                cout << "Exception occured! " << e.what() << '\n';
            }
        }
	}
    static void runTests() {

        TestEnvironment* env = new TestEnvironment();

        ADD_NEW_TEST(*env, "AdjacencyList test", testAdjacencyList);
        ADD_NEW_TEST(*env, "Basic graph test", basicGraphTest);
        ADD_NEW_TEST(*env, "Topology generation test", topologyGenerationTest);
        ADD_NEW_TEST(*env, "Dijkstra test", testDijkstra);
        ADD_NEW_TEST(*env, "Edmonds-Karp algorithm test", testEdmondsKarp);

        env->RunAll();
    }
};