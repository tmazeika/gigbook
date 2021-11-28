package me.mazeika.gigbook.state.actions

import me.mazeika.gigbook.accounts.Account

data class RemoveAccount(val account: Account) : GBAction
