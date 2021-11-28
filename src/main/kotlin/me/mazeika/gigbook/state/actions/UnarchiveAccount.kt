package me.mazeika.gigbook.state.actions

import me.mazeika.gigbook.accounts.Account

data class UnarchiveAccount(val account: Account) : GBAction
