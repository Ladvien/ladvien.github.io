#include <stdio.h>
#include <cs50.h>
#include <math.h>

float GetChangeOwed();

int main(){
    int change_owed = (round(GetChangeOwed() * 100));
    int quarter_count = 0;
    int dime_count = 0;
    int nickel_count = 0;
    int penny_count = 0;

    while(change_owed >= 25){
        quarter_count++;
        change_owed-=25;
    }
    while(change_owed >= 10){
        dime_count++;
        change_owed-=10;
    }
    while(change_owed >= 5){
        nickel_count++;
        change_owed-=5;
    }
    while(change_owed >= 1){
        penny_count++;
        change_owed--;
    }
    printf("%i\n", (quarter_count+dime_count+nickel_count+penny_count));
}

float GetChangeOwed(){
    float change = 0.0;
    do{
        printf("How much change is owed?\n");
        change = GetFloat();
    }while(change < 0 || change > 100.00);
    return change;
}
