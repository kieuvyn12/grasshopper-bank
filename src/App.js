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
    this.getTransactions = this.getTransactions.bind(this)
    this.sortByDateDesc = this.sortByDateDesc.bind(this)
  }

  getUserId(event) {
    this.setState({
      userId: event.target.value
    })
    this.getTransactions(event.target.value)
  }

  async getTransactions(num) {
    let results = await axios.get(
      `http://tech-challenge.d3ucrjz23k.us-east-1.elasticbeanstalk.com/transactions/${num}`
    )
    this.sortByDateDesc(results.data)
    return results.data
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
        <div className="buttons">
          What is your user ID?
          {userIds.map(userId => (
            <button
              id={userId}
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
