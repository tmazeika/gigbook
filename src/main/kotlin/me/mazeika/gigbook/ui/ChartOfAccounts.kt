package me.mazeika.gigbook.ui

import javafx.beans.binding.Bindings
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
import java.time.Instant
import java.util.*

class ChartOfAccounts(store: GBStore) : VBox(
    ToolBar(
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
        Button("Delete"),
    ),
    TreeView(
        TreeItem<String>().apply {
            children += TreeItem("Assets").apply {
                Bindings.bindContent(
                    children,
                    MappedList(store.observeList { it.accounts }) {
                        TreeItem(it.name).also {
                            println("Creating TreeItem")
                        }
                    })
//                children += TreeItem("", TextFlow(Text("1001").apply {
//                    fill = Color.DARKGRAY
//                }, Text(" Cash "), Text("This is an account where...").apply {
//                    fill = Color.DARKGRAY
//                }))
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
)
