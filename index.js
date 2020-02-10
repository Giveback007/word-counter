const fs = require('fs');

const opts = {
    langauge: 'english', // english | bisaya
    wordsToTxtFile: 200, // n of top words to file
}

function objMap(o, funct) {
    const newObj = {};

    for (const key in o) {
        newObj[key] = funct({ key, val: o[key] });
    }

    return newObj;
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let textStr = '';
const texts = fs.readdirSync(`./${opts.langauge}-texts`);

texts.forEach((x) =>
    textStr += ' ' + fs.readFileSync(`./${opts.langauge}-texts/${x}`, 'utf8'));

const ignore = fs.readFileSync(`./ignore-words-${opts.langauge}`, 'utf8')
    .toLocaleLowerCase()
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s+/g,' ').trim()
    .split(' ');

const sanitized = textStr
    .toLocaleLowerCase()
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\./g, ' ')
    .replace(/á/g, 'a')
    .replace(/ú/g, 'u')
    .replace(/ó/g, 'o')
    .replace(/í/g, 'i')
    .replace(/ñ/g, 'n')
    .replace(/[^a-záúóíñ' ]/g, '') // A-Z ÁÚÓÍÑ
    .replace(/\s+/g, ' ').trim()
    .split(' ');

// Create word count object
const wordCount = {};
sanitized.forEach((w) => wordCount[w] ? wordCount[w]++ : wordCount[w] = 1);
ignore.forEach((word) => delete wordCount[word]);

// Create word count array
const wordsArr = [];
objMap(wordCount, ({ key, val }) => wordsArr.push([val, key]));

const onePercent = wordsArr.reduce((num, x) => num + x[0], 0) / 100;
let totalPercent = 0;

const sorted = wordsArr
    .map(([n, w]) => [ n, n / onePercent, w ])
    .sort((a, b) => b[0] - a[0])
    .map(([n, p, w], i) => {
        let total = Math.round((totalPercent += p) * 1000) / 1000;
        total = (total + '').split('.');
        total[0] = (' ' + total[0]).slice(-2)
        total[1] = (total[1] + '00').slice(0, 3)
        
        return [
            ('    ' + (i + 1)).slice(-5),
            (' ' + (((Math.round((p) * 1000) / 1000) + '00').slice(0, 5))).slice(-6),
            total.join('.'),
            ('     ' + n).slice(-6),
            w
        ]
    });

console.log(texts.length + ' texts-analyzed:', texts.map((x) => x.replace('.txt', '')));
console.log('ignored-words:', ignore);
console.log("total-words-analyzed:", numCommas(Math.floor(onePercent * 100)));
console.log("unique-words:", numCommas(sorted.length));
console.log(
    "ratio:", 
    Math.round(Math.floor(onePercent * 100) / sorted.length * 1000) / 1000,
    "| recomended: ratio > 25"
);


const table = JSON.stringify(sorted.slice(0, opts.wordsToTxtFile))
    .replace('[', `
    # |      % | total% | amount | word
 ---------------------------------------\n`)
    .replace(/\[/g, '')
    .replace(/\],/g, ' \n')
    .replace(/","/g, ' | ')
    .replace(/"/g, '')
    .replace(']]', '')


fs.writeFileSync(`./counted-words-${opts.langauge}.txt`, table);
