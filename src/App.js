import React from 'react'
import './App.css'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      allTransactions: [],
      accounts: new Set(),
      transactions: [],
      totalBalance: 0
    }
    this.getUserId = this.getUserId.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.sortByDateAsc = this.sortByDateAsc.bind(this)
    this.initializeAccounts = this.initializeAccounts.bind(this)
    this.accountsData = this.accountsData.bind(this)
    this.sortBy = this.sortBy.bind(this)
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
    this.sortByDateAsc(results.data)
    return results.data
  }

  sortByDateAsc(transactions) {
    let sorted = transactions.sort((a, b) => a.date - b.date)
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
    this.accountsData()
    return newAccounts
  }

  accountsData(account) {
    let arr = []
    let newBalance = this.state.totalBalance
    for (let i = 0; i < this.state.allTransactions.length; i++) {
      let transaction = this.state.allTransactions[i]
      if (
        account === undefined ||
        transaction.origin_account === account ||
        transaction.beneficiary_account === account
      ) {
        if (
          transaction['type'] === 'Wire In' ||
          transaction['type'] === 'ACH In'
        ) {
          newBalance = newBalance + transaction.amount
        } else if (
          transaction['type'] === 'Wire Out' ||
          transaction['type'] === 'ACH Out'
        ) {
          newBalance = newBalance - transaction.amount
        } else {
          if (transaction.origin_account === account) {
            newBalance = newBalance - transaction.amount
          } else if (transaction.beneficiary_account === account) {
            newBalance = newBalance + transaction.amount
          }
        }
        arr.push({
          id: transaction.id,
          balance: newBalance,
          date: transaction.date,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          origin_account: transaction.origin_account,
          beneficiary_account: transaction.beneficiary_account,
          category: transaction.category
        })
      }
    }
    arr = arr.reverse()
    this.setState({transactions: arr})
    return arr
  }

  sortBy(event) {
    let copy = JSON.parse(JSON.stringify([...this.state.transactions]))
    if (event === 'dateAsc') {
      copy.sort((a, b) => a.date - b.date)
    } else if (event === 'dateDes') {
      copy.sort((a, b) => b.date - a.date)
    } else if (event === 'amountDes') {
      copy.sort((a, b) => b.amount - a.amount)
    } else if (event === 'amountAsc') {
      copy.sort((a, b) => a.amount - b.amount)
    } else if (event === 'typeDes') {
      copy.sort((a, b) => b.type[0].charCodeAt() - a.type[0].charCodeAt())
    } else if (event === 'typeAsc') {
      copy.sort((a, b) => a.type[0].charCodeAt() - b.type[0].charCodeAt())
    } else if (event === 'categoryDes') {
      copy.sort(
        (a, b) => b.category[0].charCodeAt() - a.category[0].charCodeAt()
      )
    } else if (event === 'categoryAsc') {
      copy.sort(
        (a, b) => a.category[0].charCodeAt() - b.category[0].charCodeAt()
      )
    }
    this.setState({transactions: copy})
    return copy
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
