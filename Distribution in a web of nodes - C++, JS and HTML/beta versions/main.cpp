/*
Consultar con Cubells primero:
Un metodo que se encargue del while infinito y de empujar matrices a la cola, junto con un thread para eso
Un metodo que se encargue de todo lo demas dentro del while infinito, tambien con su propio thread
*/
#include "Processor.hpp"
#include "Matrices.hpp"

using namespace std;

struct thread {
    pthread_t tid;
    bool isWorking = false;
};

int main(int argc, char *argv[]){
    int amountOfProcessors = atoi(argv[1]);
    int amountOfCores = atoi(argv[2]);
    float alpha = atof(argv[3]);
    float beta = atof(argv[4]);
    float delta = atof(argv[5]);
    float gamma = atof(argv[6]);
    float c = atof(argv[7]);
    time_t timeSim = atoi(argv[8]);
    time_t endwait;
    time_t start = time(NULL);
    bool canTheyMultiply = false;
    struct arg_struct args;
    int i;

    srand(time(NULL));
    endwait = start + timeSim;

    deque<vector<vector<int>>> list;
    vector<thread> listOfThreads(amountOfProcessors);
    vector<Processor> processors(amountOfProcessors);

    for (i = 0; i < amountOfProcessors; i++){
        processors[i].setEverything(i, amountOfCores, alpha, beta, delta, gamma, c);
    }

    while (start < endwait){
        start = time(NULL);

        list.shrink_to_fit();
        list.push_back(generarMatriz(rand() % 4 + 2, (rand() % 4 + 2)));

        //cout << list[i] << endl;
        canTheyMultiply = emparejar(list);

        if (canTheyMultiply == true){
            printf("COLA: %d\n", list.size());

            vector<vector<int>> m1 = list.front();
            vector<vector<int>> m2 = list.back();
            
            //These 3 lines are the problem
            arg_struct *datos = (arg_struct *) malloc(sizeof(arg_struct));
            datos->arg1 = &m1;
            datos->arg2 = &m2;
            /*
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
            */
            pthread_create(&listOfThreads[i].tid, NULL, multiplicar, datos);
            sleep(1);
            printf("I am thread %d\n", listOfThreads[i].tid);
            fflush(NULL);
            //pthread_join(listOfThreads[i].tid, NULL);
            list.pop_front();
            list.pop_back();
            list.shrink_to_fit();
        }

        /*
        else {
            cout << "The matrices were not compatible." << endl;
        }
        */
    }

    return 0;
}