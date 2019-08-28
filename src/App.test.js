import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import Enzyme, {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {expect} from 'chai'
import sinon from 'sinon'

const adapter = new Adapter()
Enzyme.configure({adapter})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

describe('<App /> component', () => {
  it('renders', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.exists()).to.equal(true)
  })
  describe('userId buttons', () => {
    it('renders 9 userId buttons', () => {
      const wrapper = shallow(<App />)
      expect(wrapper.find('.userIdButton')).to.have.lengthOf(9)
    })
  })

  describe('API response', () => {
    it('hits test API', async () => {
      const wrapper = shallow(<App />)
      const data = await wrapper.instance().getTransactions(3)
      expect(data.length).to.equal(3)
    })
  })

  describe('getting initial transactions from API and sorting', () => {
    it('sorts transactions in descending order', () => {
      const wrapper = shallow(<App />)
      const testTransactions = [{date: 10}, {date: 50}, {date: 1}]
      const expectedSortedTestTransactions = [{date: 50}, {date: 10}, {date: 1}]
      const data = wrapper.instance().sortByDateDesc(testTransactions)
      expect(data[0].date).to.equal(expectedSortedTestTransactions[0].date)
      expect(data[1].date).to.equal(expectedSortedTestTransactions[1].date)
      expect(data[2].date).to.equal(expectedSortedTestTransactions[2].date)
    })
    it('populates state with sorted transactions', async () => {
      const wrapper = shallow(<App />)
      const testTransactions = [{date: 10}, {date: 50}, {date: 1}]
      const expectedSortedTestTransactions = [{date: 50}, {date: 10}, {date: 1}]
      wrapper.instance().sortByDateDesc(testTransactions)
      expect(wrapper.state().allTransactions[0].date).to.equal(
        expectedSortedTestTransactions[0].date
      )
      expect(wrapper.state().allTransactions[1].date).to.equal(
        expectedSortedTestTransactions[1].date
      )
      expect(wrapper.state().allTransactions[2].date).to.equal(
        expectedSortedTestTransactions[2].date
      )
    })
  })

  describe('populating account numbers', () => {
    it('populates state with account numbers', async () => {
      const wrapper = shallow(<App />)
      const testTransactions = [
        {
          id: 3,
          category: 'supplies',
          type: 'ACH In',
          origin_account: 5432,
          beneficiary_account: 2345,
          amount: 879,
          description: 'chairs',
          initiator_id: 3,
          approver_id: 2,
          company_id: 1,
          date: 1557187200000
        },
        {
          id: 5,
          category: 'maintenance',
          type: 'Internal Transfer',
          origin_account: 1234,
          beneficiary_account: 2345,
          amount: 145,
          description: 'paper towels',
          initiator_id: 3,
          approver_id: 1,
          company_id: 1,
          date: 1552089600000
        },
        {
          id: 25,
          category: 'maintenance',
          type: 'ACH In',
          origin_account: 8542,
          beneficiary_account: 2345,
          amount: 134,
          description: 'paper towels',
          initiator_id: 3,
          approver_id: 1,
          company_id: 1,
          date: 1554681600000
        }
      ]
      wrapper.setState({allTransactions: testTransactions})
      let accounts = wrapper.instance().initializeAccounts()
      accounts = Array.from(accounts).sort()
      expect(accounts[0]).to.equal(1234)
      expect(accounts[1]).to.equal(2345)
      let accountsStateArray = Array.from(wrapper.state().accounts).sort()
      expect(accountsStateArray[0]).to.equal(1234)
      expect(accountsStateArray[1]).to.equal(2345)
    })
  })
})
