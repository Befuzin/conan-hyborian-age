Removed the system’s reliance on global variables and cleaned up how configuration is handled.

- `SYSTEM` is now explicitly imported where needed instead of relying on `globalThis.SYSTEM`.
- The old global exposure has been replaced with a safer macro namespace: `globalThis.CONAN.SYSTEM`.
- This makes the system more stable, predictable, and future-proof.

Aligned more with Foundry v13+

Got rid of the remaining legacy (V1) Application usage.

- Replaced `Dialog` with `DialogV2`.
- Replaced the global `ImagePopout` with the namespaced v13 version.
- Result: no more deprecation warnings related to portrait display.


API Fixes

Fixed small but important v13 compatibility issues

- `ui.notifications.warning()` → `ui.notifications.warn()`  
(Multi-targeting now shows a proper warning instead of crashing)
- `actor._id` → `actor.id`
- Converted `isMinion()` into a getter so `actor.isMinion` behaves correctly.

Changes prevent runtime errors.


UI Stability

Fixed an issue where blank numeric inputs could produce `NaN`, causing browser warnings.

- Numeric parsing is now clamped.
- No more “value NaN cannot be parsed” warnings.


Cleaned sheet architecture

Refactored how sheets handle display only values.

- Stopped writing enriched HTML and derived values directly into `item.system`.
- These values now live in the sheet’s render context instead.
- Templates were updated to use `lookup` for enriched descriptions and derived strings.


Idea is to keep the DataModels clean and ensures the schema only contains real game data not UI 











<p style="margin-left: 10%; text-align:center;"><img src="https://github.com/Monolith-RPGs-FoundryVTT/conan-hyborian-age/blob/main/assets/system/system_title.webp" /></p>

<h1>The <em>Conan : the hyborian age</em> official system</h1>

<div align="center">

![Supported Foundry VTT versions](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fversion%3Fstyle%3Dflat%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2FMonolith-RPGs-FoundryVTT%2Fconan-hyborian-age%2Fmaster%2Fsystem.json)

![Latest Release](https://img.shields.io/github/v/release/Monolith-RPGs-FoundryVTT/conan-hyborian-age?label=Latest%20release)

</div>

<p>This is a game system to run games based upon the "<em>Conan : the hyborian age</em>" RPG system on the game platform Foundry Virtual Tabletop.</p>

<p style="margin-left: 10%;"> <img src="https://github.com/Monolith-RPGs-FoundryVTT/conan-hyborian-age/blob/main/assets/system/example1.webp" /></p>

<h2>Disclaimer</h2>
<p>"<em>Conan : the hyborian age</em>" is a role-playing game made by <strong>Monolith Board Games</strong>.</p>
<h2>Features</h2>
<ul>
<li>Character sheet for Characters and NPCs.</li>
<li>Weapon, Armor, spell, skill sheets and drag-and-drop to the character sheet.</li>
<li>Dice roll for standard checks and combat, flex die, damage.</li>
<li>Advanced rules option</li>
</ul>

<h2>Langages</h2>
<ul>
<li>English</li>
<li>Français</li>
</ul>

<h2>Contributors</h2>
<p>This system has been designed and coded by Khaali, and permitted by the editing company Monolith Board Games.</p>
<h2>Premium modules</h2>
<ul>
<li><strong>Conan : The Hyborean Age Corebook<strong> (english) contains the full Core rulebook, and compediums for monsters, NPCs, skills, spells, weapons...</li>
<li><strong>Conan : L'Âge Hyborien</strong> (français) contient le livre de règles, et les compendiums des monstres, PnJs, compétences, sorts, armes...</li>
</ul>
<h2>Community</h2>
<p>You can reach us on <a href="https://discord.gg/foundryvtt" target="_blank" rel="nofollow noopener">Foundry Virtual Tabletop discussions Discord server</a> or <a href="https://discord.gg/qEt5JcGs" target="_blank" rel="nofollow noopener">The fans of Monolith</a> &nbsp;Discord server<br />We'd love to hear your feedback on the system, bug reports, ideas for improvement, or just encouragement !</p>
<p>Rejoignez-nous sur le serveur <a href="https://discord.com/invite/pPSDNJk" target="_blank" rel="nofollow noopener">Discord francophone d&eacute;di&eacute; &agrave; Foundry Virtual Tabletop</a> ou <a href="https://discord.gg/bwDVzdxb" target="_blank" rel="nofollow noopener">le serveur Discord Monolith The Overlord</a><br />Nous serons ravis d'y avoir vos retours sur le syst&egrave;me, des signalements de bug, des id&eacute;es d'am&eacute;lioration, ou simplement des encouragements !</p>
</h2>Licences</h2>
<ul>
<li>CONAN, CONAN THE BARBARIAN, CONAN THE CIMMERIAN, HYBORIA, and related logos, characters, names, and distinctive likenesses there of trademarks or registered trademarks of Conan Properties International LLC. All Rights Reserved. Used with permission.</li>
<li>The Game System, all images and assets are Copyright © 2025 Monolith Board Games SARL.</li>
<li>All HTML, CSS and Javascript in this project is licensed under <a href="https://choosealicense.com/licenses/gpl-3.0/">GNU General Public License v3.0</a></li>
<li>Foundry VTT support is covered by the following license: <a href="https://foundryvtt.com/article/license/">Limited License Agreement for module development 17/02/2021</a>.</li>
</ul>
<p style="margin-left: 10%;"> <img src="https://github.com/Monolith-RPGs-FoundryVTT/conan-hyborian-age/blob/main/assets/system/monolith_logo_whitebck.webp" /></p>
