import React from 'react'
import './App.css'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      allTransactions: [],
      accounts: new Set()
    }
    this.getUserId = this.getUserId.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.sortByDateDesc = this.sortByDateDesc.bind(this)
    this.initializeAccounts = this.initializeAccounts.bind(this)
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
    let sorted = transactions.sort((a, b) => b.date - a.date)
    this.setState({
      allTransactions: sorted
    })
    this.initializeAccounts()
    return sorted
  }

  initializeAccounts() {
    let newAccounts = new Set()
    for (let i = this.state.allTransactions.length - 1; i >= 0; i--) {
      let transaction = this.state.allTransactions[i]
      if (
        transaction['type'] === 'Wire In' ||
        transaction['type'] === 'ACH In'
      ) {
        if (!newAccounts.has([transaction['beneficiary_account']])) {
          let accountNum = transaction['beneficiary_account']
          newAccounts.add(accountNum)
        }
      } else if (
        transaction['type'] === 'Wire Out' ||
        transaction['type'] === 'ACH Out'
      ) {
        if (!newAccounts.has([transaction['origin_account']])) {
          let accountNum = transaction['origin_account']
          newAccounts.add(accountNum)
        }
      } else {
        if (!newAccounts.has([transaction['beneficiary_account']])) {
          let accountNumBeneficiary = transaction['beneficiary_account']
          newAccounts.add(accountNumBeneficiary)
        }
        if (!newAccounts.has([transaction['origin_account']])) {
          let accountNumOrigin = transaction['origin_account']
          newAccounts.add(accountNumOrigin)
        }
      }
    }
    this.setState({accounts: newAccounts})
    return newAccounts
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
