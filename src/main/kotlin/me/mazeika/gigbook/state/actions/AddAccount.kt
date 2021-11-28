package me.mazeika.gigbook.state.actions

import me.mazeika.gigbook.accounts.Account

data class AddAccount(val account: Account) : GBAction
