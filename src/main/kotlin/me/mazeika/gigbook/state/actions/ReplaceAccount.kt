package me.mazeika.gigbook.state.actions

import me.mazeika.gigbook.accounts.Account

data class ReplaceAccount(val oldAccount: Account, val newAccount: Account) :
    GBAction
