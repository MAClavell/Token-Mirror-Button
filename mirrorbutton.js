// Global
const TKNMRB_MODULE_ID = "token-mirror-button";
const TKNMRB_MODULE_NAME = "Token Mirror Button";

let animationDuration = 0;


// Register keybinding
Hooks.on("init", function () {
    console.log(`Setting keybindings for "${TKNMRB_MODULE_NAME}"`);

	const FLIP_ACTION = 'flipToken'
	game.keybindings.register(TKNMRB_MODULE_ID, FLIP_ACTION, {
		name: game.i18n.localize("TKNMRB.KeybindingMirrorTokenName"),
		hint: game.i18n.localize("TKNMRB.KeybindingMirrorTokenHint"),
		editable: [],
		onDown: event => {
			MirrorButton.buttonEventHandler(event);
			return true;
		},
	});
});

// Initialize module
Hooks.once('ready', function () {
	const SETTING_NAME = "animation_speed";
    console.log(`Initializing "${TKNMRB_MODULE_NAME}"`);

    function parseSetting(value) {
		animationDuration = value;
    }

    game.settings.register(TKNMRB_MODULE_ID, SETTING_NAME, {
        name: game.i18n.localize("TKNMRB.SettingAnimateSpeed"),
        hint: game.i18n.localize("TKNMRB.SettingAnimateSpeedHint"),
        scope: "client",
        type: Number,
        default: 100,
        config: true,
        onChange: value => {
            parseSetting(value);
        }
    });

    parseSetting(game.settings.get(TKNMRB_MODULE_ID, SETTING_NAME));
});

class MirrorButton {
	/**
	 * Handles the click or contextmenu events for token mirror buttons
	 * 
	 * @param {Event} event - The triggering event.
	 */
	static async buttonEventHandler(event) {
		// Process each controlled token, as well as the reference token
        for(let t of canvas.tokens.controlled)
        {
        	await t.document.update({"texture.scaleX": t.document.texture.scaleX * -1}, {animate: animationDuration != 0, animation: {duration: animationDuration}});
		}
    }
    
	/**
	 * Create the HTML elements for the HUD button
	 * including the Font Awesome icon and tooltop.
	 * 
	 * @return {Element} The `<div>` element that is used as the HUD button.
	 */
	static createButton() {
		let button = document.createElement("div");

		button.classList.add("control-icon");
		button.innerHTML = `<i class="fab fa-flipboard fa-fw"></i>`
		button.title = game.i18n.localize("TKNMRB.TooltipText");
		return button;
    }
    
	/**
	 * Adds the button to the Token HUD,
	 * and attaches event listeners.
	 *
	 * @param {TokenHUD} hud - The HUD object, not used.
	 * @param {jQuery} html - The jQuery reference to the HUD HTML.
	 */
	static prepTokenHUD(hud, html) {
		const mirrorButton = this.createButton();

		$(mirrorButton)
			.click((event) =>
				this.buttonEventHandler(event)
			)
			.contextmenu((event) =>
				this.buttonEventHandler(event)
			);

		html.find("div.left").append(mirrorButton);
    }
}

Hooks.on("renderTokenHUD", (...args) => MirrorButton.prepTokenHUD(...args));