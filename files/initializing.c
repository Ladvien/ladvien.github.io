#include <stdio.h>
#include <cs50.h>

string GetName();
int GetLength(string string_of_interest);
char GetInitial(string name, int *start_index);
char ToUpperChar(char lower_char);

int main(){
    string name = GetName();
    int name_index = 0;
    char initials[3];
    initials[0] = ToUpperChar(name[0]);
    int i = 0;
    while(i < 2){initials[i+1] = ToUpperChar(GetInitial(name, &name_index));i++;};
    for(int j = 0; j < 3; j++){
        if((int)initials[j] > 64 && (int)initials[j] < 91){printf("%c", initials[j]);}
    }
    printf("\n");
}

string GetName(){
    string string_input = "";
    do{
        string_input = GetString();
    }while(GetLength(string_input) == 0);
    return string_input;
}

int GetLength(string string_of_interest){
    int i = 0;
    while(string_of_interest[i] != '\0'){
        i++;
    }
    return i;
}

char GetInitial(string name, int *start_index){
    do{
        *start_index = *start_index+1;
    }while(name[*start_index] != ' ' && *start_index < GetLength(name));
    return name[*start_index+1];
}

char ToUpperChar(char lower_char){
    if((int)lower_char > 96 && (int)lower_char <  123) {return (char)(lower_char - 32);}
    else {return lower_char;}
}
