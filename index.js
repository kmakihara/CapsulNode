// A simulation of creating new IDs. Basically get the last element and increase the value of an ID.
exports.findIndexOfElement = function () {
    return movies[movies.length -1].id + 1;
}

// Function findIndexOfElement helps to identify the array index according to specified key/value pair.
exports.findIndexOfElement = function (inputArray, key, value) {
    for (var i = 0; i < inputArray.length; i++){
        if (inputArray[i][key] === value){
            return i;
        }
    }
return -1;
}
























