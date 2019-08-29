import React from 'react'
import Button from 'react-bootstrap/Button'

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
        {userIds.map(userId => (
          <Button
            variant="primary"
            size="lg"
            className="userIdButton"
            key={userId}
            onClick={this.props.handleClick}
            value={userId}
          >
            {userId}
          </Button>
        ))}
      </div>
    )
  }
}

export default UserIdButton
