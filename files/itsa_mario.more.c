#include <cs50.h>
#include <stdio.h>

int GetHeight(void);
int main(void)
{

    int max_height = GetHeight();
    int current_height = 0;
    int width = 0;
    char space = ' ';
    char block = '#';

    for (current_height = 1; current_height <= max_height; current_height++){       // these loops are for displaying the blocks in a pattern
        for(width = 0; width < (max_height - current_height); width++ ){
            printf("%c", space);
        }
        for(width = 0; width < current_height; width++ ){
             printf("%c", block);
        }
        printf("%c%c", space, space);
        for(width = 0; width < current_height; width++ ){
            printf("%c", block);
        }
        printf("\n");
    }
}

int GetHeight(void)
{
    int height;      // Condition so you only get a positive number
    do
    {
        printf("How tall do you want the pyramid?\n");
        height = GetInt();
        if(0 == height){
            break;
        }
    }
    while (height < 1||height > 23);
    return height;
}
