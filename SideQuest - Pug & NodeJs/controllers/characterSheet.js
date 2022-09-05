const User = require('../models/user');
const Hero = require('../models/hero');
const Class = require('../models/class');
const Race = require('../models/race');
const Spell = require('../models/spell');

const PdfEdit = require('./functions/pdfEdit');
const PdfFields = require('./functions/fields');

const getPath = (selector) => {
  var path = './public/images/charactersheet/';
  switch(selector){
    case 'charactersheet':
      path += 'charactersheet.pdf';
      break;
    case 'characterdetails':
      path += 'characterdetails.pdf';
      break;
    case 'spellcasting':
      path += 'spellcasting.pdf';
      break;
    default:
      path += 'charactersheet.pdf';
      break;
  }

  return path;
};

exports.fillPdf = async (req, res, next) => {
  try{
    const heroName = req.params.hero;
    const hero = await Hero.aggregate([
      { $match: { name: heroName } },
      { $lookup: {
          from: 'races',
          localField: 'race',
          foreignField: '_id',
          as: 'race'
      } },
      { $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'class'
      } }
    ]).then(res => res[0]);
    hero.race = hero.race[0];
    hero.class = hero.class[0];
    const user = await User.findOne({ characters: hero._id });
    
    const selector = req.params.selector;
    
    const path = getPath(selector);

    // const pdfDoc = await PdfEdit.loadPdfUrl(selector);
    const pdfDoc = await PdfEdit.loadPdfLocal(selector);

    const FontHelvetica = PdfEdit.loadFont('Helvetica', pdfDoc);

    switch(selector) {
      case 'charactersheet':
        const sheetFieldNames = PdfFields.sheetFieldNames;
        PdfFields.sheetFillFields(pdfDoc, sheetFieldNames, hero, user, FontHelvetica);

        break;
      case 'characterdetails':
        const detailFieldNames = PdfFields.detailFieldNames;
        PdfFields.detailsFillFields(pdfDoc, detailFieldNames, hero, FontHelvetica);

        // Add images to PDF
        const pages = pdfDoc.getPages();

        if(hero.image != '' && hero.image != undefined){
          const pathHero = `http://res.cloudinary.com/duezou4td/image/upload/${hero.image}.png`
          
          const heroImage = await PdfEdit.loadImageUrl(pathHero, pdfDoc);
          
          // Scale down to 2/3 of max size of character image rectangle
          const scale = heroImage.width > heroImage.height
            ? (2/3) * (161 / heroImage.width)
            : (2/3) * (217 / heroImage.height);
          const heroImageDims = heroImage.scale(scale);

          // Place image at center of rectangle. 
          // Rectangle max width = 161, max height = 217.
          // Rectangle starts (left to right, bottom to top) at (37, 444).
          // Rectangle ends (left to right, top to bottom) at (198, 661).
          const rectX = 161 / 2 - heroImageDims.width / 2;
          const rectY = 217 / 2 - heroImageDims.height / 2

          pages[0]
            .drawImage(heroImage, {
              x: 37 + rectX,
              y: 444 + rectY,
              width: heroImageDims.width, 
              height: heroImageDims.height
            })
        }

        if(hero.description.notes.organization.emblem != '' && hero.description.notes.organization.emblem != undefined){
          const pathEmblem = `http://res.cloudinary.com/duezou4td/image/upload/${hero.description.notes.organization.emblem}.png`;
          const heroEmblemImage = await PdfEdit.loadImageUrl(pathEmblem, pdfDoc);

          // Scale down to 90% of max size of character image rectangle
          const scale = heroEmblemImage.width < heroEmblemImage.height
            ? (0.9) * (134 / heroEmblemImage.width)
            : (0.9) * (106 / heroEmblemImage.height);
          const heroEmblemImageDims = heroEmblemImage.scale(scale);

          // Place image at center of rectangle. 
          // Rectangle max width = 134, max height = 106.
          // Rectangle starts (left to right, bottom to top) at (426, 510).
          // Rectangle ends (left to right, top to bottom) at (560, 616).
          const rectX = 134 / 2 - heroEmblemImageDims.width / 2;
          const rectY = 106 / 2 - heroEmblemImageDims.height / 2

          pages[0]
            .drawImage(heroEmblemImage, {
              x: 426 + rectX,
              y: 510 + rectY,
              width: heroEmblemImageDims.width,
              height: heroEmblemImageDims.height
            })
        }

        break;
      case 'spellcasting':
        const getHeroSpells = await Hero.aggregate([
            { $match: { name: heroName } },
            { $lookup: {
                from: 'spells',
                localField: 'spells.racial',
                foreignField: '_id',
                as: 'spells.racial'
            } },
            { $lookup: {
                from: 'spells',
                localField: 'spells.class',
                foreignField: '_id',
                as: 'spells.class'
            } }
        ]).then(res => res[0].spells);

        const racialSpells = [
            getHeroSpells.racial.map(spell => { if(spell.level === 0) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 1) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 2) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 3) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 4) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 5) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 6) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 7) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 8) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.racial.map(spell => { if(spell.level === 9) return spell; }).filter(el => { return el != null; })
        ];

        const classSpells = [
            getHeroSpells.class.map(spell => { if(spell.level === 0) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 1) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 2) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 3) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 4) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 5) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 6) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 7) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 8) return spell; }).filter(el => { return el != null; }),
            getHeroSpells.class.map(spell => { if(spell.level === 9) return spell; }).filter(el => { return el != null; })
        ];

        const heroSpells = racialSpells.map((level, index) => level.concat(classSpells[index]));
        
        const spellFieldNames = PdfFields.spellFieldNames;
        PdfFields.spellFillFields(pdfDoc, spellFieldNames, hero, heroSpells, FontHelvetica);

        break;
      default:
        break;
    }

    // Save PDF into bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();
    var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary'); // Saves pdfBytes as buffer

    // Send PDF
    res.status(200);
    res.type('application/pdf');
    res.send(pdfBuffer);

  } catch(error) {
    next(error);
  }
}