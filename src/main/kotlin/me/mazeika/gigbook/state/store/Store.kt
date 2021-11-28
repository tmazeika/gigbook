package me.mazeika.gigbook.state.store

import javafx.beans.value.ObservableValue
import javafx.beans.value.WritableValue
import javafx.collections.ObservableList

typealias Selector<State, R> = (State) -> R
typealias Reducer<State, Action> = (State, Action) -> State

interface Store<State, Action> {
    fun <R> observe(selector: Selector<State, R>): ObservableValue<R>

    fun <R> observeList(selector: Selector<State, List<R>>): ObservableList<R>

    fun <R> bind(prop: WritableValue<R>, selector: Selector<State, R>)

    fun dispatch(action: Action)
}
