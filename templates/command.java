package %package%;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

public class %clazz% implements CommandExecutor {
    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
        // If the player (or console) uses the command correctly, we can return true.
        // Returning false will imply that the command is invalid and will display the usage to the player.
        return true;
    }
}
