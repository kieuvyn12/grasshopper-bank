import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

const adapter = new Adapter()
Enzyme.configure({adapter})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

describe('<App /> component', () => {
  test('renders', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.exists()).toBe(true)
  })
})
