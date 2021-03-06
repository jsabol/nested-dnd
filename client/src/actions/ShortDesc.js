const SHORT_DESCS = {
	"Ability Score Improvement": false,
	"Ability Score Increase": false,
	"Abjuration Savant": "Half gold/time to copy Abj. spells",
	"Action Surge": "Take another action on your turn",
	"Among the Dead":
		"Undead who directly attack you make a WIS save or target someone else. A succesful save or attacking the creature makes it immune to this for a day.",
	"Arcane Recovery": "(^lvl/2) spell slot levels on short rest",
	"Arcane Tradition": false,
	"Arcane Ward":
		"When you cast lvl 1+ Abjuration spell, gain (lvlx2) + (INT) temp  HP. Lasts until long rest",
	Archery: "+2 to ranged weapon attack",
	"Artificer’s Lore": false,
	Assassinate: false,
	Athlete:
		"Standing up costs 5 ft, climbing doesn't cost extra, running long jump or running high jump after only 5 ft.",
	"Bonus Proficiencies": false,
	"Bonus Proficiency": false,
	"Careful Spell": "(1) a creature you hit succeeds their save",
	"Channel Belief": "short rest restores",
	"Circle Forms": "Transform into CR 1 creature",
	"Circle of the Moon": false,
	"City Secrets":
		"Your party can travel in cities twice as fast while out of combat",
	"Colossus Slayer": "Weapons deal an extra 1d8 on creatures below full health",
	"Combat Wild Shape":
		"Wild Shape is a bonus action. Can use a bonus action to spend 1 spell slot to regain 1d8 HP per spell level.",
	"Criminal Contact":
		"trustworthy associate who can link you to a criminal network",
	"Cunning Action": "",
	"Danger Sense": false,
	Darkvision: "see 60 ft in darkness",
	"Deflect Missiles": false,
	"Destructive Wrath": "Channel Belief: maximum lighting or thunder damage",
	"Distant Spell": "(1) double the range of a spell",
	"Divine Domain": false,
	"Draconic Bloodline": false,
	"Draconic Resilience": false,
	"Dragon Ancestor": false,
	"Empowered Spell": "(1) reroll up to cha damage dice",
	"Evocation Savant": "gold and time to copy an evocation spell is halved",
	Expertise: false,
	"Extended Spell": "(1) double duration of spell up to 24hr",
	"Fast Hands": "see Cunning Action card",
	"Favored Enemy": "+2 damage against",
	"Fey Ancestry": false,
	"Flexible Casting": "sorcery points ↔ spell slots",
	"Flurry of Blows": false,
	"Font of Magic": "sorcery points ↔ spell slots",
	"Fury of the Small":
		"If attack larger creature, add your level to the damage. Regain after short rest",
	"Gnome Cunning": false,
	"Halfling Nimbleness": "move through larger creatures' space",
	"Healing Light": "d6",
	"Heightened Spell": "(3) target disadvantage on save",
	"Hunter Conclave": false,
	Ki: false,
	"Life Domain":
		"Healing spells of 1st level or higher regain 2 + the spell’s level additional HP",
	Lucky: "Reroll 1's",
	"Martial Archetype": false,
	"Martial Arts": false,
	"Martial Arts (d4)": " ",
	"Mask of the Wild": "You can hide in any natural phenomena (like rain)",
	Metamagic: false,
	"Military Rank":
		"Soldiers loyal to your military organization recognize your authority.",
	"Natural Explorer":
		"2x proficiency to INT and WIS checks in favored terrain. If travel 1 hr+ in favored terrain: difficult terrain doesn't slow, can't get lost except by magic, always alert to danger, forage x2, tracking gives number, size, how long ago, alone can stealth at normal pace",
	"Naturally Stealthy": "Hide when obscured by a larger creature",
	"Open Hand Technique": "see Flurry of Blows card",
	"Patient Defense": false,
	Portent:
		"After long rest, roll two d20s. ______  ______ You can replace any roll with these.",
	"Position of Privilege":
		"You are welcome in high society, and people assume you have the right to be wherever you are. Common folk make every effort to accommodate you.",
	Protection:
		"If weiding a shield: When an enemy attacks an ally within 5 ft of you, use your reaction to impose disadvantage.",
	"Quickened Spell": "(2) change action to bonus action",
	Rage: "+2 to damage",
	"Rage (Damage +2)": false,
	"Ranger’s Companion": "",
	"Reckless Attack":
		"Advantage on first attack roll (melee weapon using Strength), but attack rolls against you have advantage until your next turn.",
	"Relentless Endurance": "When reduced to 0 HP you can go to 1 HP instead",
	Researcher:
		"If you don't know a piece of lore, you often know where to obtain it",
	"Rustic Hospitality":
		"You can find a place to hide, rest, or recuperate among other commoners. They will shield you from the law or anyone else, though they will not risk their lives for you.",
	"Savage Attacks": "crit with melee weapon, roll damage dice 1 more time",
	"School of Abjuration": false,
	"Sculpt Spells":
		"Choose a number of creatures equal to 1 + the spell’s level that will succeed on their saves and take no damage",
	"Second Wind": "Regain after short/long rest.",
	"Second-Story Work":
		"Climb doesn't cost extra movement. Jump distance (DEX) ft.",
	"Sorcerous Origin": false,
	"Step of the Wind": false,
	"Subtle Spell": "(1) spell doesn't require V or S",
	Thief: false,
	"Tides of Chaos": "Reroll. Regain after a Wild Magic Surge.",
	Trance: "meditate 4 hrs instead of sleep",
	"Turn Undead": false,
	"Twinned Spell": "( lvl ) target 2nd creature in range.",
	"Two-Weapon Fighting":
		"add your ability modifier to the damage of the second attack",
	"Unarmored Defense": false,
	"Unarmored Movement": false,
	Wanderer:
		"Excellent memory for maps and geography. Find food, water for 6 people daily",
	"Way of the Open Hand": false,
	"Wild Magic": false,
	"Wild Magic Surge":
		"After a level 1+ spell, roll a d20. If you get a 1, a Surge happens.",
	"Wild Shape": "Regain after short/long rest. Lasts (lvl/2) hours.",
	"Wild Shape Forms": false,
	"Wrath of the Storm": "2d8"
};

const replace = {
	Orc: "Giant",
	Elf: "Veela",
	"Rock Gnome": "Pukwudgie",
	Gnome: "Pukwudgie",
	Gnomish: "Pukwudgie",
	Dwarvish: "Gobbledegook"
};

const CARD_DATA = {
	"Second Wind": {
		icon: "svg game-icons/delapouite/originals/healing",
		range: "Self",
		healing: {
			addModifier: true,
			diceString: "1d10"
		}
	},
	"Font of Magic": {
		name: "Flexible Casting",
		subtitle: "Sorcery Points",
		shortDesc:
			"Use sorcery points to gain spell slots, or sacrifice spell slots to gain sorcery points",
		uses: { count: 2 },
		icon: "svg game-icons/lorc/trade",
		description: [
			"You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. You can create spell slots no higher in level than 5th. You can expend one spell slot as a bonus action and gain a number of sorcery points equal to the slot&rsquo;s level.",
			"Any spell slot you create with this feature vanishes when you finish a long rest.",
			"<table style='width:100%'><thead><tr><th>Spell Slot Level&nbsp;&nbsp;</th><th>Sorcery Points</th></tr></thead><tbody><tr><td>1st</td><td>2</td></tr><tr><td>2nd</td><td>3</td></tr><tr><td>3rd</td><td>5</td></tr><tr><td>4th</td><td>6</td></tr><tr><td>5th</td><td>7</td></tr></tbody></table>"
		]
	},
	"Martial Arts (d4)": {
		name: "Martial Arts",
		icon: "svg game-icons/lorc/punch-blast",
		damage: {
			diceString: "1d4",
			attack: true,
			progression: true,
			addModifier: true
		},
		description: [
			"You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or a shield.",
			"• Can use Dex instead of Strength for Monk Weapons and Unarmed Strikes.",
			"• Can use 1d4 for Monk Weapons and Unarmed Strikes.",
			"• Can attack as a bonus action using an Unarmed Strike if you attacked with an Unarmed Strike or Monk Weapon.",
			"Monk Weapons are shortswords, and any simple melee weapon that isn't 2 handed or heavy.",
			"At Higher Levels: At level 5 the damage is 1d6, 1d8 at level 11, and 1d10 at level 17"
		]
	}
};

export default SHORT_DESCS;
export { replace, CARD_DATA };
