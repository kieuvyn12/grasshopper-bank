import React from 'react'

class UserIdButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let userIds = new Array(9)
    for (let i = 0; i < userIds.length; i++) {
      userIds[i] = i + 1
    }
    return (
      <div className="buttons">
        What is your user ID?
        {userIds.map(userId => (
          <button
            id={userId}
            className="userIdButton"
            key={userId}
            onClick={this.props.handleClick}
            value={userId}
          >
            {userId}
          </button>
        ))}
      </div>
    )
  }
}

export default UserIdButton
