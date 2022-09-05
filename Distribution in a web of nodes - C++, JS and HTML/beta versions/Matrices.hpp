#ifndef MATRICES_HPP
#define MATRICES_HPP

#include "Processor.hpp"
#include <iostream>
#include <vector>
#include <deque>
#include <time.h>
#include <omp.h>
#include <unistd.h>

using namespace std;

struct arg_struct {
    vector<vector<int>> *arg1;
    vector<vector<int>> *arg2;
    vector<Processor> *arg3;
    int *arg4;
};

vector<vector<int>> generarMatriz(int n, int m)
{
    vector<vector<int>> vec(n, vector<int> (m,0));
    // cout<<"***filas: "<<vec.size()<<"\tcolumnas: "<<vec[0].size()<<endl;
    for (int i = 0; i < n; i++)
    {
        for(int j = 0; j < m; j++)
        {
            vec[i][j] = rand() % 9;
        }
    }
    for (int i = 0; i < n; i++) { 
        for (int j = 0; j < m; j++){ 
            cout<< vec[i][j]<< " "; 
        } 
        cout<< "\n"; 
    }
    cout<< "\n"; 

    return vec;
}

void * multiplicar(void * param)
{
    arg_struct *temp = (arg_struct *) param;
    vector<vector<int>> m1 = *(temp->arg1);
    vector<vector<int>> m2 = *(temp->arg2);
    vector<Processor> processors = *(temp->arg3);
    int id = *(temp->arg4);
    //vector<vector<int>> C(m1.size(), vector<int>(m2.size()));

    printf("I am M1\n");

    for (auto i : m1){
        for (auto j : i){
            printf("%d ", j);
        }

        printf("\n");
    }

    printf("I am M2\n");

    for (auto i : m2){
        for (auto j : i){
            printf("%d ", j);            
        }

        printf("\n");
    }

    printf("\n");

    omp_set_num_threads(processors[id].getCores());
    #pragma omp parallel for 
    for (int i = 0; i < m1.size(); i++)
    {
        for (int j = 0; j < m2[0].size(); j++)
        {
            int a = 0;

            for (int k = 0; k < m1[0].size(); k++)
            {
                a += m1[i][k] * m2[k][j];
            }

            cout << a << " ";
        }

        cout << endl;
    }

    pthread_exit();
}

bool emparejar(vector<vector<vector<int>>> list, int c)
{
    if (list[c][0].size()==list.back().size())
    {
        if(list.size()>1)
        {
            return true;
        }
    }

    return false;
}

#endif