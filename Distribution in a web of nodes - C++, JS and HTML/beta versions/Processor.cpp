#include "Processor.hpp"

using namespace std;

void Processor::setEverything(int anID, int amountOfCores, float alpha, 
    float beta, float delta, float gamma, float c){
    id = anID;
    cores = amountOfCores;
    failureP = 1 / gamma;
    probRc = c;
    probRb = 1 - c;
    TRc = 1 / beta;
    TRb = 1 / alpha;
    TRepair = 1 / delta;
}

int Processor::calculatePoisson(int x){
    srand(time(0));
    float r = rand() / INT_MAX;
    int xPoisson = (1 / x) * log(1 - r);

    return xPoisson;
}