#pragma once
#include "Graph.h"
#include "GraphFactory.h"
#include <string>
#include <vector>
#include <tuple>

using namespace std;



class ParserStringToGraph{
public:
	static vector<tuple<int, int, int>> parseString(string input) {

		vector<tuple<int, int, int>> output;

		string separator = "|";
		string insideSeparator = ";";

		size_t pos = 0;
		std::string token;


		while ((pos = input.find(separator)) != std::string::npos) {
			token = input.substr(0, pos);

			// inside
			size_t Ipos = 0;
			std::string Itoken;
			int start, end, iter = 0;
			while ((Ipos = token.find(insideSeparator)) != std::string::npos) {
				Itoken = token.substr(0, Ipos);
				token.erase(0, Ipos + insideSeparator.length());
				if (iter == 0) start = stoi(Itoken);
				else if (iter == 1) end = stoi(Itoken);
				iter++;
			}

			output.push_back({ start, end, stoi(token) });
			input.erase(0, pos + separator.length());
		}

		// inside
		size_t Ipos = 0;
		std::string Itoken;
		int start, end, iter = 0;
		while ((Ipos = input.find(insideSeparator)) != std::string::npos) {
			Itoken = input.substr(0, Ipos);
			input.erase(0, Ipos + insideSeparator.length());
			if (iter == 0) start = stoi(Itoken);
			else if (iter == 1) end = stoi(Itoken);
			iter++;
		}

		output.push_back({ start, end, stoi(input) });

		return output;
	}
};


class GraphCreator {
public:
	static Graph<int>* createGraphFromString(int countVertices, string input){
		vector<tuple<int, int, int>> output = ParserStringToGraph::parseString(input);
		Graph<int>* graph = IntegerGraphFactory::Empty(countVertices);

		for (size_t i = 0; i < output.size(); i++)
		{
			int start = get<0>(output[i]), end = get<1>(output[i]), weight = get<2>(output[i]);

			graph->SetAdjacent(start, end, weight);
		}

		return graph;
	}
};