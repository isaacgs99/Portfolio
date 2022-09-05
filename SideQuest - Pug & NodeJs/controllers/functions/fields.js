const PdfEdit = require('./pdfEdit');

// Have to manually create this.
// Field names can be found using `logAcroFieldNames(pdfDoc)`

// CharacterSheet field names
exports.sheetFieldNames = {
    header: {
        name: 'CharacterName',
        classAndLevel: 'ClassLevel',
        background: 'Background',
        playerName: 'PlayerName',
        race: 'Race ',
        alignment: 'Alignment',
        xp: 'XP'
    },
    attributes: {
        strengthMod: 'STR',
        strength: 'STRmod',
        dexterityMod: 'DEX',
        dexterity: 'DEXmod ',
        constitutionMod: 'CON',
        constitution: 'CONmod',
        intelligenceMod: 'INT',
        intelligence: 'INTmod',
        wisdomMod: 'WIS',
        wisdom: 'WISmod',
        charismaMod: 'CHA',
        charisma: 'CHamod'
    },
    physicalAttributes: {
        armorClass: 'AC',
        initiative: 'Initiative',
        speed: 'Speed',
        maxHitPoints: 'HPMax',
        currentHitPoints: 'HPCurrent',
        tempHitPoints: 'HPTemp',
        totalHitDie: 'HDTotal',
        hitDie: 'HD',
        savingThrows: {
            success: {
                first: 'Check Box 12',
                second: 'Check Box 13',
                third: 'Check Box 14'
            },
            failure: {
                first: 'Check Box 15',
                second: 'Check Box 16',
                third: 'Check Box 17'
            }
        }
    },
    savingThrows: {
        strength: 'ST Strength',
        strengthRadio: 'Check Box 11',
        dexterity: 'ST Dexterity',
        dexterityRadio: 'Check Box 18',
        constitution: 'ST Constitution',
        constitutionRadio: 'Check Box 19',
        intelligence: 'ST Intelligence',
        intelligenceRadio: 'Check Box 20',
        wisdom: 'ST Wisdom',
        wisdomRadio: 'Check Box 21',
        charisma: 'ST Charisma',
        charismaRadio: 'Check Box 22'
    },
    skills: {
        acrobatics: 'Acrobatics',
        acrobaticsRadio: 'Check Box 23',
        animal_handling: 'Animal',
        animal_handlingRadio: 'Check Box 24',
        arcana: 'Arcana',
        arcanaRadio: 'Check Box 25',
        athletics: 'Athletics',
        athleticsRadio: 'Check Box 26',
        deception: 'Deception ',
        deceptionRadio: 'Check Box 27',
        history: 'History ',
        historyRadio: 'Check Box 28',
        insight: 'Insight',
        insightRadio: 'Check Box 29',
        intimidation: 'Intimidation',
        intimidationRadio: 'Check Box 30',
        investigation: 'Investigation ',
        investigationRadio: 'Check Box 31',
        medicine: 'Medicine',
        medicineRadio: 'Check Box 32',
        nature: 'Nature',
        natureRadio: 'Check Box 33',
        perception: 'Perception ',
        perceptionRadio: 'Check Box 34',
        performance: 'Performance',
        performanceRadio: 'Check Box 35',
        persuasion: 'Persuasion',
        persuasionRadio: 'Check Box 36',
        religion: 'Religion',
        religionRadio: 'Check Box 37',
        sleight_of_hand: 'SleightofHand',
        sleight_of_handRadio: 'Check Box 38',
        stealth: 'Stealth ',
        stealthRadio: 'Check Box 39',
        survival: 'Survival',
        survivalRadio: 'Check Box 40'
    },
    personality: {
        personalityTraits: 'PersonalityTraits ',
        ideals: 'Ideals',
        bonds: 'Bonds',
        flaws: 'Flaws'
    },
    attacksAndSpellcasting: {
        firstWeapon: {
            name: 'Wpn Name',
            attackBonus: 'Wpn1 AtkBonus',
            damage: 'Wpn1 Damage'
        },
        secondWeapon: {
            name: 'Wpn Name 2',
            attackBonus: 'Wpn2 AtkBonus ',
            damage: 'Wpn2 Damage '
        },
        thirdWeapon: {
            name: 'Wpn Name 3',
            attackBonus: 'Wpn3 AtkBonus  ',
            damage: 'Wpn3 Damage '
        },
        notes: 'AttacksSpellcasting'
    },
    equipment: {
        copperPieces: 'CP',
        silverPieces: 'SP',
        electrumPieces: 'EP',
        goldPieces: 'GP',
        platinumPieces: 'PP',
        equipment: 'Equipment'
    },
    inspiration: 'Inspiration',
    proficiencyBonus: 'ProfBonus',
    passivePerception: 'Passive',
    featuresAndTraits: 'Features and Traits',
    proficienciesAndLanguages: 'ProficienciesLang'
};

// CharacterDetails field names
exports.detailFieldNames = {
    name: 'CharacterName 2',
    age: 'Age',
    height: 'Height',
    weight: 'Weight',
    eyes: 'Eyes',
    skin: 'Skin',
    hair: 'Hair',
    factionSymbolImage: 'Faction Symbol Image',
    allies: 'Allies',
    factionName: 'FactionName',
    backstory: 'Backstory',
    featuresAndTraits: 'Feat+Traits',
    treasure: 'Treasure',
    characterImage: 'CHARACTER IMAGE',
};

exports.spellFieldNames = {
    spellcastingClass: 'Spellcasting Class 2',
    spellcastingAbility: 'SpellcastingAbility 2',
    spellSaveDC: 'SpellSaveDC  2',
    spellAttackBonus: 'SpellAtkBonus 2',
    cantrips: {
        line0: 'Spells 1014',
        line1: 'Spells 1016',
        line2: 'Spells 1017',
        line3: 'Spells 1018',
        line4: 'Spells 1019',
        line5: 'Spells 1020',
        line6: 'Spells 1021',
        line7: 'Spells 1022'
    },
    level1: {
        spellSlots: 'SlotsTotal 19',
        expended: 'SlotsRemaining 19',
        line0: 'Spells 1015',
        line1: 'Spells 1023',
        line2: 'Spells 1024',
        line3: 'Spells 1025',
        line4: 'Spells 1026',
        line5: 'Spells 1027',
        line6: 'Spells 1028',
        line7: 'Spells 1029',
        line8: 'Spells 1030',
        line9: 'Spells 1031',
        line10: 'Spells 1032',
        line11: 'Spells 1033',
    },
    level2: {
        spellSlots: 'SlotsTotal 20',
        expended: 'SlotsRemaining 20',
        line0: 'Spells 1046',
        line1: 'Spells 1034',
        line2: 'Spells 1035',
        line3: 'Spells 1036',
        line4: 'Spells 1037',
        line5: 'Spells 1038',
        line6: 'Spells 1039',
        line7: 'Spells 1040',
        line8: 'Spells 1041',
        line9: 'Spells 1042',
        line10: 'Spells 1043',
        line11: 'Spells 1044',
        line12: 'Spells 1045',
    },
    level3: {
        spellSlots: 'SlotsTotal 21',
        expended: 'SlotsRemaining 21',
        line0: 'Spells 1048',
        line1: 'Spells 1047',
        line2: 'Spells 1049',
        line3: 'Spells 1050',
        line4: 'Spells 1051',
        line5: 'Spells 1052',
        line6: 'Spells 1053',
        line7: 'Spells 1054',
        line8: 'Spells 1055',
        line9: 'Spells 1056',
        line10: 'Spells 1057',
        line11: 'Spells 1058',
        line12: 'Spells 1059',
    },
    level4: {
        spellSlots: 'SlotsTotal 22',
        expended: 'SlotsRemaining 22',
        line0: 'Spells 1061',
        line1: 'Spells 1060',
        line2: 'Spells 1062',
        line3: 'Spells 1063',
        line4: 'Spells 1064',
        line5: 'Spells 1065',
        line6: 'Spells 1066',
        line7: 'Spells 1067',
        line8: 'Spells 1068',
        line9: 'Spells 1069',
        line10: 'Spells 1070',
        line11: 'Spells 1071',
        line12: 'Spells 1072',
    },
    level5: {
        spellSlots: 'SlotsTotal 23',
        expended: 'SlotsRemaining 23',
        line0: 'Spells 1074',
        line1: 'Spells 1073',
        line2: 'Spells 1075',
        line3: 'Spells 1076',
        line4: 'Spells 1077',
        line5: 'Spells 1078',
        line6: 'Spells 1079',
        line7: 'Spells 1080',
        line8: 'Spells 1081',
    },
    level6: {
        spellSlots: 'SlotsTotal 24',
        expended: 'SlotsRemaining 24',
        line0: 'Spells 1083',
        line1: 'Spells 1082',
        line2: 'Spells 1084',
        line3: 'Spells 1085',
        line4: 'Spells 1086',
        line5: 'Spells 1087',
        line6: 'Spells 1088',
        line7: 'Spells 1089',
        line8: 'Spells 1090',
    },
    level7: {
        spellSlots: 'SlotsTotal 25',
        expended: 'SlotsRemaining 25',
        line0: 'Spells 1092',
        line1: 'Spells 1091',
        line2: 'Spells 1093',
        line3: 'Spells 1094',
        line4: 'Spells 1095',
        line5: 'Spells 1096',
        line6: 'Spells 1097',
        line7: 'Spells 1098',
        line8: 'Spells 1099',
    },
    level8: {
        spellSlots: 'SlotsTotal 26',
        expended: 'SlotsRemaining 26',
        line0: 'Spells 10101',
        line1: 'Spells 10100',
        line2: 'Spells 10102',
        line3: 'Spells 10103',
        line4: 'Spells 10104',
        line5: 'Spells 10105',
        line6: 'Spells 10106',
    },
    level9: {
        spellSlots: 'SlotsTotal 27',
        expended: 'SlotsRemaining 27',
        line0: 'Spells 10108',
        line1: 'Spells 10107',
        line2: 'Spells 10109',
        line3: 'Spells 101010',
        line4: 'Spells 101011',
        line5: 'Spells 101012',
        line6: 'Spells 101013',
    }
};

/***************************************************/
/************* Fill Sheet Functions ****************/
/***************************************************/

// Fills in CharacterDetails PDF fields
exports.detailsFillFields = (pdfDoc, fieldNames, hero, font) => {
    // Basic Info/Header
    PdfEdit.fillInField(pdfDoc, fieldNames.age, `${hero.description.physical.age}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.name, hero.name, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.height, `${hero.description.physical.height || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.weight, `${hero.description.physical.weight} lbs`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.eyes, `${hero.description.physical.eye_color || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.skin, `${hero.description.physical.skin_color || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.hair, `${hero.description.physical.hair_color || ''}`, font);
    
    // Backstory
    PdfEdit.fillInField(pdfDoc, fieldNames.backstory, `${hero.description.notes.backstory || ''}`, font, { multiline: true });
    
    // Features and Traits
    PdfEdit.fillInField(pdfDoc, fieldNames.featuresAndTraits, `${hero.additional_info.additional_features_traits || ''}`, font, { multiline: true });
    
    // Allies and Organizations
    PdfEdit.fillInField(pdfDoc, fieldNames.allies, `${hero.description.notes.organization.text+'\nAllies:\n'+hero.description.notes.allies || ''}`, font, { multiline: true });
    
    // Emblem Name
    PdfEdit.fillInField(pdfDoc, fieldNames.factionName, `${hero.description.notes.organization.name || ''}`, font);

    // Treasure
    PdfEdit.fillInField(pdfDoc, fieldNames.treasure, `${hero.equipment.treasure || ''}`, font, { multiline: true });

    // PdfEdit.logAcroFieldNames(pdfDoc);
};

// Fills in CharacterSheet PDF fields
exports.sheetFillFields = (pdfDoc, fieldNames, hero, user, font) => {
    // Basic Info/Header
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.header.name, hero.name, font);
    if(hero.class) PdfEdit.fillInField(pdfDoc, fieldNames.header.classAndLevel, `${hero.class.name || '???'}, ${hero.level}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.header.background, `${hero.description.background || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.header.playerName, user.username, font);
    if(hero.race) PdfEdit.fillInField(pdfDoc, fieldNames.header.race, `${hero.race.name || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.header.alignment, `${hero.description.alignment || ''}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.header.xp, 'N/A', font);

    // Floating Stats
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.inspiration, `${hero.abilities.inspiration ? 'Y': ''}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.proficiencyBonus, `${hero.abilities.proficiency_bonus > 0 ? '+' + hero.abilities.proficiency_bonus : hero.abilities.proficiency_bonus}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.passivePerception, `${hero.abilities.passive_perception}`, font);

    // Attributes
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.strength, `${hero.abilities.strength.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.strengthMod, `${hero.abilities.strength.modifier > 0 ? '+' + hero.abilities.strength.modifier : hero.abilities.strength.modifier}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.dexterity, `${hero.abilities.dexterity.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.dexterityMod, `${hero.abilities.dexterity.modifier > 0 ? '+' + hero.abilities.dexterity.modifier : hero.abilities.dexterity.modifier}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.constitution, `${hero.abilities.constitution.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.constitutionMod, `${hero.abilities.constitution.modifier > 0 ? '+' + hero.abilities.constitution.modifier : hero.abilities.constitution.modifier}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.intelligence, `${hero.abilities.intelligence.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.intelligenceMod, `${hero.abilities.intelligence.modifier > 0 ? '+' + hero.abilities.intelligence.modifier : hero.abilities.intelligence.modifier}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.wisdom, `${hero.abilities.wisdom.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.wisdomMod, `${hero.abilities.wisdom.modifier > 0 ? '+' + hero.abilities.wisdom.modifier : hero.abilities.wisdom.modifier}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.charisma, `${hero.abilities.charisma.total_score}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.attributes.charismaMod, `${hero.abilities.charisma.modifier > 0 ? '+' + hero.abilities.charisma.modifier : hero.abilities.charisma.modifier}`, font);

    // Physical Attributes
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.armorClass, `${hero.physical_attributes.ac || ''}`, font);
    if(hero.physical_attributes.initiative) PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.initiative, `${hero.physical_attributes.initiative > 0 ? '+' + hero.physical_attributes.initiative : hero.physical_attributes.initiative}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.speed, `${hero.physical_attributes.speed || ''}`, font);
    
    if(hero.class) {
        const startHPNum = parseInt(hero.class.hitpoints_start.substring(0, 1));
        const maxHPString = hero.class.hitpoints_higherlvls.split(')')[0];
        const classHPNum = parseInt(maxHPString.substring(maxHPString.length-1));
        let finalMaxHPString = '';
        (hero.level == 1)
            ? finalMaxHPString = startHPNum + hero.abilities.constitution.modifier
            : finalMaxHPString = (hero.level-1) * (classHPNum + hero.abilities.constitution.modifier) + startHPNum + hero.abilities.constitution.modifier;
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.maxHitPoints, `${finalMaxHPString}`, font);
    
        // PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.currentHitPoints, `${hero.physical_attributes.current_hp}`, font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.currentHitPoints, `${finalMaxHPString}`, font);
        // PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.tempHitPoints, `${hero.physical_attributes.temp_hp}`, font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.tempHitPoints, '', font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.totalHitDie, `${hero.level}${hero.class.hit_die}`, font);
        // PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.hitDie, `${hero.physical_attributes.current_hitdie}`, font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.physicalAttributes.hitDie, `${hero.level}${hero.class.hit_die}`, font);
    }
    
    // Death Saving Throws
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.first, 'No');
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.second, 'No');
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.third, 'No');
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.first, 'No');
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.second, 'No');
    PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.third, 'No');
    switch(hero.physical_attributes.deathsaves_success) {
        case 3:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.third, 'Yes');
        case 2:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.second, 'Yes');
        case 1:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.success.first, 'Yes');
            break;
        default:
            break;
    }

    switch(hero.physical_attributes.deathsaves_fail) {
        case 3:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.third, 'Yes');
        case 2:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.second, 'Yes');
        case 1:
            PdfEdit.fillInRadio(pdfDoc, fieldNames.physicalAttributes.savingThrows.failure.first, 'Yes');
            break;
        default:
            break;
    }

    // Saving Throws
    const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    for(const ability of abilityNames) {
        if(hero.saving_throws[ability]) {
            const stMod = hero.abilities[ability].modifier + hero.abilities.proficiency_bonus;
            PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.savingThrows[ability], `${stMod > 0 ? '+' + stMod : stMod}`, font);
            PdfEdit.fillInRadio(pdfDoc, fieldNames.savingThrows[`${ability}Radio`], 'Yes');
        } else {
            const stMod = hero.abilities[ability].modifier;
            PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.savingThrows[ability], `${stMod > 0 ? '+' + stMod : stMod}`, font);
            PdfEdit.fillInRadio(pdfDoc, fieldNames.savingThrows[`${ability}Radio`], 'No');
        }
    }

    // Skills
    const skillNames = ['acrobatics', 'animal_handling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleight_of_hand', 'stealth', 'survival'];
    const abilityMods= [hero.abilities.strength.modifier, hero.abilities.dexterity.modifier, hero.abilities.constitution.modifier, hero.abilities.intelligence.modifier, hero.abilities.wisdom.modifier, hero.abilities.charisma.modifier];
    const skillDict = {'acrobatics': abilityMods[1], 'animal_handling': abilityMods[4], 'arcana': abilityMods[3], 'athletics': abilityMods[0], 'deception': abilityMods[5], 'history': abilityMods[3], 'insight': abilityMods[4], 'intimidation': abilityMods[5], 'investigation': abilityMods[3], 'medicine': abilityMods[4], 'nature': abilityMods[3], 'perception': abilityMods[4], 'performance': abilityMods[5], 'persuasion': abilityMods[5], 'religion': abilityMods[3], 'sleight_of_hand': abilityMods[1], 'stealth': abilityMods[1], 'survival': abilityMods[4]};
    for(const skill of skillNames) {
        if(hero.skills[skill]) {
            const skMod = skillDict[skill] + hero.abilities.proficiency_bonus;
            PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.skills[skill], `${skMod > 0 ? '+' + skMod : skMod}`, font);
            PdfEdit.fillInRadio(pdfDoc, fieldNames.skills[`${skill}Radio`], 'Yes');
        } else {
            const skMod = skillDict[skill];
            PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.skills[skill], `${skMod > 0 ? '+' + skMod : skMod}`, font);
            PdfEdit.fillInRadio(pdfDoc, fieldNames.skills[`${skill}Radio`], 'No');
        }
    }

    // Personality
    PdfEdit.fillInField(pdfDoc, fieldNames.personality.personalityTraits, `${hero.description.personality.traits || ''}`, font, { multiline: true });
    PdfEdit.fillInField(pdfDoc, fieldNames.personality.ideals, `${hero.description.personality.ideals || ''}`, font, { multiline: true });
    PdfEdit.fillInField(pdfDoc, fieldNames.personality.bonds, `${hero.description.personality.bonds || ''}`, font, { multiline: true });
    PdfEdit.fillInField(pdfDoc, fieldNames.personality.flaws, `${hero.description.personality.flaws || ''}`, font, { multiline: true });

    // Attacks and Spellcasting
    switch(hero.equipment.weapons.list.length) {
        case 3:
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.thirdWeapon.name, hero.equipment.weapons.list[2].name, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.thirdWeapon.attackBonus, `${hero.equipment.weapons.list[2].attackBonus > 0 ? '+' + hero.equipment.weapons.list[2].attackBonus : hero.equipment.weapons.list[2].attackBonus}`, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.thirdWeapon.damage, hero.equipment.weapons.list[2].damage, font);
        case 2:
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.secondWeapon.name, hero.equipment.weapons.list[1].name, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.secondWeapon.attackBonus, `${hero.equipment.weapons.list[1].attackBonus > 0 ? '+' + hero.equipment.weapons.list[1].attackBonus : hero.equipment.weapons.list[1].attackBonus}`, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.secondWeapon.damage, hero.equipment.weapons.list[1].damage, font);
        case 1:
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.firstWeapon.name, hero.equipment.weapons.list[0].name, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.firstWeapon.attackBonus, `${hero.equipment.weapons.list[0].attackBonus > 0 ? '+' + hero.equipment.weapons.list[0].attackBonus : hero.equipment.weapons.list[0].attackBonus}`, font);
            PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.firstWeapon.damage, hero.equipment.weapons.list[0].damage, font);
            break;
        default:
            break;
    }
    PdfEdit.fillInField(pdfDoc, fieldNames.attacksAndSpellcasting.notes, `${hero.equipment.weapons.notes || ''}`, font, { multiline: true });
    
    // Equipment
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.equipment.copperPieces, `${hero.equipment.money.copper || 0}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.equipment.silverPieces, `${hero.equipment.money.silver || 0}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.equipment.electrumPieces, `${hero.equipment.money.electrum || 0}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.equipment.goldPieces, `${hero.equipment.money.gold || 0}`, font);
    PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.equipment.platinumPieces, `${hero.equipment.money.platinum || 0}`, font);
    PdfEdit.fillInField(pdfDoc, fieldNames.equipment.equipment, `${hero.equipment.starting || ''}`, font, { multiline: true });

    // Features and Traits
    PdfEdit.fillInField(pdfDoc, fieldNames.featuresAndTraits, `${hero.additional_info.features_and_traits || ''}`, font, { multiline: true });
    
    // Proficiencies and Languages
    PdfEdit.fillInField(pdfDoc, fieldNames.proficienciesAndLanguages, `${hero.additional_info.proficiencies_and_languages|| ''}`, font, { multiline: true });

    // PdfEdit.logAcroFieldNames(pdfDoc);
};

const fillLevel = (pdfDoc, font, heroSpells, fieldNames, level) => {
    let spells = Object.values(fieldNames);
    let hSpells = heroSpells[level];
    if(level != 0){
        spells.shift();
        spells.shift();
    }
    if(hSpells.length != 0) {
        for(let i = 0; i < spells.length; i++) {
            (hSpells[i] != '' && hSpells[i] != undefined)
                ? PdfEdit.fillInField(pdfDoc, spells[i], `${hSpells[i].name || ''}`, font)
                : PdfEdit.fillInField(pdfDoc, spells[i], '', font);
        }
    } else {
        for(const value of spells) {
            PdfEdit.fillInField(pdfDoc, value, '', font);
        }
    }
};

exports.spellFillFields = (pdfDoc, fieldNames, hero, heroSpells, font) => {
    // PdfEdit.fillInField(pdfDoc, fieldNames.test0, '0', font);

    // Spell Casting Info/Header
    if(hero.class) {
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.spellcastingClass, `${hero.class.name || ''}`, font);
        let scAbility = '', ssDC = '', saBonus = '';
        if(hero.class.name != '' && hero.class.name != undefined){
            switch(hero.class.name.toLowerCase()){
                case 'sorcerer':
                case 'paladin':
                case 'warlock':
                    scAbility = 'Charisma';
                    ssDC = '' + (8 + hero.abilities.proficiency_bonus + hero.abilities.charisma.modifier);
                    saBonus = '+' + (hero.abilities.proficiency_bonus + hero.abilities.charisma.modifier);
                    break;
                case 'monk':
                    scAbility = 'Ki';
                    ssDC = '' + (8 + hero.abilities.proficiency_bonus + hero.abilities.wisdom.modifier);
                    break;
                default:
                    break;
            }
        }
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.spellcastingAbility, scAbility, font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.spellSaveDC, ssDC, font);
        PdfEdit.fillInFieldCenter(pdfDoc, fieldNames.spellAttackBonus, saBonus, font);
    }

    // Cantrips
    fillLevel(pdfDoc, font, heroSpells, fieldNames.cantrips, 0);

    // Level 1
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level1, 1);
    
    // Level 2
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level2, 2);
    
    // Level 3
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level3, 3);
    
    // Level 4
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level4, 4);
    
    // Level 5
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level5, 5);
    
    // Level 6
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level6, 6);
    
    // Level 7
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level7, 7);
    
    // Level 8
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level8, 8);
    
    // Level 9
    fillLevel(pdfDoc, font, heroSpells, fieldNames.level9, 9);
    
};