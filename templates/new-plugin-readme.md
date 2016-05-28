# %name%

%description%

## Installation

You just have to import this folder into IntelliJ as a Maven project.

On the Maven options, you can check `Import Maven projects automatically` as a
convenience.

This will open your new plugin and load Spigot and Bukkit from the `pom.xml` file
at the version you choose when creating the plugin (%spigot_version%).

That's it! You can now start coding!

## Build the jar

To build you plugin open the [Maven projects](https://www.jetbrains.com/help/idea/2016.1/maven-projects-tool-window.html)
menu and click on the `Run Maven Build` button (the green play).

This will generate a jar file in `target/`.

## Plugin.yml

The file is located at `src/main/resources/plugin.yml`.

Most of it is filled in automatically when building the Maven project.
