import React from 'react'
import './App.css'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      allTransactions: []
    }
    this.getUserId = this.getUserId.bind(this)
    this.sortByDateDesc = this.sortByDateDesc.bind(this)
  }

  async getUserId(event) {
    this.setState({
      userId: event.target.value
    })
    let results = await axios.get(
      `http://tech-challenge.d3ucrjz23k.us-east-1.elasticbeanstalk.com/transactions/${event.target.value}`
    )
    this.sortByDateDesc(results.data)
  }

  sortByDateDesc(transactions) {
    this.setState({
      allTransactions: transactions.sort((a, b) => b.date - a.date)
    })
  }

  render() {
    let userIds = new Array(9)
    for (let i = 0; i < userIds.length; i++) {
      userIds[i] = i + 1
    }

    return (
      <div className="App">
        <div>
          What is your user ID?
          {userIds.map(userId => (
            <button
              className="userIdButton"
              key={userId}
              onClick={this.getUserId}
              value={userId}
            >
              {userId}
            </button>
          ))}
        </div>
      </div>
    )
  }
}

export default App
