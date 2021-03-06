module.exports = {
	Alarm: {
		shortDesc: "Alerts you when a creature enters the area"
	},
	"Animal Messenger": {
		description: [
			"Choose a Tiny beast you can see within range. Specify a location you have visited, and a recipient who matches a general description. Speak a message of up to twenty-five words. The target beast travels for the duration of the spell towards the specified location, covering about 50 mi. per 24 hrs for a flying messenger or 25 mi. for other animals.",
			"When the messenger arrives, it delivers your message to the creature that you described, replicating the sound of your voice. The messenger speaks only to a creature matching the description you gave. If the messenger doesn't reach its destination before the spell ends, the message is lost, and the beast makes its way back to where you cast this spell.",
			"At Higher Levels: If you cast this spell using a spell slot of 3rd level or higher, the duration of the spell increases by 48 hours for each slot level above 2nd."
		],
		shortDesc: "Use a tiny beast to deliver a message"
	},
	Augury: {
		description: [
			"Recieve one of the following omens about a specific course of action that you plan to take within the next 30 mins.<ul><li>Weal: good results<li>Woe: bad results<li>Weal and woe: both good and bad results<li>Nothing: not especially good or bad</ul><p>The spell doesn't take into account any possible circumstances that might change the outcome.<p>If you cast the spell two or more times before completing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading."
		],
		shortDesc:
			"Cast gem-inlaid sticks, roll dragon bones, or lay out ornate cards to receive an omen"
	},
	Barkskin: {
		shortDesc: "Improved armor"
	},
	"Blade Ward": {
		cast_time: "1 action",
		classes: ["Ranger"],
		components: {
			types: "VS"
		},
		concentration: true,
		description: [
			"You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks."
		],
		duration: "1 round",
		level: 0,
		namegen: "Blade Ward",
		range: "Self",
		save: {},
		school: "Abjuration",
		shortDesc: "Ward yourself from physical damage"
	},
	Bless: {
		shortDesc: "Help creatures attack or save"
	},
	"Calm Emotions": {
		description: [
			"Attempt to suppress strong emotions in a group of people. Humanoids in a 20-foot-radius centered on a point you choose within range must make a Charisma saving throw a creature can choose to fail this saving throw if it wishes. If a creature fails, choose one of the following two effects.",
			"A) Suppress any effect causing a target to be charmed or frightened.",
			"B) Make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again"
		]
	},
	"Chromatic Orb": {
		cast_time: "1 action",
		components: {
			materials: "a diamond worth at least 50 gp",
			types: "VS"
		},
		description: [
			"You hurl a 4-inch-diameter sphere of energy at a creature that you can see within range. You choose acid, cold, fire, lightning, poison, or thunder for the type of orb you create, and then make a ranged spell attack against the target. If the attack hits, the creature takes 3d8 damage of the type you chose.",
			"At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st."
		],
		dice: {
			attack: "Ranged",
			roll: "3d8",
			type: "acid, cold, fire, lightning, poison, or thunder"
		},
		duration: "Instantaneous",
		level: 1,
		range: "90 ft",
		school: "Evocation"
	},
	"Cloud of Daggers": {
		cast_time: "1 action",
		classes: ["Bard", "Sorcerer", "Wizard", "Warlock"],
		components: {
			materials: "a sliver of glass",
			types: "VS"
		},
		concentration: true,
		description: [
			"You fill the air with spinning daggers in a cube 5 feet on each side, centered on a point you choose within range. A creature takes 4d4 slashing damage when it enters the spell’s area for the first time on a turn or starts its turn there.",
			"At Higher Levels: When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 2d4 for each slot level above 2nd."
		],
		dice: {
			roll: "4d4",
			type: "slashing"
		},
		duration: "Up to 1 minute",
		level: 2,
		range: "60 ft",
		school: "Conjuration"
	},
	"Create or Destroy Water": {
		description: [
			"You either create or destroy 10 gallons of clean water.",
			"At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water, or the size of the cube increases by 5 feet, for each slot level above 1st."
		],
		shortDesc: "Create or destroy water"
	},
	"Cunning Action": {
		cast_time: "1 bonus action",
		description: [
			"You can take a bonus action on each of your turns in combat, only to take the Dash, Disengage, or Hide action.",
			"With <strong>Fast Hands: </strong> You can take a Sleight of Hand action, use thieves' tools, or Use an Object"
		],
		icon: "dodging",
		isFeature: true
	},
	Darkvision: {
		description: [
			"You touch a willing creature to grant it the ability to see in the dark. For the duration, that creature has darkvision out to a range of 60 feet.",
			"The creature can see in dim light within 60 ft. as if it were bright light, and in darkness as if it were dim light. The creature can't discern color in darkness, only shades of gray. "
		],
		shortDesc: "See in the dark"
	},
	"Deflect Missiles": {
		cast_time: "1 reaction",
		description: [
			"Deflect or catch the missile when you are hit by a ranged weapon Attack. When you do so, the damage you take from the Attack is reduced by 1d 10 + your Dexterity modifier + your monk level.",
			"If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged Attack (range 20 feet/60 feet) with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this Attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the Attack."
		],
		dice: {
			add_modifier: true,
			attack: true,
			progression: true,
			roll: true
		},
		icon: "return-arrow",
		isFeature: true,
		level: 0,
		range: "20/60 ft",
		subtitle: "1 Ki Point to fire it back"
	},
	"Detect Evil and Good": {
		shortDesc:
			"Locate any aberration, celestial, elemental, fey, fiend, undead, or consecrated/desecrated objects"
	},
	"Detect Magic": {
		shortDesc: "See a faint aura around nearby magical objects and creatures"
	},
	"Detect Poison and Disease": {
		shortDesc: "Locate any posioned objects, poisonous creatures, or diseases"
	},
	"Detect Thoughts": {
		description: [
			"Until the spell ends, you can read the mind of one creature you can see within 30 ft. If it has an Intelligence of 3 or lower or doesn't speak any language, it is unaffected. Questions verbally directed at it shape its thoughts.",
			"You first learn surface thoughts. As an action, you can either shift your attention to another creature or probe deeper. If you probe deeper, they must make a WIS saving throw. If it fails, you gain insight into its reasoning, its emotional state, and something that looms large in its mind. If it succeeds, the spell ends. Either way, it knows that you are reading its mind, and unless you shift your attention to another creature, it can use its action to make an INT check contested by your INT check and if it succeeds, the spell ends.<p>You can detect creatures by searching for thoughts within 30 ft. The spell can penetrate barriers, but 2 ft of rock, 2 inches of metal, or a thin sheet of lead blocks you."
		]
	},
	"Disguise Self": {
		description: [
			"You make yourself, including all belongings on your person, look different until the spell ends or you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You must adopt a form that has the same basic arrangement of limbs.<p>The changes wrought by this spell fail to hold up to physical inspection. For example, if you add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing.<p>To discern that you are disguised, a creature can use its action to inspect your appearance and must succeed on an Intelligence (Investigation) check against your spell save DC."
		]
	},
	Druidcraft: {
		description: [
			"You create one of the following effects within range:",
			"• A tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. This effect persists for 1 round.",
			"• Instantly make a flower blossom, a seed pod open, or a leaf bud bloom.",
			"• Create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. The effect must fit in a 5-foot cube.",
			"• Instantly light or snuff out a candle, a torch, or a small campfire."
		],
		shortDesc:
			"Whisper to the spirits of nature and craft a natural or sensory effect"
	},
	"Enhance Ability": {
		description: [
			"Choose one - the creature you touch gains the effect until the spell ends.",
			"• Bear's Endurance: Adv. on CON checks. 2d6 temp HP, lost when the spell ends.",
			"• Bull's Strength: Adv. on STR checks, and carrying capacity doubles.",
			"• Cat's Grace: Adv. on DEX checks. Doesn't take damage from falling 20 ft or less if it isn't incapacitated.",
			"• Eagle's Splendor: Adv. on CHA checks.",
			"• Fox's Cunning: Adv. on INT checks.",
			"• Owl's Wisdom: Adv. on WIS checks.",
			"At Higher Levels: When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd."
		],
		shortDesc: "Bestow a magical enhanccement"
	},
	"Ensnaring Strike": {
		cast_time: "1 bonus action",
		classes: ["Ranger"],
		components: {
			types: "V"
		},
		concentration: true,
		description: [
			"The next time you hit a creature with a weapon attack before this spell ends, a writhing mass of thorny vines appears at the point of impact, and the target must succeed on a Strength saving throw or be restrained by the magical vines until the spell ends. A Large or larger creature has advantage on this saving throw. If the target succeeds on the save, the vines shrivel away.",
			"While restrained by this spell, the target takes 1d6 piercing damage at the start of each of its turns. A creature restrained by the vines or one that can touch the creature can use its action to make a Strength check against your spell save DC. On a success, the target is freed."
		],
		duration: "Concentration, up to 1 min",
		level: 1,
		namegen: "Ensnaring Strike",
		range: "Self",
		save: {
			success: "Not restrained",
			throw: "Strength"
		},
		school: "Conjuration"
	},
	"Expeditious Retreat": {
		shortDesc: "Move at an incredible pace"
	},
	"False Life": {
		shortDesc: "Bolster yourself with a necromantic facsimile of life"
	},
	"Feather Fall": {
		description: [
			"<strong>Reaction</strong> - When you or a creature within 60 ft of you falls <p>Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 ft per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its ft, and the spell ends for that creature."
		],
		shortDesc: "Slow down falling creatures"
	},
	"Find Familiar": {
		description: [
			"Gain the service of a celestial, fey, or fiend (your choice) that takes an animal form you choose.<p>It always obeys your commands. In combat, has its own turn but can't attack. When it drops to 0 HP, it disappears.<p>While it is within <strong>100 ft</strong> of you, you can communicate with it telepathically. You can see through it's eyes and hear what it hears until the start of your next turn.<p>As an action, you can temporarily dismiss it and make it reappear as an action.<p>You only have one at a time. Casting this spell causes it to adopt a new form.<p>It can deliver a spell with a range of Touch if it is within 100 ft of you."
		],
		shortDesc:
			"bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel"
	},
	"Find Traps": {
		shortDesc: "Sense the presence of any trap within 120 ft"
	},
	"Floating Disk": {
		shortDesc: "Circular platform 3 feet wide"
	},
	"Flurry of Blows": {
		cast_time: "1 bonus action",
		description: [
			"Immediately after you take the Attack action on Your Turn, you can spend 1 ki point to make two unarmed strikes as a Bonus Action.",
			"If you have <strong>Open Hand Technique</strong>, you can impose one of these effects",
			"• It must succeed on a Dexterity save or be knocked prone",
			"• It must succeed on a Strength save or be pushed up to 15 feet away from you.",
			"• It can't take reactions until the end of your next turn."
		],
		dice: {
			add_modifier: true,
			attack: true,
			progression: true,
			roll: true,
			type: "bludgeoning"
		},
		icon: "fulguro-punch",
		isFeature: true,
		level: 1,
		subtitle: "1 Ki Point"
	},
	"Fog Cloud": {
		shortDesc: "Create a 20ft wide sphere of fog"
	},
	"Gentle Repose": {
		shortDesc: "Prevent a corpse from decaying or becoming undead"
	},
	Goodberry: {
		shortDesc: "10 berries that restore 1 HP each"
	},
	Guidance: {
		shortDesc: "Improve a creature's ability check"
	},
	"Gust of Wind": {
		description: [
			"A line of strong wind 60 ft long and 10 ft wide blasts from you for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 ft away from you in a direction following the line.<p>Any creature in the line must spend 2 ft of movement for every 1 foot it moves when moving closer to you.<p>The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.<p>As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you."
		]
	},
	"Hail of Thorns": {
		cast_time: "1 bonus action",
		classes: ["Ranger"],
		components: {
			types: "V"
		},
		concentration: true,
		description: [
			"The next time you hit a creature with a ranged weapon attack before the spell ends, this spell creates a rain of thorns that sprouts from your ranged weapon or ammunition. In addition to the normal effect of the attack, the target of the attack and each creature within 5 feet of it must make a Dexterity saving throw. A creature takes 1d10 piercing damage on a failed save, or half as much damage on a successful one.",
			"At Higher Levels. If you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st (to a maximum of 6d10)."
		],
		duration: "Concentration, up to 1 min",
		level: 1,
		namegen: "Hail of Thorns",
		range: "Self",
		save: {
			save: "Half damage",
			throw: "Dexterity"
		},
		school: "Conjuration"
	},
	"Hunter's Mark": {
		shortDesc:
			"Mark a creature and add 1d6 damage when you hit it with a weapon"
	},
	Jump: {
		shortDesc: "Triple a creature's jump distance for 1 minute"
	},
	"Lesser Restoration": {
		shortDesc:
			"Cure a disease or a blinded, deafened, paralyzed, or poisoned condition"
	},
	Light: {
		shortDesc: "Touch an object and it sheds bright light"
	},
	"Locate Animals or Plants": {
		shortDesc: "Locate a beast or plant within 5 miles"
	},
	"Locate Object": {
		shortDesc: "Locate a familiar object within 1,000 feet"
	},
	Longstrider: {
		shortDesc: "Increase a creature's speed by 10 feet"
	},
	"Mage Armor": {
		shortDesc: "Change a creature's armor to 13 + Dexterity modifier"
	},
	"Mage Hand": {
		description: [
			"Appears at a point you choose within range. Lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 ft away from you or if you cast it again",
			"You can use your action to control it. You can move the hand up to 30 feet each time you use it.",
			"The hand can't attack, activate magical items, carry more than 10 pounds, or extert more than 10 pounds of force."
		],
		shortDesc: "Summon a spectral, floating hand"
	},
	"Martial Arts": {
		cast_time: "1 bonus action",
		description: [
			"You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or a shield.",
			"• Can use Dex instead of Strength for Monk Weapons and Unarmed Strikes.",
			"• Can use 1d4 for Monk Weapons and Unarmed Strikes.",
			"• Can attack as a bonus action using an Unarmed Strike if you attacked with an Unarmed Strike or Monk Weapon.",
			"Monk Weapons are shortswords, and any simple melee weapon that isn't 2 handed or heavy.",
			"At Higher Levels: At level 5 the damage is 1d6, 1d8 at level 11, and 1d10 at level 17"
		],
		dice: {
			add_modifier: true,
			attack: true,
			progression: true,
			roll: "1d4"
		},
		icon: "punch-blast",
		isFeature: true,
		level: 0
	},
	Mending: {
		shortDesc: "Repair an object you touch"
	},
	Message: {
		shortDesc: "Whisper a message at a distance"
	},
	"Minor Illusion": {
		description: [
			"You create a sound or an image of an object which lasts for the duration, or ends if you dismiss it as an action.",
			"If you create a sound, its volume can range from a whisper to a scream. If you create an image it must be no larger than a 5-ft cube. The image can't create sound, light, smell, or any other sensory effect.",
			"Physical things pass through the image and reveal it to be an illusion. A creature can also determine that it is an illusion with a successful Investigation check against your spell save DC. On success, the illusion becomes faint to the creature."
		],
		shortDesc: "Create a sound or an image of an object"
	},
	"Misty Step": {
		shortDesc:
			"Briefly surrounded by silvery mist, you teleport a short distance"
	},
	"Pass without Trace": {
		shortDesc: "A veil of shadows and silence."
	},
	"Patient Defense": {
		cast_time: "1 bonus action",
		description: [
			"You can spend 1 ki point to take the Dodge action as a Bonus Action on Your Turn."
		],
		icon: "dodging",
		isFeature: true,
		level: 1,
		shortDesc: "Dodge",
		subtitle: "1 Ki Point"
	},
	Prestidigitation: {
		description: [
			"Create one of these effects within range.<p>• Create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.<br>• Instantaneously light or snuff out a candle, a torch, or a small campfire.<br>• Instantaneously clean or soil an object no larger than 1 cubic foot.<br>• Chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.<br>• Make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.<br>• Create a nonmagical trinket or an illusory image that can fit in your hand and that lasts until the end of your next turn.<p>If you cast this spell multiple times, you can have up to 3 of its non-instantaneous effects active at a time, and you can dismiss an effect as an action."
		],
		shortDesc: "A minor magical trick that novice spellcasters use for practice"
	},
	"Primeval Awareness": {
		cast_time: "1 action",
		description: [
			"Through sounds and gestures, you can communicate simple ideas to a beast. You learn its emotional state, whether it is affected by  magic of any sort, its short-term needs (such as food or safety), and actions you can take (if any) to persuade it to not attack. You cannot  use this ability against a creature that you have attacked within the past  10 minutes. You can use this unlimited times on your animal companion if you have one.",
			"Alternatively, you can sense whether any of your favored enemies are present within 5 miles of you by spending 1 uninterrupted minute in concentration. This reveals which of your favored enemies are present, their numbers, and the creatures’ general direction and distance from you."
		],
		duration: "1 minute",
		icon: "beast-eye",
		isFeature: true,
		level: 1,
		shortDesc: "Establish a powerful link to beasts and to the land around you"
	},
	"Second Wind": {
		cast_time: "1 bonus action",
		description: [
			"On your turn, you can use a bonus action to regain 1d10 + your fighter level hit points.",
			"Once you use this feature, you must finish a short or long rest before you can use it again"
		],
		dice: {
			add_modifier: true,
			roll: "1d10",
			type: "Healing"
		},
		icon: "medical-pack",
		isFeature: true,
		range: "Self"
	},
	"Shield of Faith": {
		shortDesc: "A shimmering field of magical protection"
	},
	Sleep: {
		description: [
			"Creatures within 20 ft of a point you choose within range are affected.",
			"Roll 5d8. Starting with the creature that has the lowest current HP, each creature affected falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake the sleeper awake. Subtract each creature's HP from the total before moving onto the next lowest HP. HP must be equal to or less than the remainder to be affected.",
			"Undead and creatures immune to being charmed aren't affected by this spell.",
			"At Higher Levels: Roll an additional 2d8 for each slot level above 1st."
		],
		shortDesc: "Send creatures into a magical slumber"
	},
	"Spike Growth": {
		shortDesc: "The ground sprouts spikes and thorns"
	},
	"Step of the Wind": {
		cast_time: "1 bonus action",
		description: [
			"You can spend 1 ki point to take the Disengage or Dash action as a Bonus Action on Your Turn, and your jump distance is doubled for the turn."
		],
		icon: "sprint",
		isFeature: true,
		level: 1,
		shortDesc: "Disengage or Dash",
		subtitle: "1 Ki Point"
	},
	Suggestion: {
		description:
			"Suggest an activity (limited to a sentence or two) to a creature you can see within range that can hear and understand you. The suggestion must sound reasonable. Asking the creature to stab itself or do some other obviously harmful act ends the spell.<p>On a failed Wisdom save, it purses the course of action you described to the best of its ability. If the activity can be completed before the end of the duration, the spell ends when the activity finishes.<p>You can specify conditions that will trigger the activity. For example, you might suggest that a knight give her horse to the first beggar she meets. If the condition isn't met before the spell expires, the activity isn't performed.<p>If you or any of your companions damage the target, the spell ends."
	},
	"Tasha's Hideous Laughter": {
		cast_time: "1 action",
		classes: ["Wizard"],
		components: {
			materials: "tiny tarts and a feather that is waved in the air",
			types: "VS"
		},
		concentration: true,
		description: [
			"A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn’t affected.",
			"At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it’s triggered by damage. On a success, the spell ends."
		],
		duration: "Concentration, up to 1 min",
		level: 1,
		namegen: "Tasha's Hideous Laughter",
		range: "30 ft",
		school: "Enchantment"
	},
	Thaumaturgy: {
		description: [
			"Create one of these effects within range.<p>• Your voice booms up to three times as loud as normal for 1 minute.<br>• Cause flames to flicker, brighten, dim, or change color for 1 minute.<br>• Cause harmless tremors in the ground for 1 minute.<br>• Create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.<br>• Instantaneously cause an unlocked door or window to fly open or slam shut.<br>• Alter the appearance of your eyes for 1 minute.<p>If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action."
		],
		shortDesc: "Manifest a minor wonder, a sign of supernatural power"
	},
	"Thorn Whip": {
		cast_time: "1 action",
		components: {
			materials: "the stem of a plant with thorns",
			types: "VS"
		},
		description: [
			"You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you.",
			"This spell’s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6)."
		],
		dice: {
			attack: true,
			progression: "1d6",
			roll: "1d6",
			type: "piercing"
		},
		duration: "Instant",
		level: 0,
		range: "30 ft",
		school: "Transmutation"
	},
	"True Strike": {
		shortDesc: "Gain a temporary insight into the target's defenses"
	},
	"Unseen Servant": {
		description: [
			"The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 HP, and a Strength of 2, and it can't attack. If it drops to 0 HP, the spell ends.<p>Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 ft and interact with an object. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command.<p>If you command the servant to perform a task that would move it more than 60 ft away from you, the spell ends."
		],
		shortDesc:
			"An invisible, mindless, shapeless force that performs simple tasks at your command"
	},
	"Witch Bolt": {
		cast_time: "1 action",
		components: {
			materials: "a twig from a tree that has been struck by lightning",
			types: "VS"
		},
		concentration: true,
		description: [
			"A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you.",
			"At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st."
		],
		dice: {
			add_modifier: true,
			attack: true,
			progression: "1d12",
			roll: "1d12",
			type: "lightning"
		},
		duration: "Concentration, up to 1 min",
		level: 1,
		range: "30 ft",
		school: "Evocation"
	},
	"Wrath of the Storm": {
		cast_time: "1 reaction",
		description: [
			"When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one"
		],
		dice: {
			roll: "2d8",
			type: "lightning or thunder"
		},
		duration: "Instant",
		icon: "gi gi-lightning-storm",
		isFeature: true,
		level: 1,
		range: "5 ft",
		save: {
			success: "Half damage",
			throw: "Dexterity"
		}
	}
};
