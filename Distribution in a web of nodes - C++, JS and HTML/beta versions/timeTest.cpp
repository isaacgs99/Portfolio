#include <iostream>
#include <time.h>
#include <unistd.h>

using namespace std;

int main(){
    time_t endwait;
    time_t start = time(NULL);
    time_t seconds = 10; // end loop after this time has elapsed

    endwait = start + seconds;

    printf("start time is : %s", ctime(&start));

    while (start < endwait)
    {
        /* Do stuff while waiting */
        sleep(1);   // sleep 1s.
        start = time(NULL);
        printf("loop time is : %s", ctime(&start));
    }

    printf("end time is %s", ctime(&endwait));

    return 0;
}