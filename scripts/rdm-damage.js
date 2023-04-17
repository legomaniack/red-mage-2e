async function percent_damage(value) {
    if (game.user.targets.size === 0){
        ui.notifications.warn("No tokens targeted!");
        return;
      }
      
      game.user.targets.forEach(i => {
        const actor = i.actor;
        const damage = Math.max(Math.floor(actor.hitPoints.value * value * 0.01), 1);
        actor.applyDamage({damage:damage, token: i.document});
      })
}

Hooks.on("ready", async function() {
    $(document).on('click', '.red-mage-percent-health', async function () {
        const value = $(this).data('amount');
        await percent_damage(value);
    });
});