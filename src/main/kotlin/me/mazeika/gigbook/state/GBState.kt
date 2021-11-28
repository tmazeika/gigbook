package me.mazeika.gigbook.state

import me.mazeika.gigbook.accounts.Account
import me.mazeika.gigbook.state.actions.*
import me.mazeika.gigbook.state.store.SimpleStore
import me.mazeika.gigbook.state.store.Store

typealias GBStore = Store<GBState, GBAction>

data class GBState(
    val accounts: List<Account>
) {
    companion object {
        fun createStore(): GBStore = SimpleStore(
            initialState = GBState(listOf()),
            reducers = listOf(this::accountsReducer)
        )

        private fun accountsReducer(state: GBState, action: GBAction): GBState =
            when (action) {
                is AddAccount -> state.copy(
                    accounts = state.accounts.plus(
                        action.account
                    )
                )
                is RemoveAccount -> state.copy(
                    accounts = state.accounts.minus(action.account)
                )
                is ArchiveAccount -> state.copy(accounts = state.accounts.map {
                    if (it == action.account) it.copy(archived = true) else it
                })
                is UnarchiveAccount -> state.copy(accounts = state.accounts.map {
                    if (it == action.account) it.copy(archived = false) else it
                })
                is ReplaceAccount -> state.copy(accounts = state.accounts.map {
                    if (it == action.oldAccount) action.newAccount else it
                })
                else -> state
            }
    }
}
