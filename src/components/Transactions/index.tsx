import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { usePaginatedTransactions } from "src/hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "src/hooks/useTransactionsByEmployee"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()

  const {
    updateTransactionApproval: updatePaginated,
    data: paginatedData,
  } = usePaginatedTransactions()

  const {
    updateTransactionApproval: updateFiltered,
    data: filteredData,
  } = useTransactionsByEmployee()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      console.log("Sending approval update to backend...")
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })

      console.log("Updating filtered data...")
      updateFiltered(transactionId, newValue)

      console.log("Updating paginated data...")
      updatePaginated(transactionId, newValue)
    },
    [fetchWithoutCache, updateFiltered, updatePaginated]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}