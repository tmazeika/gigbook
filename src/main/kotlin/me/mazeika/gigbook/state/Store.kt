package me.mazeika.gigbook.state

import javafx.beans.value.ObservableValue
import javafx.beans.value.WritableValue

sealed interface Action {
    object Increment : Action
    object Decrement : Action
}

typealias Selector<State, R> = (State) -> R
typealias Reducer<State> = (State, Action) -> State
typealias Subscription<State> = (State) -> Unit

interface Store<State> {
    fun dispatch(action: Action)

    fun <R> observe(selector: Selector<State, R>): ObservableValue<R>

    fun <R> bind(prop: WritableValue<R>, selector: Selector<State, R>)
}

data class GigBookState(val counter: Int)

fun stateReducer(state: GigBookState, action: Action): GigBookState =
    when (action) {
        Action.Increment -> state.copy(counter = state.counter + 1)
        Action.Decrement -> state.copy(counter = state.counter - 1)
    }
