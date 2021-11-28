package me.mazeika.gigbook.state.actions

import me.mazeika.gigbook.accounts.Account

data class ArchiveAccount(val account: Account) : GBAction
