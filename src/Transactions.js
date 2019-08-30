import React from 'react'
import {Container, Table} from 'react-bootstrap'

const Transactions = props => (
  <div>
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date Posted</th>
            <th>Description</th>
            <th>Category</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {props.allTransactions.map(transaction => (
            <tr key={transaction.id} className="transaction">
              <td>{transaction.displayDate}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>
                {transaction.type}{' '}
                {transaction.amount > 0 ? (
                  <svg
                    height="15px"
                    width="15px"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="arrow-alt-circle-up"
                    class="svg-inline--fa fa-arrow-alt-circle-up fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#94de83"
                      d="M256 504c137 0 248-111 248-248S393 8 256 8 8 119 8 256s111 248 248 248zm0-448c110.5 0 200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56zm20 328h-40c-6.6 0-12-5.4-12-12V256h-67c-10.7 0-16-12.9-8.5-20.5l99-99c4.7-4.7 12.3-4.7 17 0l99 99c7.6 7.6 2.2 20.5-8.5 20.5h-67v116c0 6.6-5.4 12-12 12z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    height="15px"
                    width="15px"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="arrow-alt-circle-down"
                    class="svg-inline--fa fa-arrow-alt-circle-down fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#f0b3ad"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm-32-316v116h-67c-10.7 0-16 12.9-8.5 20.5l99 99c4.7 4.7 12.3 4.7 17 0l99-99c7.6-7.6 2.2-20.5-8.5-20.5h-67V140c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12z"
                    ></path>
                  </svg>
                )}{' '}
              </td>
              <td>${transaction.amount}.00</td>
              <td>${transaction.balance}.00</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  </div>
)

export default Transactions
