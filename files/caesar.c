#include <stdio.h>
#include <cs50.h>


bool IsAlphabetCharacter(char charToCheck);
bool IsDigit(char charToCheck);
bool StringIsDigitsOnly(string string_to_check);
int GetLength(string string_of_interest);
string GetUserString();
string StringToUpper(string string_to_upper);
string EncodeUserString(string user_string, int cipher);

int main(int argc, string argv[]){

    // 1. Check for needed arguments.
    // 2. Get cipher.
    // 3. Check if valid.  If not, exit.
    // 4. Get string from user.
    // 5. Get new string the size of the user string.
    // 6. Encode old string into new using cipher.
    // 7. Print encoded string.

    if (argc < 2){printf("No or incorrect arguments provided\n");exit(1);}
    string cipher_string = argv[1];
    int cipher_int = 0;
    if(true != StringIsDigitsOnly(cipher_string)){exit(0);}
    else{cipher_int = atoi(cipher_string);}
    string user_string = GetUserString();
    string encoded_string = EncodeUserString(user_string, cipher_int);
    printf("%s\n", encoded_string);
}

bool IsAlphabetCharacter(char charToCheck){
    // Asserts charToCheck is betwee 'a' and 'z' or 'A' and 'Z'
    if((charToCheck > 64 && charToCheck < 91) || (charToCheck > 96 && charToCheck < 123)){return true;}
    else{return false;}
}

bool IsLowerAlphabetCharacter(char charToCheck){
    // Asserts charToCheck is betwee 'a' and 'z' or 'A' and 'Z'
    if(charToCheck > 96 && charToCheck < 123){return true;}
    else{return false;}
}

bool IsDigit(char charToCheck){
    // Asserts charToCheck is betwee '0' and '9'
    if(charToCheck > 47 && charToCheck < 58){return true;}
    else{return false;}
}

bool StringIsDigitsOnly(string string_to_check){
    for(int i = 0; i < GetLength(string_to_check); i++){
        if(true != IsDigit(string_to_check[i])){ return false;}
    }
    return true;
}

int GetLength(string string_of_interest){
    int i = 0;
    while(string_of_interest[i] != '\0'){
        i++;
    }
    return i;
}

string StringToUpper(string string_to_upper){
    for(int i = 0; i < GetLength(string_to_upper);i++){
        if(true == IsLowerAlphabetCharacter(string_to_upper[i])){return "";}
        else{string_to_upper[i] = string_to_upper[i] - 32;}
    }
    return string_to_upper;
}

string EncodeUserString(string user_string, int cipher){

    // 1. Check if string is all alphatbets
    // 2. Encode using cipher.
    // 3. Return encoded string.

    // Check to make sure cipher is in range.
    if(cipher > 26){
        cipher = cipher%26;
    }

    //printf("The cipher: %i\n", cipher);

    //1.
    for(int i = 0; i < GetLength(user_string); i++){
        char this_char = (char)user_string[i];
        if(true == IsAlphabetCharacter(this_char)){                     // Check to make sure it is a letter.
            if(true == IsLowerAlphabetCharacter(this_char)){            // Let's worry about just 'a' to 'z'
                if((this_char+cipher) > 'z'){                           // Does it spill over?
                    int spill_over_number = ((this_char+cipher)-'z');   // Get the encoded char with spill.
                    user_string[i] = (96 + spill_over_number);          // Put it back into the user string.
                } else {                                                // If it doesn't spill.
                 user_string[i] += cipher;                              // Encode char and put it back.
                }
            }
            else { // Worry about upper case.
                if((this_char+cipher) > 'Z'){                           // Does it spill over?
                    int spill_over_number = ((this_char+cipher)-'Z');   // Get the encoded char with spill.
                    user_string[i] = (64 + spill_over_number);          // Put it back into the user string.
                } else {                                                // If it doesn't spill.
                    user_string[i] += cipher;                           // Encode char and put it back.
                }
            }
        }{
            // don't convert; NOP;
        }
    }
    return user_string;
}

string GetUserString(){
    string string_input = "";
    do{
        string_input = GetString();
    }while(GetLength(string_input) == 0);

    return string_input;
}
