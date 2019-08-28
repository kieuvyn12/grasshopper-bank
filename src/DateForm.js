import React from 'react'

class DateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fromYear: '2019',
      toYear: '2019',
      fromMonth: '01',
      toMonth: '01',
      fromDay: '01',
      toDay: '01'
    }
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this)
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this)
    this.handleMonthChangeFrom = this.handleMonthChangeFrom.bind(this)
    this.handleMonthChangeTo = this.handleMonthChangeTo.bind(this)
    this.handleYearChangeFrom = this.handleYearChangeFrom.bind(this)
    this.handleYearChangeTo = this.handleYearChangeTo.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleSubmit(event) {
    let fromDate = `${this.state.fromYear}.${this.state.fromMonth}.${this.state.fromDay}`
    let toDate = `${this.state.toYear}.${this.state.toMonth}.${this.state.toDay}`
    let unixFinalDateFrom = new Date(fromDate).getTime()
    let unixFinalDateTo = new Date(toDate).getTime()
    this.props.handleSubmitTime(unixFinalDateFrom, unixFinalDateTo)
    event.preventDefault()
  }

  render() {
    let arr = new Array(31)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i + 1
    }
    return (
      <div>
        From:
        <form onSubmit={this.handleSubmit}>
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
      </div>
    )
  }
}

export default DateForm
