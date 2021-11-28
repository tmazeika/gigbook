package me.mazeika.gigbook.accounts

import java.util.*

data class Account(
    val number: Int,
    val name: String,
    val description: String,
    val currency: Currency,
    val archived: Boolean = false
) {
    init {
        require(this.number >= 0)
        require(this.name.isNotEmpty())
    }
}
