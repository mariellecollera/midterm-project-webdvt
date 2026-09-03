import { memo } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatCurrency, formatDateForDisplay } from '../utils/format';

/**
 * Performance note: Dashboard re-renders on every keystroke in the search
 * box and on every filter change. Without memoization, all N transaction
 * cards would re-render each time even though their own data hasn't
 * changed. Wrapping this in React.memo means a card only re-renders when
 * its own `transaction` prop actually changes (e.g. after an edit),
 * regardless of how many times the parent Dashboard re-renders.
 */
function TransactionCard({ transaction }) {
  const isExpense = transaction.type === 'Expense';

  return (
    <Link
      to={`/transaction/${transaction.id}`}
      className="flex items-center justify-between rounded-2xl px-5 py-4 transition-transform hover:-translate-y-0.5"
      style={{ border: '1.5px solid var(--color-border)' }}
    >
      <div className="min-w-0">
        <p className="truncate font-display text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {transaction.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {formatDateForDisplay(transaction.date)}
          </span>
          <Badge>{transaction.category}</Badge>
        </div>
      </div>

      <div
        className="ml-4 shrink-0 rounded-lg px-4 py-2 text-right font-bold"
        style={{
          backgroundColor: isExpense ? 'var(--color-expense-bg)' : 'var(--color-income-bg)',
          color: isExpense ? 'var(--color-expense-text)' : 'var(--color-income-text)',
        }}
      >
        {isExpense ? '-' : '+'}
        {formatCurrency(transaction.amount)}
      </div>
    </Link>
  );
}

export default memo(TransactionCard);
