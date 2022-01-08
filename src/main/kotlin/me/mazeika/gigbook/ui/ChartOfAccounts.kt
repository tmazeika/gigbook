package me.mazeika.gigbook.ui

import javafx.beans.binding.Bindings
import javafx.beans.property.SimpleObjectProperty
import javafx.scene.control.Button
import javafx.scene.control.ToolBar
import javafx.scene.control.TreeItem
import javafx.scene.control.TreeView
import javafx.scene.layout.Priority
import javafx.scene.layout.VBox
import me.mazeika.gigbook.MappedList
import me.mazeika.gigbook.accounts.Account
import me.mazeika.gigbook.state.GBStore
import me.mazeika.gigbook.state.actions.AddAccount
import me.mazeika.gigbook.state.actions.RemoveAccount
import java.time.Instant
import java.util.*

class ChartOfAccounts(store: GBStore) : VBox() {
    init {
        val selectedAccount = SimpleObjectProperty<Account?>()

        this.children += ToolBar(
            Button("Create").apply {
                setOnAction {
                    store.dispatch(
                        AddAccount(
                            Account(
                                1001,
                                "My account @ " + Instant.now().toEpochMilli(),
                                "Derp",
                                Currency.getInstance("USD"),
                                false
                            )
                        )
                    )
                }
            },
            Button("Edit"),
            Button("Archive"),
            Button("Delete").apply {
                setOnAction {
                    val account = selectedAccount.value
                    if (account != null) {
                        store.dispatch(RemoveAccount(account))
                    }
                }
                disableProperty().bind(selectedAccount.isNull)
            },
        )
        this.children += TreeView(
            TreeItem<String>().apply {
                children += TreeItem("Assets").apply {
                    Bindings.bindContent(
                        children,
                        MappedList(store.observeList { it.accounts }) { account ->
                            TreeItem(account.name)
                        })
                }
                children += TreeItem("Liabilities")
                children += TreeItem("Equity")
                children += TreeItem("Income")
                children += TreeItem("Expenses")
            }
        ).apply {
            setVgrow(this, Priority.ALWAYS)
            isShowRoot = false
        }
    }
}
