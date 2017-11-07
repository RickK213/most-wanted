/*
Build all of your functions for displaying and gathering information below (GUI).
*/
// app is the function called to start the entire application
function app(people){
  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch(searchType){
    case 'yes':
      searchByName();
      break;
    case 'no':
      let searchByTraitsArray = searchByTraits(people);
      let message = 'The people who meet this search criteria are: ';
      for( let i=0; i<searchByTraitsArray.length; i++){
        message += searchByTraitsArray[i];
        if ( i === searchByTraitsArray.length-1 ) {
          message += ".";
        }
        else {
          message += ", ";
        }
      }
      alert(message);
      break;
    default:
      alert("Wrong! Please try again, following the instructions dummy. :)");
      //app(people); // restart app
      break;
  }
}

//TO DO: Finsish writing this validation helper function and incorporate it into promptFor
function isNumber(input){
  if ( !isNaN(input) ) {
    return false;
  }
  else {
    return true;
  }
}

function searchByTraits(people) {
  let userSearchChoice = prompt("What would you like to search by? You can enter multiple options. Each option should be one word separated by a comma. The options are 'height, 'weight', 'eyecolor', 'gender', 'age', 'occupation'. For example: 'height, eyecolor, age'");
  // TO DO: clean up the string? Why aren't .trim or .replace working? Because javascript?
  // let cleanString = userSearchChoice.trim();
  // console.log(cleanString);
  let searchCategories = userSearchChoice.split(",");
  let searchTerms = [];
  for ( let i=0; i<searchCategories.length; i++ ) {
    //TO DO: Validate user input
    //criteriaTerms.push(promptFor( ('What ' + criteriaArray[i] + ' would you like to search for?'),isNumber ));
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
  let totalResults = searchByCriteria(searchCategories, searchTerms, people);
  let countRequired = searchCategories.length;
  let idArray = [];
  for ( let i=0; i<totalResults.length; i++ ) {
    idArray.push(totalResults[i].id);
  }
  let filteredIDs = [];
  for ( let i=0; i<idArray.length; i++ ) {
    let iDCount = getIDCount(idArray[i],idArray);
    if(iDCount === countRequired){
      filteredIDs.push(idArray[i]);
      idArray = idArray.filter(function(el){
        if ( el === idArray[i] ) {
          return false;
        } else {
          return true;
        }
      });
    }
  }
  let filteredNames = [];
  for ( let i=0; i<people.length; i++ ) {
    if ( filteredIDs.includes(people[i].id) ) {
      filteredNames.push(people[i].firstName + " " + people[i].lastName);
    }
  }
  return filteredNames;
}

function getIDCount(id, idArray){
  let iDCount = 0;
  for ( let i=0; i<idArray.length; i++ ) {
    if ( idArray[i] === id ) {
      iDCount++;
    }
  }
  return iDCount;
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

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
      // TODO: get person's info
      break;
    case "family":
      // TODO: get person's family
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

function searchByName(people){
  var firstName = promptFor("What is the person's first name?", chars);
  var lastName = promptFor("What is the person's last name?", chars);

  // TODO: find the person using the name they entered

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
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
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
