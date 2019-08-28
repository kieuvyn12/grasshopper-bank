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
  it('renders 9 userId buttons', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.userIdButton')).to.have.lengthOf(9)
  })
  it('hits test API', async () => {
    const wrapper = shallow(<App />)
    const data = await wrapper.instance().getTransactions(3)
    expect(data.length).to.equal(3)
  })
  it('sorts transactions in descending order', () => {
    const wrapper = shallow(<App />)
    const testTransactions = [{date: 10}, {date: 50}, {date: 1}]
    const expectedSortedTestTransactions = [{date: 50}, {date: 10}, {date: 1}]
    const data = wrapper.instance().sortByDateDesc(testTransactions)
    expect(data[0].date).to.equal(expectedSortedTestTransactions[0].date)
    expect(data[1].date).to.equal(expectedSortedTestTransactions[1].date)
    expect(data[2].date).to.equal(expectedSortedTestTransactions[2].date)
  })
})
