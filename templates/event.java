package %package%;

import org.bukkit.event.Event;
import org.bukkit.event.HandlerList;

public class %name% extends Event {
    private static final HandlerList handlers = new HandlerList();

    @Override
    public HandlerList getHandlers() {
        return handlers;
    }
}
