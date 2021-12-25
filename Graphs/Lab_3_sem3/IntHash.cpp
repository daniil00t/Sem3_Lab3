#include "IntHash.h"

int intHash(int number, int tableSize) {
	return number % tableSize;
}