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
})
