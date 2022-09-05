#include <iostream>
#include <vector>
#include <time.h>
#include <omp.h>
#include <limits.h>
#include <math.h>
#include <unistd.h>

#define NCORES 3

using namespace std;
/* En memoria de:
 * vector<tuple<vector<vector<int>>,int>>
 */

vector<vector<vector<int>>> list;

vector<vector<int>> generarMatriz(int n, int m)
{
    vector<vector<int>> vec(n, vector<int> (m,0));
    cout<<"***filas: "<<vec.size()<<"\tcolumnas: "<<vec[0].size()<<endl;
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

void multiplicar(vector<vector<int>> A, vector<vector<int>> B)
{
    vector<vector<int>> C(A.size(), vector<int> (B[0].size(),0));
    omp_set_num_threads(NCORES);
    #pragma omp parallel for 
    for(int i=0; i<A.size(); i++)
    {
        printf("hilo: %d\n", omp_get_thread_num());
        for(int j=0; j<B[0].size(); j++)
        {
            for(int k=0; k<A[0].size(); k++) 
            {
                C[i][j]+=A[i][k]*B[k][j];
            }
        }
    }
    for (int i = 0; i < C.size(); i++) { 
        for (int j = 0; j < C[0].size(); j++){ 
            cout<< C[i][j]<< " "; 
        } 
        cout<< "\n"; 
    }
}

void emparejar()
{
    bool flag = true;
    for(int i = 0; i < list.size()-1; i++)
    {
        cout<<list[i][0].size()<<" X "<<list.back().size()<<endl;
        if (list[i][0].size()==list.back().size())
        {
            if(list.size()>1)
            {
                cout<<"La primera y última matriz de la cola son compatibles"<<endl;
                multiplicar(list[i], list.back());
                cout<<"multiplicó"<<endl;
                list.erase(list.begin()+i); 
                list.pop_back();
                cout<<"eliminó"<<endl;
                flag = false;
                break;
            }
        }
        else if (flag)
        {
            cout<<"NO hay matrices compatibles"<<endl;
        }
  }
        cout<<"COLA: "<<list.size()<<endl<<endl;
}

int main()
{
    //deque<vector<vector<int>>> list;

    srand(time(NULL));

    for(int i = 0; i < 100; i++)
    {
        list.push_back(generarMatriz(rand() % 8 + 2,(rand() % 8 + 2)));
        emparejar();
    }

    return 0;
}