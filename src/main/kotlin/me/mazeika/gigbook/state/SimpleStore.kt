package me.mazeika.gigbook.state

import javafx.beans.property.SimpleObjectProperty
import javafx.beans.value.ObservableValue
import javafx.beans.value.WritableValue
import java.util.*

class SimpleStore<State>(
    private val initialState: State,
    private val reducers: List<Reducer<State>>
) : Store<State> {

    private val subscriptions: MutableSet<Subscription<State>> =
        Collections.newSetFromMap(WeakHashMap())

    private var currentState: State = this.initialState

    override fun dispatch(action: Action) {
        val newState =
            this.reducers.fold(this.currentState) { accState, reducer ->
                reducer(accState, action)
            }
        if (newState != this.currentState) {
            this.currentState = newState
            this.subscriptions.forEach { subscription ->
                subscription(newState)
            }
        }
    }

    override fun <R> observe(selector: Selector<State, R>): ObservableValue<R> =
        SimpleObjectProperty<R>().also { prop -> this.bind(prop, selector) }

    override fun <R> bind(
        prop: WritableValue<R>,
        selector: Selector<State, R>
    ) {
        this.subscribe { state -> prop.value = selector(state) }
    }

    private fun subscribe(subscription: Subscription<State>) {
        this.subscriptions.add(subscription)
        subscription(this.currentState)
    }
}
