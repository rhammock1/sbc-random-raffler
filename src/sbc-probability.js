let votes_array = [];

let person1 = {name: 'Tom', votes: 1000};
let person2 = {name: 'bob', votes: 2000};
let person3 = {name: 'phil', votes: 500};
let person_array = [person1, person2, person3];
person_array.forEach(person => {
  totalVotes += person.votes;
  for(let i = 0; i <= person.votes; i++) {
    votes_array.push(person.name);
  }
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(votes_array);


let result = votes_array[Math.floor(Math.random() * votes_array.length)]
console.log(result);