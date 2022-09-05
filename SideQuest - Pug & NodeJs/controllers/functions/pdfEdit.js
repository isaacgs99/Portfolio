const fs = require('fs');
const {
  PDFArray,
  PDFBool,
  PDFName,
  PDFNumber,
  PDFHexString,
  PDFDocument,
  PDFContentStream,
  PDFOperator,
  PDFOperatorNames: Ops,
  StandardFonts,
  asPDFName,
  degrees,
  rgb,
  breakTextIntoLines,
  drawLinesOfText,
  pushGraphicsState,
  popGraphicsState
} = require('pdf-lib');

const fetch = require('node-fetch');

// Gets PDF's AcroForm object
const getAcroForm = pdfDoc => {
  return pdfDoc.catalog.lookup(PDFName.of('AcroForm'));
};

// Gets AcroForm field references from PDF document and returns them as an array[]
const getAcroFields = (pdfDoc) => {
  // Attempts to get AcroForm objects from PDF and checks if they exist. If not, returns [].
  const acroForm = getAcroForm(pdfDoc);
  if (!acroForm) return [];

  // Attempts to get AcroForm fields from PDF and checks if they exist. If not, returns [].
  const acroFields = acroForm.lookupMaybe(PDFName.of('Fields'), PDFArray);
  if (!acroFields) return [];

  return acroFields.array.map(ref => acroForm.context.lookup(ref));

  /*
  If return doesn't work, use:
  //Returns an array of AcroForm field references
  const acroFields = new Array(acroFieldsPre.size());
  for (let index = 0, length = acroFieldsPre.size(); index < length; index++) {
    acroFields[index] = acroFieldsPre.lookup(index);
  }
  return acroFields;
  NOTES:
   * '.getMaybe' is no longer used, in '.lookup' and '.get', PDFName object must be passed
   * '.index' is now '.context'
   * 'PDFDocument.index.lookup' does not exist anymore
  */
};

// Finds AcroForm field references by name and returns fieldNames
const findAcroFieldByName = (pdfDoc, name) => {
  const acroFields = getAcroFields(pdfDoc); // Gets AcroForm field references from PDF document
  return acroFields.find((acroField) => {
    const fieldName = acroField.get(PDFName.of('T')); // Gets AcroForm text fields and stores their name in fieldName
    return !!fieldName && fieldName.value === name; // Returns fieldName if fieldName exists and is == name.
  });
};

// Fills AcroForm text fields
const fillAcroTextField = (acroField, text, font, multiline = false) => {
  const rect = acroField.lookup(PDFName.of('Rect'), PDFArray);  // Gets AcroField text rectangle
  const width = rect.lookup(2, PDFNumber).value() - rect.lookup(0, PDFNumber).value();  // Gets AcroField rectangle width
  const height = rect.lookup(3, PDFNumber).value() - rect.lookup(1, PDFNumber).value(); // Gets AcroField rectangle height

  // If multiline is true, use multiLineAppearanceStream() for appearance. Else (default), use singleLineAppearanceStream().
  const N = multiline
    ? multiLineAppearanceStream(font, text, width, height)
    : singleLineAppearanceStream(font, text, width, height);

  acroField.set(PDFName.of('AP'), acroField.context.obj({ N }));  // Sets appearance (multi or single line)
  acroField.set(PDFName.of('Ff'), PDFNumber.of(1 /* Read Only */)); // Sets field to read-only
  acroField.set(PDFName.of('V'), PDFHexString.fromText(text));  // Writes text to field value
};

// Fills AcroForm text fields with centered text
const fillAcroTextFieldCenter = (acroField, text, font, multiline = false) => {
  const rect = acroField.lookup(PDFName.of('Rect'), PDFArray);  // Gets AcroField text rectangle
  const width = rect.lookup(2, PDFNumber).value() - rect.lookup(0, PDFNumber).value();  // Gets AcroField rectangle width
  const height = rect.lookup(3, PDFNumber).value() - rect.lookup(1, PDFNumber).value(); // Gets AcroField rectangle height

  // If multiline is true, use multiLineAppearanceStream() for appearance. Else (default), use singleLineAppearanceStream().
  const N = multiline
    ? multiLineAppearanceStreamCenter(font, text, width, height)
    : singleLineAppearanceStreamCenter(font, text, width, height);

  acroField.set(PDFName.of('AP'), acroField.context.obj({ N }));  // Sets appearance (multi or single line)
  acroField.set(PDFName.of('Ff'), PDFNumber.of(1 /* Read Only */)); // Sets field to read-only
  acroField.set(PDFName.of('V'), PDFHexString.fromText(text));  // Writes text to field value
};

// Marks beggining and end of marked context (used in operators array)
const beginMarkedContent = tag => PDFOperator.of(Ops.BeginMarkedContent, [asPDFName(tag)]);
const endMarkedContent = () => PDFOperator.of(Ops.EndMarkedContent);

// Sets content stream appearance for single line AcroForm text fields
const singleLineAppearanceStream = (font, text, width, height) => {
  const size = font.sizeAtHeight(height - 5); // Sets font size
  const lines = [font.encodeText(text)];  // Sets text. Encodes text to hex.
  const x = 0;  // Sets X text start position
  const y = height - size;  // Sets Y text start position
  
  // Returns PDFContentStream (font.doc.context.register(stream))
  return textFieldAppearanceStream(font, size, lines, x, y, width, height);
};

// Sets content stream appearance for centered single line AcroForm text fields
const singleLineAppearanceStreamCenter = (font, text, width, height) => {
  const size = font.sizeAtHeight(height - 5); // Sets font size
  const textWidth = font.widthOfTextAtSize(text, size); // Gets text width with font applied
  const lines = [font.encodeText(text)];  // Sets text. Encodes text to hex.
  const x = width / 2 - textWidth / 2;  // Sets X text start position
  const y = height - size;  // Sets Y text start position
  
  // Returns PDFContentStream (font.doc.context.register(stream))
  return textFieldAppearanceStream(font, size, lines, x, y, width, height);
};

// Sets content stream appearance for multi line AcroForm text fields
const multiLineAppearanceStream = (font, text, width, height) => {
  const size = 10;  // Sets font size
  const textWidth = t => font.widthOfTextAtSize(t, size); // Finds field width and relates it to font size
  // Sets text and breaks it into lines when needed on space (' ') characters. Encodes text to hex.
  const lines = breakTextIntoLines(text, [' '], width, textWidth).map(line => font.encodeText(line));
  const x = 0;  // Sets X text start position
  const y = height - size;  // Sets Y text start position
  // Returns PDFContentStream (font.doc.context.register(stream))
  return textFieldAppearanceStream(font, size, lines, x, y, width, height);
};

// Sets content stream appearance for multi line AcroForm text fields
const multiLineAppearanceStreamCenter = (font, text, width, height) => {
  const size = 10;  // Sets font size
  const textWidth = t => font.widthOfTextAtSize(t, size); // Finds field width and relates it to font size (computed)
  const textWidthNC = font.widthOfTextAtSize(text, size); // Finds field width and relates it to font size (non-computed)
  // Sets text and breaks it into lines when needed on space (' ') characters. Encodes text to hex.
  const lines = breakTextIntoLines(text, [' '], width, textWidth).map(line => font.encodeText(line));
  const x = width / 2 - textWidthNC / 2;  // Sets X text start position
  const y = height - size;  // Sets Y text start position
  // Returns PDFContentStream (font.doc.context.register(stream))
  return textFieldAppearanceStream(font, size, lines, x, y, width, height);
};

// Sets content stream appearance for text fields
const textFieldAppearanceStream = (font, size, lines, x, y, width, height) => {
  const dict = font.doc.context.obj({
    Type: 'XObject',
    Subtype: 'Form',
    FormType: 1,
    BBox: [0, 0, width, height],
    Resources: { Font: { F0: font.ref } }
  });

  const operators = [
    beginMarkedContent('Tx'), // Marks beginning of content
    pushGraphicsState(),
    ...drawLinesOfText(lines, {
      color: rgb(0, 0, 0),  // Sets font color
      font: 'F0', // Sets font name?
      size: size, // Sets font size
      rotate: degrees(0), // Sets text rotation
      xSkew: degrees(0),  // Sets text xSkew
      ySkew: degrees(0),  // Sets text ySkew
      x: x, // Sets text X position
      y: y, // Sets text Y position
      lineHeight: size + 2  // Sets the line hight for text
    }),
    popGraphicsState(),
    endMarkedContent()  // Marks end of content
  ];

  // Makes a PDFContentStream object, inputting its dictionary and operators
  const stream = PDFContentStream.of(dict, operators);

  // Returns PDFContentStream, registered into the PDF's context
  return font.doc.context.register(stream);
};

/************************************/
/*************  Exports *************/
/************************************/

// Fills in AcroForm field with user text
exports.fillInField = (pdfDoc, fieldName, text, font, multiline = false) => {
  const field = findAcroFieldByName(pdfDoc, fieldName); // Finds AcroForm field reference by name within PDF and stores it in field
  if (!field) throw new Error(`Missing AcroField: ${fieldName}`); // If field does not exist, throw error
  fillAcroTextField(field, text, font, multiline);  // Fill AcroForm field with text (pdf, target_field, font, text, font_size)
};

// Fills in Acroform field with centered user text
exports.fillInFieldCenter = (pdfDoc, fieldName, text, font, multiline = false) => {
  const field = findAcroFieldByName(pdfDoc, fieldName); // Finds AcroForm field reference by name within PDF and stores it in field
  if (!field) throw new Error(`Missing AcroField: ${fieldName}`); // If field does not exist, throw error
  fillAcroTextFieldCenter(field, text, font, multiline);  // Fill AcroForm field with text (pdf, target_field, font, text, font_size)
};

exports.fillInRadio = (pdfDoc, fieldName, option = 'No') => {
  /* This has to be done before the `fillInField` calls */
  const acroForm = getAcroForm(pdfDoc);
  // acroForm.set(PDFName.of('NeedAppearances'), PDFBool.True); // Breaks multiline appearance and other appearances, leaving commented for now

  const field = findAcroFieldByName(pdfDoc, fieldName);
  // console.log(field.toString()); // To see state changes
  if (!field) throw new Error(`Missing AcroField: ${fieldName}`);

  field.set(PDFName.of('V'), PDFName.of(option));
  field.set(PDFName.of('AS'), PDFName.of(option));
  field.set(PDFName.of('Ff'), PDFNumber.of(1 /* Read Only */));

  // FIX: 'No' buttons are outlined. I could get pdf from 0 and only check the ones needed.

  // console.log(field.toString());
};

// Logs AcroForm field reference names to console
exports.logAcroFieldNames = (pdfDoc) => {
    const acroFields = getAcroFields(pdfDoc);
    acroFields.forEach((acroField) => {
      console.log(
        'Field Name:',
        acroField.get(PDFName.of('T')).toString(),
        'Field Type:',
        acroField.get(PDFName.of('FT')).toString()
      );
    });
  };

/************************************/
/**********  My Functions ***********/
/************************************/

// Loads Local PDF Document as a Uint8Array
// .load - (Promise<PDFDocument>)
exports.loadPdfLocal = type => {
    if(type == 'charactersheet') {
      const path = 'public/pdfs/charactersheet/charactersheet.pdf'
      const pdfDoc = PDFDocument.load(fs.readFileSync(path), { capNumbers: false });
      return pdfDoc;
    } else if(type == 'characterdetails') {
      const path = 'public/pdfs/charactersheet/characterdetails.pdf'
      const pdfDoc = PDFDocument.load(fs.readFileSync(path), { capNumbers: false });
      return pdfDoc;
    } else {
      const path = 'public/pdfs/charactersheet/spellcasting.pdf'
      const pdfDoc = PDFDocument.load(fs.readFileSync(path), { capNumbers: false });
      return pdfDoc;
    }
    
};

// Loads PDF Document from URL as an ArrayBuffer
// .load - (Promise<PDFDocument>)
exports.loadPdfUrl = async (type) => {
    if(type === 'charactersheet') {
      const url = 'https://github.com/A01027265/sideQuestDnD/raw/master/charactersheet.pdf'
      const pdfDocBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = PDFDocument.load(pdfDocBytes);
      return pdfDoc;
    } else if (type === 'characterdetails') {
      const url = 'https://github.com/A01027265/sideQuestDnD/raw/master/characterdetails.pdf'
      const pdfDocBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = PDFDocument.load(pdfDocBytes);
      return pdfDoc;
    } else {
      const url = 'https://github.com/A01027265/sideQuestDnD/raw/master/spellcasting.pdf'
      const pdfDocBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = PDFDocument.load(pdfDocBytes);
      return pdfDoc;
    }
};

// Loads image as a Uint8Array, embeds it on PDF, and stores image ref and dims within 'image' variable
// image.width, image.height can be used to access image dims.
// .embedPng - (Promise<PDFImage>)
exports.loadImageLocal = async (path, pdfDoc) => {
    const imageBytes = fs.readFileSync(path);
    const image = pdfDoc.embedPng(imageBytes);
    return image;
};

// Loads image as an ArrayBuffer, embeds it on PDF, and stores image ref and dims within 'image' variable
// image.width, image.height can be used to access image dims.
// .embedPng - (Promise<PDFImage>)
exports.loadImageUrl = async (url, pdfDoc) => {
  const imageBytes = await fetch(url).then(res => res.buffer());
  const image = pdfDoc.embedPng(imageBytes);
  return image;
};

// Loads font and returns it
exports.loadFont = (font, pdfDoc) => {
    const chosenFont = pdfDoc.embedStandardFont(font);
    return chosenFont;
};

// Tests item's type
exports.testType = (object, options) => {
    if(options === 'head') {
      testPdf(object);
      console.log('Head:', String(object.subarray(0, 250)));
    } else {
      console.log('Type:', typeof(object));
      console.log('Is Uint8Array:', object instanceof Uint8Array);
      console.log('Is ArrayBuffer:', object instanceof ArrayBuffer);
    }
};