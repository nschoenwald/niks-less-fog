// Import JavaScript modules
import { loadSettings, registerSettings, settings } from './module/settings.js';
import { log, MODULE_ID } from './module/lib.js';
import { applyFogOpacity } from './module/fog.js';

CONFIG.NIKS_LESS_FOG = { addTokenVisionButton: true };

/**
 * Is the GM Vision button available and switched on for the current user?
 * @returns {boolean}
 */
function gmVisionActive() {
    return CONFIG.NIKS_LESS_FOG.addTokenVisionButton && settings.gmVisionButton && game.user.isGM && settings.showAllToGM;
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', function () {
    log('Initializing');

    // Register custom module settings
    registerSettings();

    // Registered inside init so that it runs after any dependency's own scene control handlers
    Hooks.on('getSceneControlButtons', controls => {
        if (!CONFIG.NIKS_LESS_FOG.addTokenVisionButton || !settings.gmVisionButton || !game.user.isGM) return;
        const tools = controls.tokens?.tools;
        if (!tools) return;
        tools.lessfogGMVision = {
            name: "lessfogGMVision",
            order: Object.keys(tools).length,
            title: "Toggle GM Vision",
            icon: "fa-regular fa-eye-slash",
            toggle: true,
            active: settings.showAllToGM,
            onChange: (event, toggled) => game.settings.set(MODULE_ID, "showAllToGM", toggled)
        };
    });
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    log('Setup');

    loadSettings();

    // PF2E game system provides token vision button
    if (game.system.id === "pf2e") CONFIG.NIKS_LESS_FOG.addTokenVisionButton = false;

    // Disable token vision if the GM has toggled GM Vision on
    libWrapper.register(MODULE_ID, 'foundry.canvas.groups.CanvasVisibility.prototype.tokenVision', function (wrapped, ...args) {
        const result = wrapped(...args);
        return gmVisionActive() ? false : result;
    }, libWrapper.MIXED, { perf_mode: libWrapper.PERF_FAST });

    // Allow the GM (or all players) to see all tokens
    libWrapper.register(MODULE_ID, 'foundry.canvas.placeables.Token.prototype.isVisible', function (wrapped, ...args) {
        const result = wrapped(...args);
        if (result || !settings.reveal_tokens || !(game.user.isGM || settings.affect_all)) return result;
        // Keep core rules for config previews, filtered tokens, hidden tokens and tokens on other levels
        if (this._preview?._previewType === "config" || this.isFilteredOut) return false;
        if (this.document.hidden && !game.user.isGM) return false;
        return !this._testCulled();
    }, libWrapper.MIXED, { perf_mode: libWrapper.PERF_FAST });
});

/* ------------------------------------ */
/* Additional Hooks                     */
/* ------------------------------------ */

Hooks.on("drawCanvasVisibility", layer => applyFogOpacity(layer));
