import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        { employeeId }
      )
      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  const updateTransactionApproval = useCallback((transactionId: string, newValue: boolean) => {
    setTransactionsByEmployee((prev) => {
      if (!prev) return prev
      return prev.map((tx) => (tx.id === transactionId ? { ...tx, approved: newValue } : tx))
    })
  }, [])

  return {
    data: transactionsByEmployee,
    loading,
    fetchById,
    invalidateData,
    updateTransactionApproval,
  }
}
