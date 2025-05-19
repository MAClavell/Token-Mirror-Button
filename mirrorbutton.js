'use strict';

// Global
const TMB_MODULE_ID = "token-mirror-button";
const TMB_MODULE_NAME = "Token Mirror Button";

let TMB_animationDuration = 0;

class MirrorButton {
	/**
	 * Mirror the token in a direction
	 */
	static async mirrorToken(vertical) {
		let property = vertical ? "texture.scaleY" : "texture.scaleX";

		// Process each controlled token, as well as the reference token
		for (let t of canvas.tokens.controlled) {
			// Don't mirror if there is an ongoing animation and the mirror is animated
			let animate = TMB_animationDuration != 0;
			if (!t.animationContexts.size || !animate) {
				let updates = {};
				updates[property] = foundry.utils.getProperty(t.document, property) * -1;
				await t.document.update(updates, { animate: animate, animation: { duration: TMB_animationDuration } });
			}
		}
	}

	/**
	 * Handles the button event for token mirroring
	 */
	static async mirrorTokenButtonHandler(event, target) {
		let veritcal = event.button == 2;
		await MirrorButton.mirrorToken(veritcal);
	}

	/**
	 * Create the HTML elements for the HUD button
	 * including the Font Awesome icon and tooltop.
	 * 
	 * @return {Element} The `<button>` element that is used as the HUD button.
	 */
	static createButton() {
		let button = document.createElement("button");
		button.setAttribute("type", "button");
		button.classList.add("control-icon");
		button.setAttribute("data-action", "TMB_mirror");
		button.setAttribute("data-tooltip", "TKNMRB.TooltipText");
		button.innerHTML = `<i class="fab fa-flipboard fa-fw"></i>`;
		return button;
    }
    
	/**
	 * Adds the button to the Token HUD,
	 * and attaches event listeners.
	 *
	 * @param {TokenHUD} hud - The HUD object.
	 * @param {HTMLFormElement} html - The HUD HTML.
	 */
	static prepTokenHUD(hud, html) {
		const mirrorButton = this.createButton();
		html.querySelector(".left").append(mirrorButton);
    }
}

Hooks.on("init", function () {
    console.log(`"${TMB_MODULE_NAME}" init`);

	// Register keybindings
    const TMB_MIRROR_HORIZONTAL_ACTION = 'mirrorTokenHorizontal';
	game.keybindings.register(TMB_MODULE_ID, TMB_MIRROR_HORIZONTAL_ACTION, {
		name: game.i18n.localize("TKNMRB.KeybindingMirrorTokenHorizontalName"),
		hint: game.i18n.localize("TKNMRB.KeybindingMirrorTokenHorizontalHint"),
		editable: [],
		onDown: event => {
			MirrorButton.mirrorToken(false);
			return true;
		},
	});
    const TMB_MIRROR_VERTICAL_ACTION = 'mirrorTokenVertical';
	game.keybindings.register(TMB_MODULE_ID, TMB_MIRROR_VERTICAL_ACTION, {
		name: game.i18n.localize("TKNMRB.KeybindingMirrorTokenVerticalName"),
		hint: game.i18n.localize("TKNMRB.KeybindingMirrorTokenVerticalHint"),
		editable: [],
		onDown: event => {
			MirrorButton.mirrorToken(true);
			return true;
		},
	});

	// Inject the callback into the TokenHUD ApplicationV2.
	// We use both left (0) and right (2) click
	CONFIG.Token.hudClass.DEFAULT_OPTIONS.actions.TMB_mirror = {handler: MirrorButton.mirrorTokenButtonHandler, buttons: [0, 2]};
});

Hooks.once('ready', function () {
    const TMB_ANIMATE_DURATION_SETTING_NAME = "animation_speed";
    console.log(`"${TMB_MODULE_NAME}" ready`);

    function parseSetting(value) {
		TMB_animationDuration = value;
    }

	// Register settings
    game.settings.register(TMB_MODULE_ID, TMB_ANIMATE_DURATION_SETTING_NAME, {
        name: game.i18n.localize("TKNMRB.SettingAnimateDuration"),
        hint: game.i18n.localize("TKNMRB.SettingAnimateDurationHint"),
        scope: "client",
        type: Number,
        default: 100,
        config: true,
        onChange: value => {
            parseSetting(value);
        }
    });

    parseSetting(game.settings.get(TMB_MODULE_ID, TMB_ANIMATE_DURATION_SETTING_NAME));

});

// Inject the mirror button when it is rendered
Hooks.on("renderTokenHUD", (...args) => MirrorButton.prepTokenHUD(...args));