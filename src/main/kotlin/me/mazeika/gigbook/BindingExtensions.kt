package me.mazeika.gigbook

import javafx.collections.ListChangeListener
import javafx.collections.ObservableList
import javafx.collections.transformation.TransformationList

class MappedList<T, U>(
    source: ObservableList<out T>,
    private val transform: (T) -> U
) : TransformationList<U, T>(
    source
) {
    private val target: MutableList<U> =
        this.source.map(this.transform).toMutableList()

    override fun sourceChanged(c: ListChangeListener.Change<out T>) {
        this.beginChange()
        while (c.next()) {
            if (c.wasPermutated()) {
                val perm = IntArray(c.to - c.from) { i -> c.getPermutation(i) }
                c.from.until(c.to).forEach { i0 ->
                    val i1 = perm[i0]
                    // swap target[i0] and target[i1]
                    this.target[i0] = this.target[i1].also {
                        this.target[i1] = this.target[i0]
                    }
                }
                this.nextPermutation(c.from, c.to, perm)
            } else if (c.wasUpdated()) {
                c.from.until(c.to).forEach { i ->
                    this.target[i] = this.transform(this.source[i])
                    this.nextUpdate(i)
                }
            } else {
                (c.from + c.removedSize - 1).downTo(c.from).forEach { i ->
                    this.nextRemove(i, this.target[i])
                    this.target.removeAt(i)
                }
                c.from.until(c.to).forEach { i ->
                    this.target.add(i, this.transform(this.source[i]))
                }
                this.nextAdd(c.from, c.to)
            }
        }
        this.endChange()
    }

    override fun getSourceIndex(index: Int): Int = index

    override fun getViewIndex(index: Int): Int = index

    override fun get(index: Int): U = this.target[index]

    override val size: Int
        get() = this.target.size
}
