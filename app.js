"use strict";

/*
Build all of your functions for displaying and gathering information below (GUI).
*/
// app is the function called to start the entire application
// searchFamily();
function app(people){
  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
      let personArray = searchByName(people);
      if (personArray.length < 2){
        mainMenu(personArray[0]);
      }
      else {
      let person = selectPerson(personArray);
      mainMenu(person);
      }
      break;
    case 'no':
      let searchByTraitResults = searchByTraits(people);
      console.log(searchByTraitResults);
      break;
    default:
      alert("Wrong! Please try again, following the instructions dummy. :)");
      app(people); // restart app
      break;
  }
}

//TO DO: Finsish writing this validation helper function and incorporate it into promptFor?
function isNumber(input){
  if ( !isNaN(input) ) {
    return false;
  }
  else {
    return true;
  }
}

function getCleanWord(word){
  return word.trim();
}

function getCleanStringArray(arr){
  for(let i=0; i<arr.length; i++){
    arr[i] = getCleanWord(arr[i]);
  }
  return arr;
}

function checkForValidTrait(userInput){
  let isValid = true;
  let traits = userInput.split(",");
  for ( let i=0; i<traits.length; i++ ) {
    let trait = getCleanWord(traits[i]);
    if ( !(trait === "height" || trait === "weight" || trait === "eyecolor" || trait === "gender" || trait === "age" || trait === "occupation") ) {
      isValid = false;
    }
  }
  return isValid;
}

function getTraitInput(){
  let isValidInput = false;
  let searchInput;
  while ( !isValidInput ) {
    searchInput = prompt("What would you like to search by? You can enter multiple options. Each option should be one word separated by a comma.\nThe options are 'height', 'weight', 'eyecolor', 'gender', 'age', 'occupation'.\nFor example: 'height,eyecolor,age'");
    isValidInput = checkForValidTrait(searchInput);
    if ( !isValidInput ) {
      alert("You can only enter valid search options. Please try again.");
    }
  }
  let searchCategories = searchInput.split(",");
  searchCategories = getCleanStringArray(searchCategories);
  return searchCategories;
}

function getSearchTerms(searchCategories){
  let searchTerms = [];
  for ( let i=0; i<searchCategories.length; i++ ) {
    searchTerms.push(prompt('What ' + searchCategories[i] + ' would you like to search for?'));
  }
  for ( let i=0; i<searchCategories.length; i++ ) {
    if ( searchCategories[i] === "weight" || searchCategories[i] === "height" || searchCategories[i] === "age" ) {
      searchTerms[i] = parseInt(searchTerms[i]);
    }
    if ( searchCategories[i] === "eyecolor" ) {
      searchCategories[i] = "eyeColor";
    }
  }
  return searchTerms;
}

function getFilteredResults(totalResults, countRequired){
  let filteredResults = [];
  for ( let i=0; i<totalResults.length; i++ ) {
    let personCount = getPersonCount(totalResults[i], totalResults);
    if ( personCount === countRequired ) {
      filteredResults.push(totalResults[i]);
      totalResults = totalResults.filter(function(el){
        if ( !(el.id === totalResults[i].id) ) {
          return true;
        } else {
          return false;
        }
      });

    }
  }
  return filteredResults;  
}

function getPersonCount(person, totalResults){
  let personCount = 0;
  for ( let i=0; i<totalResults.length; i++ ) {
    if ( totalResults[i].id === person.id ) {
      personCount++;
    }
  }
  return personCount;
}

function searchByTraits(people) {
  let searchCategories = getTraitInput();
  let searchTerms = getSearchTerms(searchCategories);
  let totalResults = searchByCriteria(searchCategories, searchTerms, people);
  let countRequired = searchCategories.length;
  let filteredResults = getFilteredResults(totalResults, countRequired);
  return filteredResults;
}

function searchByCriteria(searchCategories, searchTerms, people) {
  let totalResults = [];
  let result;
  for(let i=0; i<searchCategories.length; i++){
    result = people.filter(function(el){
      if ( el[searchCategories[i]] === searchTerms[i] ) {
        return true;
      }
    });
    totalResults = totalResults.concat(result);
  }
  return totalResults;
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("For " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
      // TODO: get person's info
      break;
    case "info":
      let family = searchFamily(person, people);
      alert("Family members:" + family);
      break;
    case "descendants":
      let descendentsNameArray = getDecendents([person]);
      alert(person.firstName + ' ' + person.lastName + '\'s decendents are: ' + descendentsNameArray);
      break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function getDecendents(person, people, nextDescendents=[]){

  let totalDescendents = nextDescendents;
  let childrenArray = nextDescendents;
  if(person.length>0){
    let children;
    for ( let i=0; i<person.length; i++ ) {
      children = people.filter(function(el){
        return el.parents.includes(person[i].id);
      });
      childrenArray = childrenArray.concat(children);
    }
    nextDescendents = childrenArray;
    
    return getDecendents(children, people, nextDescendents);
  
  } else {
    let descendentsNameArray = [];
    for (let i=0; i<totalDescendents.length; i++) {
      descendentsNameArray.push(totalDescendents[i].firstName + ' ' + totalDescendents[i].lastName);
    }
    return descendentsNameArray;
  }

}

function searchByName(people) {
  var firstName = promptFor("What is the person's first name?", chars);
  var lastName = promptFor("What is the person's last name?", chars);
  // TODO: find the person using the name they entered
  let results = [];
  for(var i=0; i<people.length; i++ ) {
    if ( (people[i].firstName.toLowerCase()===firstName.toLowerCase()) && (people[i].lastName.toLowerCase()===lastName.toLowerCase()) ) {
      results.push(people[i]);
      // displayPerson(people[i]);
    } 
  }
  if (results.length === 0){
    alert("Could not find that person");
    app(people);
  }
  else{
    let message;
    for(let i = 0; i < results.length; i++){
      message += displayPerson(results[i]);
      message += "\n";
    }
    return results;
  }
}
// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  var personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  let age = getAge(person);
  personInfo += "Age: " + age + "\n";
  
  // TODO: finish getting the rest of the information to display
  return(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
function searchFamily(person, people){
  let family = [];
  let member;
  for(let i=0; i<people.length; i++){
    member = people[i];
    if (person.id === member.currentSpouse || person.parents.includes(member.id) || member.parents.includes(person.id) || person.parents.includes(member.parents)){
      let familyMember = (member.firstName + " " + member.lastName);
      family.push(" " + familyMember);
    }
  }
  return family;
}
  
function getAge(person)
{
  var age;
  
  var today = new Date(); 
 
  let dob = person.dob;

   dob = dob.split("/");

  let birthDay = new Date(parseInt(dob[2]), parseInt(dob[0]), parseInt(dob[1]));
  
  age = today.getYear() - birthDay.getYear();

  let ageString = age.toString();
  
  return ageString;
}
// let peopleArray = [data[20],data[21]];  <-----test data for selectPerson.
// console.log(peopleArray);
// selectPerson(peopleArray);
function selectPerson(peopleArray){
  let namesOfPeopleArray = [];
  for (let i=0; i<peopleArray.length; i++){
    namesOfPeopleArray.push(i+1 + ".");
    namesOfPeopleArray.push(peopleArray[i].firstName);
    namesOfPeopleArray.push(peopleArray[i].lastName);
  }
  let namesOfPeople = namesOfPeopleArray.join(" ");
  alert(namesOfPeople);
  let userPersonChoice = prompt("Found: " + namesOfPeople + "\nPlease type number corresponding to your choice.");
  console.log(userPersonChoice);
  let person = peopleArray[userPersonChoice-1];
  console.log(person);
  return person;
}
