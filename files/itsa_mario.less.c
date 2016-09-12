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

    for (current_height = 1; current_height <= max_height; current_height++){
        for(width = 0; width < (max_height - current_height); width++ ){
            printf("%c", space);
        }
        for(width = 0; width < current_height+1; width++ ){
             printf("%c", block);
        }
        printf("\n");
    }
}

int GetHeight(void)
{
    int height;
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
