import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    // Prevent calling fetch if nextPage is null
    if (paginatedTransactions?.nextPage === null) return

    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previous) => {
      if (response === null) return previous
      if (previous === null) return response

      return {
        data: [...previous.data, ...response.data],
        nextPage: response.nextPage,
      }
    })
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  const updateTransactionApproval = useCallback((transactionId: string, newValue: boolean) => {
    setPaginatedTransactions((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        data: prev.data.map((tx) => (tx.id === transactionId ? { ...tx, approved: newValue } : tx)),
      }
    })
  }, [])

  return {
    data: paginatedTransactions,
    loading,
    fetchAll,
    invalidateData,
    updateTransactionApproval,
  }
}
