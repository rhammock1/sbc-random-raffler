import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    newPerson: '',
    winner: '',
    people: [],
    entries: 0,
  }
  
  handlePeopleSubmit = (e) => {
    e.preventDefault();
    
    const full_name = e.target.full_name.value;
    
    const entries = e.target.entries.value;
    const newPerson = { full_name, entries }

    let joined = this.state.people.concat(newPerson);
    this.setState({ newPerson, people: joined, entries: this.state.entries + parseFloat(entries) })
    e.target.reset();
  };

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  };
  

  handleWinnerSubmit = (e) => {
    // Winner submit button click
    e.preventDefault();
    this.shuffleArray(this.state.people);
    // let result = this.state.people[Math.floor(Math.random() * this.state.people.length)]
    // this.setState({ winner: result })

    let resultArray = [];
    this.state.people.forEach(person => {
      for(let i = 0; i < person.entries; i++) {
        resultArray.push(person.full_name);
      }
    })
    this.shuffleArray(resultArray);
    console.log(resultArray);
    let result = resultArray[Math.floor(Math.random() * resultArray.length)]
    this.setState({ winner: result })
    
  };

  render() {
    return (
      <>
      <form onSubmit={e => this.handlePeopleSubmit(e)}>
        <fieldset>
          <legend>Input values to choose random winner</legend>
          <div className='form-group'>
            <label htmlFor='full_name'>Full Name: </label>
            <input type='text' id='full_name' name='full_name' />
          </div>
          <div className='form-group'>
            <label htmlFor='entries'>Number of Entries: </label>
            <input type='text' id='entries' name='entries' />
          </div>
          <button type='submit'>Submit Name</button>
          <p id='or'> - or -</p>
          <div className='form-group'>
            <label htmlFor='file-import'>Import Excel sheet: </label>
            <input type='file' id='file-import' name='file-import' />
          </div>
        </fieldset>
      </form>
      <div className='namesAndEntries'>
        <ul>
          {this.state.people.map((person, index) => {
            
          return <li key={index}> {person.full_name} - {person.entries} </li>})}
        </ul>
        
        <button type='submit' onClick={e => this.handleWinnerSubmit(e)}> Find Winner </button>
      </div>
      <div className='results'>
        {this.state.winner}
      </div>


      </>
    );
  }
}

export default App;
