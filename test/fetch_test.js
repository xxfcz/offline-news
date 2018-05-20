require('es6-promise').polyfill();
require('isomorphic-fetch');

fetch('http://localhost:8081/stories').then(function(response){
    return response.json();
}).then(function(data){
    console.log(data);
});