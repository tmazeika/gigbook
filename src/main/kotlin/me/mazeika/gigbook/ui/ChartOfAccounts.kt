package me.mazeika.gigbook.ui

import javafx.scene.control.Button
import javafx.scene.control.ToolBar
import javafx.scene.control.TreeItem
import javafx.scene.control.TreeView
import javafx.scene.layout.Priority
import javafx.scene.layout.VBox
import javafx.scene.paint.Color
import javafx.scene.text.Text
import javafx.scene.text.TextFlow
import me.mazeika.gigbook.state.Action
import me.mazeika.gigbook.state.GigBookState
import me.mazeika.gigbook.state.Store
import java.util.*

class ChartOfAccounts(store: Store<GigBookState>) : VBox(
    ToolBar(
        Button("Create").apply {
            setOnAction {
                store.dispatch(Action.Increment)
            }
        },
        Button("Edit").apply {
            setOnAction {
                store.dispatch(Action.Decrement)
            }
        },
        Button("Archive").apply {
            store.bind(textProperty()) { it.counter.toString() }
        },
        Button("Delete"),
    ),
    TreeView(
        TreeItem<String>().apply {
            children += TreeItem("Assets").apply {
                children += TreeItem("", TextFlow(Text("1001").apply {
                    fill = Color.DARKGRAY
                }, Text(" Cash "), Text("This is an account where...").apply {
                    fill = Color.DARKGRAY
                }))
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
) {
    data class Account(
        private val number: Int,
        private val name: String,
        private val description: String,
        private val currency: Currency
    )
}
