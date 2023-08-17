const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

const invertKeyValues = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    //acc[obj[key]] = acc[obj[key]] || [];
    //acc[obj[key]].push(key);
    acc[obj[key]] = key;
    return acc;
  }, {});

class Translator {
  american2british(text) {
    //console.log('---  american2british() ---\n--- text: "%s"', text);
    const americantimere = /(\d{1,2})(\:)(\d{1,2})(\.{0,1})/g;
    const lastchar = text[text.length-1]
    const lexemes = text.replace(/[.?!]$/, "").split(" ");

    let modified = false; 

    let result = lexemes.map((w) => {
      // check if it is a time
      const time = [...w.matchAll(americantimere)];
      if (time.length != 0) {
        modified = true;
        let val = time[0][1] + '.' + time[0].slice(3).join("");
        return `<span class="highlight">${val}</span>`;
      }
      // Check abbreviation
      if (americanToBritishTitles.hasOwnProperty(w.toLowerCase())) {
        modified = true;
        let val = americanToBritishTitles[w.toLowerCase()][0].toUpperCase() + americanToBritishTitles[w.toLowerCase()].substring(1);
        return `<span class="highlight">${val}</span>`;
      }
      // Check American to British spelling
      if (americanToBritishSpelling.hasOwnProperty(w.toLowerCase())) {
        modified = true;
        let val = americanToBritishSpelling[w.toLowerCase()];
        return `<span class="highlight">${val}</span>`;
      }
      //-------------------
      return w
    }).join(" ");

    for (const [key, value] of Object.entries(americanOnly)) {
      if ([...result.matchAll(new RegExp(`(?<=\\s|^)${key}\\b`, 'gi'))].length != 0) {
        modified = true
      }      
      result = result.replaceAll(new RegExp(`(?<=\\s|^)${key}\\b`, 'gi'), `<span class="highlight">${value}</span>`)
    }

    /*const invertedBritishOnly = invertKeyValues(britishOnly)

    for (const [key, value] of Object.entries(invertedBritishOnly)) {
      result = result.replace(new RegExp(`${key}`, 'gi'), `<span class="highlight">${value}</span>`)
    }*/    

    if (modified) {
      return result[0].toUpperCase() + result.substring(1) + lastchar;   
    } else {
      return "Everything looks good to me!"
    }
  }

  british2american(text) {
    //console.log('---  british2american() ---\n--- text: "%s"', text);
    const britishtimere = /(\d{1,2})(\.)(\d{1,2})(\.{0,1})/g;
    const lastchar = text[text.length-1]
    const lexemes = text.replace(/[.?!]$/, "").split(" ");
    let modified = false;    

    let result = lexemes.map((w) => {
      // check if it is a time
      const time = [...w.matchAll(britishtimere)];
      if (time.length != 0) {
        modified = true;
        let val = time[0][1] + ':' + time[0].slice(3).join("");
        return `<span class="highlight">${val}</span>`;
      }
      // Check abbreviation
      const invertedTitles = invertKeyValues(americanToBritishTitles)
      if (invertedTitles.hasOwnProperty(w.toLowerCase())) {
        modified = true;
        console.log("test: %s", americanToBritishTitles[w.toLowerCase()]);
        let val = invertedTitles[w.toLowerCase()][0].toUpperCase() + invertedTitles[w.toLowerCase()].substring(1);
        return `<span class="highlight">${val}</span>`;
      }
      // Check American to British spelling
      const invertedSpelling = invertKeyValues(americanToBritishSpelling)
      if (invertedSpelling.hasOwnProperty(w.toLowerCase())) {
        modified = true;
        let val = invertedSpelling[w.toLowerCase()];
        return `<span class="highlight">${val}</span>`;
      }
      //-------------------
      return w
    }).join(" ");

    for (const [key, value] of Object.entries(britishOnly)) {
      if ([...result.matchAll(new RegExp(`(?<=\\s|^)${key}\\b`, 'gi'))].length != 0) {
        modified = true
      }
      result = result.replaceAll(new RegExp(`(?<=\\s|^)${key}\\b`, 'gi'), `<span class="highlight">${value}</span>`)
    }

    /*const invertedAmericanOnly = invertKeyValues(americanOnly)

    for (const [key, value] of Object.entries(invertedAmericanOnly)) {
      result = result.replace(new RegExp(`${key}`, 'gi'), `<span class="highlight">${value}</span>`)
    }*/
    
    if (modified) {
      return result[0].toUpperCase() + result.substring(1) + lastchar;    
    } else {
      return "Everything looks good to me!"
    }
  }
}

module.exports = Translator;