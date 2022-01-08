package me.mazeika.gigbook.state.store

import javafx.beans.property.SimpleObjectProperty
import javafx.beans.value.ObservableValue
import javafx.beans.value.WritableValue
import javafx.collections.FXCollections
import javafx.collections.ObservableList
import java.util.*
import kotlin.math.min

class SimpleStore<State, Action>(
    private val initialState: State,
    private val reducers: List<Reducer<State, Action>>
) : Store<State, Action> {

    private val subscriptions: MutableSet<(State, State) -> Unit> =
        Collections.newSetFromMap(WeakHashMap())

    private var currentState: State = this.initialState

    override fun <R> observe(selector: Selector<State, R>): ObservableValue<R> =
        SimpleObjectProperty<R>().also { this.bind(it, selector) }

    override fun <R> observeList(selector: Selector<State, List<R>>): ObservableList<R> =
        FXCollections.observableArrayList<R>().also { currentList ->
            this.subscribe(selector) { newList ->
                var from = -1
                var to = -1
                val replaceFromTo = {
                    from.until(to).forEach { i -> currentList[i] = newList[i] }
                    from = -1
                    to = -1
                }
                val replaceUntilIdx = min(currentList.size, newList.size)
                0.until(replaceUntilIdx).forEach { i ->
                    if (currentList[i] !== newList[i]) {
                        if (from == -1) from = i
                        to = i + 1
                        if (i == replaceUntilIdx - 1) replaceFromTo()
                    } else if (from != -1) {
                        replaceFromTo()
                    }
                }
                if (newList.size > currentList.size) {
                    currentList.addAll(
                        newList.subList(
                            fromIndex = currentList.size,
                            toIndex = newList.size
                        )
                    )
                }
            }
        }

    override fun <R> bind(
        prop: WritableValue<R>,
        selector: Selector<State, R>
    ) {
        this.subscribe(selector) { prop.value = it }
    }

    override fun dispatch(action: Action) {
        val newState =
            this.reducers.fold(this.currentState) { accState, reducer ->
                reducer(accState, action)
            }
        if (newState !== this.currentState) {
            this.subscriptions.forEach { subscription ->
                subscription(this.currentState, newState)
            }
            this.currentState = newState
        }
    }

    private fun <R> subscribe(
        selector: Selector<State, R>,
        block: (R) -> Unit
    ) {
        this.subscriptions.add { state0, state1 ->
            val v0 = selector(state0)
            val v1 = selector(state1)
            if (v0 !== v1) block(v1)
        }
        block(selector(this.currentState))
    }
}
