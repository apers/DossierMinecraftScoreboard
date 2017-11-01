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
        let sorted = res.users.sort((b, a) => {
          return ((a.tasks < b.tasks) ? -1 : ((a.tasks === b.tasks) ? 0 : 1));
        });
        this.setState({
          data: res
        })
      });
    };

    window.setInterval(refreshFunc, 5000);

    refreshFunc();
  }

  render() {
    const userNames = [];
    const userPoints = [];
    const teamNames = [];
    const teamPoints = [];

    if (!this.state.data.users) {
      return null;
    }

    console.log("this.state.data", this.state.data);

    /* User */
    this.state.data.users.sort((a, b) => {
      return b.available_blocks - a.available_blocks;
    });

    this.state.data.users.forEach((user) => {
      userNames.push(user.username);
      userPoints.push(user.available_blocks);
    });

    const userData = (canvas) => {
      const ctx = canvas.getContext("2d");

      return {
        labels: userNames,
        datasets: [
          {
            backgroundColor: 'rgb(143,227,143)',
            borderColor: 'rgb(96,158,96)',
            data: userPoints,
          }
        ]
      }
    };

    const userOptions = {
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

    /* Team */
    this.state.data.users.sort((a, b) => {
      return b.available_blocks - a.available_blocks;
    });

    this.state.data.teams.forEach((team) => {
      teamNames.push(team.teamname);
      teamPoints.push(team.available_blocks);
    });


    const teamData = (canvas) => {
      const ctx = canvas.getContext("2d");

      console.log("teamNames", teamNames);
      console.log("teamPoints", teamPoints);


      return {
        labels: teamNames,
        datasets: [
          {
            backgroundColor: 'rgb(258,227,143)',
            borderColor: 'rgb(96,258,96)',
            data: teamPoints,
          }
        ]
      }
    };

    const teamOptions = {
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
              beginAtZero: true,
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
            <div className="user-chart">
              <h1>User available blocks</h1>
              <Bar data={userData} options={userOptions}/>
            </div>
            <div className="team-chart">
              <h1>Team available blocks</h1>
              <Bar data={teamData} options={teamOptions}/>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
