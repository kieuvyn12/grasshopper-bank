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
      totalBalance: 0,
      fromYear: '2019',
      toYear: '2019',
      fromMonth: '01',
      toMonth: '01',
      fromDay: '01',
      toDay: '01',
      filteredTransactions: []
    }
    this.getUserId = this.getUserId.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.sortByDateAsc = this.sortByDateAsc.bind(this)
    this.initializeAccounts = this.initializeAccounts.bind(this)
    this.accountsData = this.accountsData.bind(this)
    this.sortBy = this.sortBy.bind(this)
    this.handleAccountNumberInput = this.handleAccountNumberInput.bind(this)
    this.handleSortInput = this.handleSortInput.bind(this)
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this)
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this)
    this.handleMonthChangeFrom = this.handleMonthChangeFrom.bind(this)
    this.handleMonthChangeTo = this.handleMonthChangeTo.bind(this)
    this.handleYearChangeFrom = this.handleYearChangeFrom.bind(this)
    this.handleYearChangeTo = this.handleYearChangeTo.bind(this)
    this.handleSubmitTime = this.handleSubmitTime.bind(this)
    this.resetDateRange = this.resetDateRange.bind(this)
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
    let copy
    if (this.state.filteredTransactions.length) {
      copy = JSON.parse(JSON.stringify([...this.state.filteredTransactions]))
    } else {
      copy = JSON.parse(JSON.stringify([...this.state.transactions]))
    }
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

  handleYearChangeFrom(event) {
    this.setState({
      fromYear: event.target.value
    })
  }

  handleYearChangeTo(event) {
    this.setState({
      toYear: event.target.value
    })
  }

  handleMonthChangeFrom(event) {
    this.setState({
      fromMonth: event.target.value
    })
  }

  handleMonthChangeTo(event) {
    this.setState({
      toMonth: event.target.value
    })
  }

  handleDateChangeFrom(event) {
    let day = event.target.value
    if (day.length < 2) {
      day = '0' + day
    }
    this.setState({
      fromDay: day
    })
  }

  handleDateChangeTo(event) {
    let day = event.target.value
    if (day.length < 2) {
      day = '0' + day
    }
    this.setState({
      toDay: day
    })
  }

  handleSubmitTime(event) {
    let fromDate = `${this.state.fromYear}.${this.state.fromMonth}.${this.state.fromDay}`
    let toDate = `${this.state.toYear}.${this.state.toMonth}.${this.state.toDay}`
    let unixFinalDateFrom = new Date(fromDate).getTime()
    let unixFinalDateTo = new Date(toDate).getTime()
    let filteredTransactions = this.state.transactions.filter(
      transaction =>
        transaction.date <= unixFinalDateTo &&
        transaction.date >= unixFinalDateFrom
    )
    this.setState({
      filteredTransactions: filteredTransactions
    })
    event.preventDefault()
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
    let arr = new Array(31)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i + 1
    }

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
        Sort by account:{' '}
        <form>
          <select name="accountNumber" onChange={this.handleAccountNumberInput}>
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
        From:
        <form onSubmit={this.handleSubmitTime}>
          <select name="year" onChange={this.handleYearChangeFrom}>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          <select name="month" onChange={this.handleMonthChangeFrom}>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
          <select name="day" onChange={this.handleDateChangeFrom}>
            {arr.map(x => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
          to:
          <select name="year" onChange={this.handleYearChangeTo}>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          <select name="month" onChange={this.handleMonthChangeTo}>
            <option value="01">Jan</option>
            <option value="02">Feb</option>
            <option value="03">Mar</option>
            <option value="04">Apr</option>
            <option value="05">May</option>
            <option value="06">Jun</option>
            <option value="07">Jul</option>
            <option value="08">Aug</option>
            <option value="09">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
          </select>
          <select name="day" onChange={this.handleDateChangeTo}>
            {arr.map(x => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
          <input type="submit" value="submit" className="submitDates" />
        </form>
        <button onClick={this.resetDateRange}>See All History</button>
      </div>
    )
  }
}

export default App
