#include <iostream>

#include <iterator>

#include <algorithm>

#include <sstream>

#include <string>

#include <vector>

#include <fstream>

#include <map>

using namespace std;

multimap < string, map < string, string > > transitionTable;

/** 
 *
 * This code split code wase made in 
 * https://stackoverflow.com/questions/236129/how-do-i-iterate-over-the-words-of-a-string/236803#236803
 *
 **/

template < typename Out >
  void split(const std::string & s, char delim, Out result) {
    std::istringstream iss(s);
    std::string item;
    while (std::getline(iss, item, delim)) {
      * result++ = item;
    }
  }

/** 
 *
 * This code split code wase made in 
 * https://stackoverflow.com/questions/236129/how-do-i-iterate-over-the-words-of-a-string/236803#236803
 *
 **/
std::vector < std::string > split(const std::string & s, char delim) {
  std::vector < std::string > elems;
  split(s, delim, std::back_inserter(elems));
  return elems;
}

//insert to character to transition table using map
void insertTransitionTable(string state, string character, string transition) {
  map < string, string > inner;
  inner.insert(make_pair(character, transition));
  transitionTable.insert(make_pair(state, inner));
}

/**
 * Separates the lines of the txt file by set parameters and pushes into a vector
 *
 * @param list Vector of strings with the txt.
 * @param line desired line number of the txt.
 * @param delimiter String to delimit the not desired characters.
 *
 * @return arr, the vector with te rquired line result.
 */
vector < string > separateLines(vector < string > list, int line, char delimiter) {
  string lineStr = list[line];
  stringstream ss(lineStr);
  string state;
  vector < string > arr;

  while (getline(ss, state, delimiter)) {
    arr.push_back(state);
  }
  return arr;

  arr.clear();
}

/**
 * Copy to transition Table
 *
 * @param list Vector of strings with the txt.
 *
*/
void separateTransitions(vector < string > list) {

  for (int i = 4; i < list.size(); ++i) {

    string lineStr = list[i];
    stringstream ss(lineStr);
    string state;
    string character;
    string transition;
    string copy_state;
    string copy_character;
    string copy_transition;
    vector < string > arr;
    int posArrow = lineStr.find("=");
    int posComma = lineStr.find(",");
    string copy_state_1;
    string copy_state_2;

    copy_state = lineStr.substr(0, posComma);
    copy_transition = lineStr.substr(posArrow + 2);
    copy_character = lineStr.substr(posComma+1, 1);

    if(copy_character == "l"){
      copy_character = lineStr.substr(posComma+1, 6);
    }

    if (copy_transition.length() > copy_state.length()) {
      int posComma_2 = copy_transition.find(",");
      copy_state_1 = copy_transition.substr(0, posComma_2);
      copy_state_2 = copy_transition.substr(posComma_2 + 1);
      insertTransitionTable(copy_state, copy_character, copy_state_1);
      insertTransitionTable(copy_state, copy_character, copy_state_2);
    } else {
      insertTransitionTable(copy_state, copy_character, copy_transition);
    }
  }
}

/**
 * Looks for Lambda character and concatenates the following states and characters
 *
 * @param a pair of states 
 *
 * @return concat, concatenation of lambda and copy_state
 *
 */

string lambdaClosure(string state) {
  vector < string > arrStr;
  vector < string > arrLam;
  string concat;
  string strLambda;

  arrLam = split(state, ',');
  for (int i = 0; i < arrLam.size(); ++i) {
    auto ret = transitionTable.equal_range(arrLam[i]);

    for (auto itr = ret.first; itr != ret.second; itr++) {
      for (auto ptr = itr -> second.begin(); ptr != itr -> second.end(); ptr++) {
        if (itr -> first == arrLam[i] && ptr -> first == "lambda") {
          cout << "\u03BB(" << itr -> first << ", " << ptr -> first << ") = " << ptr -> second << endl;
          arrStr.push_back(ptr -> second);
        }
      }
    }

    for (int i = 0; i < arrStr.size(); ++i) {
      strLambda = lambdaClosure(arrStr[i]);
      if (strLambda.length() != 0) {
        concat += strLambda;
      }
    }

    if (concat != arrLam[i]) {
      concat += arrLam[i] + ",";
    } else {
      concat += arrLam[i];
    }
  }

  return concat;

}

/**
 *
 * @param string state to print current state
 * @param string character to print current character
 *
 * @return concat, concatenation of lambda and copy_stae
**/
string transitionFunction(string state, string character) {
  vector < string > arrStr;
  string concat;
  auto ret = transitionTable.equal_range(state);

  for (auto itr = ret.first; itr != ret.second; itr++) {
    for (auto ptr = itr -> second.begin(); ptr != itr -> second.end(); ptr++) {
      if (itr -> first == state && ptr -> first == character) {
        cout << "\u03B4(" << itr -> first << ", " << ptr -> first << ") = " << ptr -> second << endl;
        arrStr.push_back(ptr -> second);
      }
    }
  }

  for (int i = 0; i < arrStr.size(); ++i) {
    concat += arrStr[i] + ",";
  }
  return concat;
}

/**
 * Recursive step using transitionTable and Lambda closure
 *
 * @param string state to print current state
 * @param string character to print current character
 *
 * @return result of current state and character
 */
string extendedTransitionFunction(string state, string character) {
  string resultExt;
  string resultTran;
  string result;
  vector < string > arrTran;
  vector < string > arrLam;

  cout << "\u03B4*(" << state << ", " << character << ")" << endl;
  if (character.size() == 0) {
    return lambdaClosure(state);
  } else {
    string firstSection = character.substr(0, character.length() - 1);
    int lengthStr = character.length();
    char CharOne = character.at(character.length() - 1);
    string lastChar;
    lastChar.push_back(CharOne);
    resultExt = extendedTransitionFunction(state, firstSection);

    arrTran = split(resultExt, ',');
    for (int i = 0; i < arrTran.size(); ++i) {
      cout << "\n\u03B4*(" << arrTran[i] << ", " << character << ") = ";
      resultTran += transitionFunction(arrTran[i], lastChar);
    }
    cout << "\u03BB ({ " << resultTran << " }) \n";

    result += lambdaClosure(resultTran);

    cout << "\n\u03B4*(" << resultTran << character << ")";
    cout << " = { " << result << "} " << endl;
    return result;
  }
  return state;
}

/**
 * Print final state, accept or reject string
 *
 * @param strin result of final states
 * @param vector arrFinalStates
 *
 * @return concat, concatenation of lambda and copy_stae
 */
void finalResult(string result, vector < string > arrFinalStates) {
  cout << "Final States: " << result << endl;
  bool accepted = false;
  vector < string > arrStr = split(result, ',');
  if (result.length() > 3) {
    for (int i = 0; i < arrFinalStates.size(); ++i) {
      for (int j = 0; j < arrStr.size(); ++j) {
        if (arrStr[j] == arrFinalStates[i]) {
          accepted = true;
        }
      }
    }
  } else {
    if (result.length() != 0) {
      for (int i = 0; i < arrFinalStates.size(); ++i) {
        if (arrStr[0] == arrFinalStates[i]) {
          accepted = true;
        }
      }
    }
  }
  //acepted string
  //rejected string
  if (accepted == false) {
    cout << "String is rejected" << endl;
  } else {
    cout << "String is Accepted" << endl;
  }
}

/**
 * Main Function
 *
 * User inserts string to .txt file
 *
*/
int main(int argc, char
  const * argv[]) {
  string text;
  string str;
  vector < string > list;
  vector < string > arrStates;
  vector < string > arrAlphabet;
  vector < string > arrInitialState;
  vector < string > arrFinalStates;
  //read from file
  ifstream file;

  file.open(argv[1], ios:: in );

  while (getline(file, str)) {
    list.push_back(str);
  }
  //close file
  file.close();

  arrStates = separateLines(list, 0, ',');
  arrAlphabet = separateLines(list, 1, ',');
  arrInitialState = separateLines(list, 2, ',');
  arrFinalStates = separateLines(list, 3, ',');

  separateTransitions(list);
  while (1) {
    string userString;
    cout << "Enter a string: ";
    cin >> userString;

    if (userString == "(empty)") {
      userString = "";
    }
    string result = extendedTransitionFunction(arrInitialState[0], userString);
    finalResult(result, arrFinalStates);

    string quitString;
    cout << "\nDo you want to put another? [Y/N] ";
    cin >> quitString;

    if (quitString != "Y") {
      break;
    }
  }

  return 0;
}
