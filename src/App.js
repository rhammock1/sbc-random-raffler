import React from 'react';
import './App.css';
import config from './config';
import Wheel from './Wheel/Wheel';
import sbcLogo from './images/sbcHeaderLogo.png';

class App extends React.Component {
  
  state = {
    newPerson: '',
    winner: '',
    people: [],
    entries: 0,
    uploadEntries: [],
    csv: {},
    formData: {},
    resultArray: [],
  }

  handleUploadChange = (e) => {
    
    this.setState({ csv: e.target.files[0]})
    let form = document.getElementById('form');
    let formData = new FormData(form);
    let csv = this.state.csv
    formData.append('csvFile', csv);
    this.setState({ formData: formData })
    
  }

  handleUpload = async () => {
    this.setState({ uploading: true })
    await fetch(`${config.API_ENDPOINT}`, {
      method: 'DELETE'
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(e => Promise.reject(e))
        }
        return res
      })
      .catch(error => {
        console.error({ error })
      })
      
    this.setState({ uploadEntries: []})
  
    
    await fetch(`${config.API_ENDPOINT}`, {
      method: 'POST',
      body: this.state.formData
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(e => Promise.reject(e))
        } else {
          console.log('hello')
          return res.json();
        }
      })
      .catch( error => {
        console.error({ error })
      })
    await fetch(`${config.API_ENDPOINT}`)
      .then(res => {
        if(!res.ok) {
          return res.json().then(e => Promise.reject(e))
        } else {
          return res.json()
        }
      })
      .then(uploadEntries => {
        console.log(uploadEntries);
        this.setState({ uploadEntries, uploading: false })
      })
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
    // e.preventDefault();
    let resultArray = [];
    if(this.state.people.length > 0) {
      // this.shuffleArray(this.state.people);
      this.state.people.forEach(person => {
      for(let i = 0; i < person.entries; i++) {
        resultArray.push(person.full_name);
      }
    })
    
    }
    else {
      // this.shuffleArray(this.state.uploadEntries)
      this.state.uploadEntries.forEach(entry => {
        for(let i = 0; i < entry.entries; i++) {
          resultArray.push(entry.full_name);
        }
      })
    }
    this.shuffleArray(resultArray);
    console.log(resultArray);
    // let result = this.state.people[Math.floor(Math.random() * this.state.people.length)]
    // this.setState({ winner: result })
    this.setState({resultArray})
   
    
    let result = resultArray[Math.floor(Math.random() * resultArray.length)]
    this.setState({ winner: result })
    
  };


  render() {
     this.fileInput = React.createRef();
    return (
      <>
      <header>
        <img src={sbcLogo} alt='Sports Biz Cares logo' className='logo' />
        <h1>SPORTS BIZ CARES</h1>
      </header>
      <div className='container'>
      <form id='form' onSubmit={e => this.handlePeopleSubmit(e)}>
        <fieldset>
          <legend><h2>Upload CSV File</h2></legend>

          <div className='form-group'>
            <label htmlFor='csvFile'>Import Excel Sheet(.csv): </label>
            <input onChange={this.handleUploadChange}type='file' id='csvFile' name='csvFile' ref={this.fileInput} />
            
          </div>
          <button className='upload' type='button' onClick={e => this.handleUpload(e)} >Upload</button> 
          {this.state.uploading ? <p>Uploading...</p> : null}
          <br />

        </fieldset>
      </form>
      
      <Wheel winner={this.state.winner} handleWinner={this.handleWinnerSubmit} />
      </div>
      

      </>
    );
  }
}

export default App;
