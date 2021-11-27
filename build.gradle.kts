plugins {
    application
    kotlin("jvm") version "1.6.0"
    id("org.openjfx.javafxplugin") version "0.0.10"
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("me.mazeika.gigbook.GigBook")
}

javafx {
    version = "17"
    modules = listOf("javafx.controls")
}
