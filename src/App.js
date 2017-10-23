import React, {Component} from 'react';
import logo from './dossier-scoreboard.png';
import './App.css';
import {Bar} from "react-chartjs-2";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: {}
    }
  }

  fetchStats() {
    return fetch("http://do.pers.link/stats").then((res) => {
      return res.json();
    });
  }

  componentWillMount() {

    let refreshFunc = () => {
      this.fetchStats().then((res) => {
        let sorted = res.Users.sort((b, a) => {
          return ((a.Tasks < b.Tasks) ? -1 : ((a.Tasks == b.Tasks) ? 0 : 1));
        });
        this.setState({
          data: res.Users
        })
      });
    };

    window.setInterval(refreshFunc, 5000);

    refreshFunc();
  }

  render() {
    const userNames = [];
    const points = [];

    console.log("this.state.data", this.state.data);

    for (let key in this.state.data) {
      let user = this.state.data[key];
      userNames.push(user.Username);
      points.push(user.Tasks);
    }

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");

      return {
        labels: userNames,
        datasets: [
          {
            backgroundColor: 'rgb(143,227,143)',
            borderColor: 'rgb(96,158,96)',
            data: points,
          }
        ]
      }
    };

    const options = {
      legend: {
        display: false,
        defaultFontSize: 20,
      },
      tooltips: {
        titleFontSize: 20,
        bodyFontSize: 20,
        footerFontSize: 20,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontSize: 25,
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontSize: 20,
            }
          }
        ],
      },
      responsiveAnimationDuration: 1000,
    };

    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
          </header>
          <div className="scoreboard">
            <h1>Number of available blocks</h1>
            <Bar data={data} options={options}/>
          </div>
        </div>
    );
  }
}

export default App;
