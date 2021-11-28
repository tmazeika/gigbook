package me.mazeika.gigbook

import javafx.application.Application
import javafx.scene.Scene
import javafx.stage.Stage
import me.mazeika.gigbook.state.GBState
import me.mazeika.gigbook.ui.ChartOfAccounts

class GigBook : Application() {
    override fun start(stage: Stage) {
        stage.title = "GigBook"
        stage.scene = Scene(
            ChartOfAccounts(GBState.createStore()), 1080.0, 720.0
        )
        stage.show()
    }
}
