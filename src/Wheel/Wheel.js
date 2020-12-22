import React from 'react';
import './Wheel.css';

class Wheel extends React.Component {

  state = {
    // wheel options will be determined dynamically with GET request 
    wheelOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    radius: 75, //pixels
    rotate: 0, // DEGREES
    easeOut: 0, // SECONDS
    angle: 0, // RADIANS
    top: null, // INDEX
    offset: null, // RADIANS
    net: null, // RADIANS
    result: null, // INDEX
    spinning: false,
    seen: false,
    winner: '',
  };

  // togglePop = () => {
  //   this.setState({
  //     seen: !this.state.seen
  //   });
  // };
  
  componentDidMount() {
    //genereate canvas wheel on load
    // this.setState({ wheelOptions: this.context.wheelOptions })
    this.renderWheel();
  }
  

  renderWheel() {
    // determine number and size of sectors that need to be created
    let numOptions = this.state.wheelOptions.length;
    let arcSize = (2 * Math.PI) / numOptions;
    
    this.setState({
      angle: arcSize,
    });

    // get index of starting position of selector
    this.topPosition(numOptions, arcSize);

    //dynamically genereate sectors from state wheelOptions
    let angle = 0;
    for(let i = 0; i < numOptions; i++) {
      let text = this.state.wheelOptions[i];
      this.renderSector(i + 1, text, angle, arcSize, this.getColor());
      angle += arcSize;
    }
  }
  topPosition = (num, angle) => {
    // set starting index and angle offset based on wheelOptions length
    // works up to 9 options

    let topSpot = null;
    let degreesOff = null;
    if(num ===9) {
      topSpot = 7;
      degreesOff = Math.PI / 2 - angle * 2;
    } else if (num === 8) {
      topSpot = 6;
      degreesOff = 0;
    } else if (num <= 7 && num > 4) {
      topSpot = num - 1;
      degreesOff = Math.PI / 2 - angle;
    } else if (num === 4) {
      topSpot = num - 1;
      degreesOff = 0;
    } else if (num <= 3) {
      topSpot = num;
      degreesOff = Math.PI / 2;
    }

    this.setState({
      top: topSpot - 1,
      offset: degreesOff
    });
  }

  renderSector(index, text, start, arc, color) {
    // create canvas arc for each wheelOptions element
    let canvas = document.getElementById('wheel');
    let ctx = canvas.getContext('2d');
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let radius = this.state.radius;
    let startAngle = start;
    let endAngle = start + arc;
    let angle = index * arc;
    let baseSize = 150;
    let textRadius = baseSize - 25;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;

    ctx.font = '17px Arial';
    ctx.fillStyle = 'black';
    ctx.stroke();

    ctx.save();
    ctx.translate(
      baseSize + Math.cos(angle - arc / 2) * textRadius, baseSize + Math.sin(angle - arc / 2) * textRadius
    );
    ctx.rotate(angle - arc / 2 + Math.PI / 1);

    // Handles text fill of each sector will need to figure out a good solution. Right now it just uses the first letter
    ctx.fillText(text, -ctx.measureText(text).width /9, 1);
    ctx.restore();
  }

  getColor() {
    // randomly generate rbg values for wheel options
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.5)`;
  }

  spin = () => {
    // set random spin degree and ease out time
    // set state variables to initiate animation

    let randomSpin = Math.floor(Math.random() * 1201) + 750;
    this.setState({
      rotate: randomSpin,
      easeOut: 2,
      spinning: true,
    });
    // calculate result after wheel stops spinning
    setTimeout(() => {
      this.props.handleWinner();
    }, 2000);
  }

  getResult = spin => {
    // find net rotation and add to offset angle
    // repeat substraction of inner angle amount from total distance traversed
    // use count as an index to find value of result from state wheelOptions
    const { angle, top, offset } = this.state;
    const { wheelOptions } = this.state;
    let netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
    let travel = netRotation + offset;
    let count = top + 1;
    while (travel > 0) {
      travel = travel - angle;
      count--;
    }
    let result;
    if (count >= 0) {
      result = count;
    } else {
      result = wheelOptions.length + count;
    }
    
    // set state variable to display result
    this.setState({
      net: netRotation,
      result: result,
      seen: true,
      winner: this.state.wheelOptions[result]
    });
  }
  reset = () => {
    // reset wheel and result
    this.setState({
      // rotate: 0,
      // easeOut: 0,
      result: null,
      spinning: false,
      seen: false
    });
  }
  render() {
  
    return (
      <div className="wheel-container">
        <span id="selector">&#9660;</span>
        <canvas
          id="wheel"
          // set width and height with % or move to style
          width='300px'
          height="300px"
          style={{
            WebkitTransform: `rotate(${this.state.rotate}deg)`,
            WebkitTransition: `-webkit-transform ${
              this.state.easeOut
            }s ease-out`
          }}
        />

        {this.state.spinning ? (
          <button type="button" id="reset" onClick={this.reset}>
            reset
          </button>
        ) : (
          <button type="button" id="spin" onClick={this.spin}>
            spin
          </button>
        )}
        {/* <div className="display">
          <span id="readout">
            YOU WON:{"  "}
            <span id="result">{this.props.wheelOptions[this.state.result]}</span>
          </span>
        </div> */}
        {/* {this.state.seen ? <ResultPopUp toggle={this.togglePop} resultId={this.state.winner.id} resultTitle={this.state.winner.title} /> : null } */}
      </div>
    );
  }
}



export default Wheel;