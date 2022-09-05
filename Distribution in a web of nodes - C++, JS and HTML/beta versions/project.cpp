#ifdef _WIN32
#include <Windows.h>
#else
#include <unistd.h>
#endif
#include <iostream>
#include <vector>
#include <string>
#include <stdlib.h>  

using namespace std;

struct processor
{
  int ID;
  int cores;
  //Probabilty of failure
  float failureP;
  //Probabilty of RC
  float probRc;
  //Probabilty of Rb
  float probRb;
  //Time of rc
  float TRc;
  //Time of rb
  float TRb;
  //Time of repair
  float TRepair;
  //1 = working, 0 = not working
  int rc = 1; 
  int rb = 1;
  int failure = 1; 
};

void insert(processor *arr, int n, int cores, float alpha, float beta, float delta, float gamma, float c){
  for (int i = 0; i < n; i++)
  {
    arr[i].ID = i;
    arr[i].cores = cores;
    arr[i].failureP = 1/gamma;
    arr[i].probRc = c;
    arr[i].probRb = 1 - c; 
    arr[i].TRc = 1/beta;
    arr[i].TRb = 1/alpha;
    arr[i].TRepair = 1/delta;
  }
}

int main(int argc, char *argv[]){

  if (argc != 8){
    int tiempoSimul = atoi(argv[9]);
    int n = atoi(argv[6]);
    int cores = atoi(argv[7]);
    float alpha = atoi(argv[2]);
    float beta = atoi(argv[3]);
    float delta = atoi(argv[4]);
    float gamma = atoi(argv[5]);
    float c = atoi(argv[8]);

    float xPoisson = atoi(argv[1]);
    //pedir usuario antes el n (procesadores)
    processor p[n];
    insert(p,n,cores,alpha,beta,delta,gamma,c);
    
    sleep(tiempoSimul);
    for (int i = 0; i < n; i++){
      cout << "Nucleos: " << p[i].cores << endl;
      cout << "Probabilidad de fallo: " << p[i].failureP << endl;
      cout << "Probabilidad de RC: " << p[i].probRc << endl;
      cout << "Probabilidad de RB: " << p[i].probRb << endl;
      cout << "Tiempo de RC: " << p[i].TRc << endl;
      cout << "Tiempo de RB: " << p[i].TRb << endl;
      cout << "Tiempo de Reparacion: " << p[i].TRc << endl;
    }
  }
    
  else {
    cout<<"ERROR: Te falto un dato"<<endl;
  }

  return 0;
}