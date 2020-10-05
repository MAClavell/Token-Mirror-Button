class MirrorButton {
	/**
	 * Handles the click or contextmenu events for token mirror buttons
	 * 
	 * @param {Event} event - The triggering event.
	 * @param {Token} tokenData - The file path of the image to display.
	 */
	static async buttonEventHandler(event, tokenData) {
        let token = canvas.tokens.get(tokenData._id);
        await token.update({"mirrorX": !token.data.mirrorX});
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
	 * @param {Token} token - The data for the Token.
	 */
	static prepTokenHUD(hud, html, token) {
		const mirrorButton = this.createButton();

		$(mirrorButton)
			.click((event) =>
				this.buttonEventHandler(event, token)
			)
			.contextmenu((event) =>
				this.buttonEventHandler(event, token)
			);

		html.find("div.left").append(mirrorButton);
    }
}

Hooks.on("renderTokenHUD", (...args) => MirrorButton.prepTokenHUD(...args));