import React from 'react'

const Transactions = props => (
  <div>
    <div>
      All transactions:{' '}
      <ol>
        {props.allTransactions.map(transaction => (
          <li key={transaction.id} className="transaction">
            {transaction.displayDate}, description: {transaction.description},
            type: {transaction.type}, amount: {transaction.amount}, total
            balance: {transaction.balance}, category: {transaction.category}
          </li>
        ))}
      </ol>
    </div>
  </div>
)

export default Transactions
