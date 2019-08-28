import React from 'react'
import './App.css'
import axios from 'axios'
import Transactions from './Transactions'
import DateForm from './DateForm'
import UserIdButton from './UserIdButtons'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      allTransactions: [],
      accounts: new Set(),
      transactions: [],
      totalBalance: 0,
      filteredTransactions: [],
      filteredRangeFrom: '',
      filteredRangeTo: ''
    }
    this.getUserId = this.getUserId.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.sortByDateAsc = this.sortByDateAsc.bind(this)
    this.initializeAccounts = this.initializeAccounts.bind(this)
    this.accountsData = this.accountsData.bind(this)
    this.sortBy = this.sortBy.bind(this)
    this.handleAccountNumberInput = this.handleAccountNumberInput.bind(this)
    this.handleSortInput = this.handleSortInput.bind(this)
    this.handleSubmitTime = this.handleSubmitTime.bind(this)
    this.resetDateRange = this.resetDateRange.bind(this)
    this.convertUnixToDate = this.convertUnixToDate.bind(this)
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
          category: transaction.category,
          displayDate: this.convertUnixToDate(transaction.date)
        })
      }
    }
    arr = arr.reverse()
    this.setState({transactions: arr})
    return arr
  }

  sortBy(event) {
    let copy
    if (this.state.filteredTransactions.length) {
      copy = JSON.parse(JSON.stringify([...this.state.filteredTransactions]))
    } else {
      copy = JSON.parse(JSON.stringify([...this.state.transactions]))
    }
    switch (event) {
      case 'dateAsc':
        copy.sort((a, b) => a.date - b.date)
        break
      case 'dateDes':
        copy.sort((a, b) => b.date - a.date)
        break
      case 'amountDes':
        copy.sort((a, b) => b.amount - a.amount)
        break
      case 'amountAsc':
        copy.sort((a, b) => a.amount - b.amount)
        break
      case 'typeDes':
        copy.sort((a, b) => b.type[0].charCodeAt() - a.type[0].charCodeAt())
        break
      case 'typeAsc':
        copy.sort((a, b) => a.type[0].charCodeAt() - b.type[0].charCodeAt())
        break
      case 'categoryDes':
        copy.sort(
          (a, b) => b.category[0].charCodeAt() - a.category[0].charCodeAt()
        )
        break
      case 'categoryAsc':
        copy.sort(
          (a, b) => a.category[0].charCodeAt() - b.category[0].charCodeAt()
        )
        break
      default:
        copy.sort((a, b) => a.date - b.date)
    }
    if (this.state.filteredTransactions.length) {
      this.setState({filteredTransactions: copy})
    } else {
      this.setState({transactions: copy})
    }
    return copy
  }

  handleAccountNumberInput(event) {
    let accountNumber = Number(event.target.value)
    this.accountsData(accountNumber)
  }

  handleSortInput(event) {
    this.sortBy(event.target.value)
  }

  handleSubmitTime(unixFinalDateFrom, unixFinalDateTo) {
    let filteredTransactions = this.state.transactions.filter(
      transaction =>
        transaction.date <= unixFinalDateTo &&
        transaction.date >= unixFinalDateFrom
    )
    let filteredRangeFrom = this.convertUnixToDate(unixFinalDateFrom)
    let filteredRangeTo = this.convertUnixToDate(unixFinalDateTo)
    this.setState({
      filteredTransactions: filteredTransactions,
      filteredRangeFrom: filteredRangeFrom,
      filteredRangeTo: filteredRangeTo
    })
    return filteredTransactions
  }

  resetDateRange(event) {
    this.setState({
      filteredTransactions: []
    })
    event.preventDefault()
    return []
  }

  convertUnixToDate(date) {
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    date = new Date(date)
    let year = date.getFullYear()
    let month = months[date.getMonth()]
    let day = date.getDate()
    let display = `${month}-${day}-${year}`
    return display
  }

  render() {
    return (
      <div className="App">
        {this.state.userId === 0 ? (
          <UserIdButton handleClick={this.getUserId} />
        ) : (
          <div>
            Not you? Choose another user ID to sign in as:{' '}
            <div className="buttons">
              <UserIdButton handleClick={this.getUserId} />
            </div>
            Sort by account:{' '}
            <form>
              <select
                name="accountNumber"
                onChange={this.handleAccountNumberInput}
              >
                {[...this.state.accounts].map(account => (
                  <option key={Math.random()} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </form>
            Sort By:
            <form>
              <select name="sortBy" onChange={this.handleSortInput}>
                <option value="dateDes">Date Descending</option>
                <option value="dateAsc">Date Ascending</option>
                <option value="amountDes">Amount Descending</option>
                <option value="amountAsc">Amount Ascending</option>
                <option value="typeDes">Type Descending</option>
                <option value="typeAsc">Type Ascending</option>
                <option value="categoryDes">Category Descending</option>
                <option value="categoryAsc">Category Ascending</option>
              </select>
            </form>
            <DateForm handleSubmitTime={this.handleSubmitTime} />
            <button onClick={this.resetDateRange}>See All History</button>
            {this.state.filteredTransactions.length ? (
              <div>
                Only transactions from {this.state.filteredRangeFrom} to{' '}
                {this.state.filteredRangeTo}
                <Transactions
                  allTransactions={this.state.filteredTransactions}
                />
              </div>
            ) : (
              <div>
                {this.state.transactions.length ? (
                  <div>All transactions: </div>
                ) : (
                  ' '
                )}
                <Transactions allTransactions={this.state.transactions} />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default App
