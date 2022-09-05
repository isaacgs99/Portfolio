#ifndef PROCESSOR_HPP
#define PROCESSOR_HPP

#include <iostream>
#include <vector>
#include <deque>
#include <time.h>
#include <pthread.h>
#include <omp.h>
#include <limits.h>
#include <math.h>
#include <unistd.h>

class Processor {
    private:
    int id, cores, rc = 1, rb = 1, failure = 1;
    float failureP, probRc, probRb, TRc, TRb, TRepair;

    public:
    void setEverything(int anID, int amountOfCores, float alpha, float beta, 
        float delta, float gamma, float c);
    int calculatePoisson(int x);
};

#endif