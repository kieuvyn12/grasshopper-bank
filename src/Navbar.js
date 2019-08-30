import React from 'react'
import Navbar from 'react-bootstrap/Navbar'

const NavBar = () => {
  return (
    <div className="navBar">
      <Navbar bg="light">
        <Navbar.Brand>
          <span className="blueText">
            <strong>Grasshopper</strong>
          </span>{' '}
          Bank
        </Navbar.Brand>
      </Navbar>
    </div>
  )
}

export default NavBar
