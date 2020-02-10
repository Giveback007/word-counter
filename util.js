let x =
`6 |  1.932 | 18.580 |  38334 | i 
8 |  1.296 | 21.516 |  25712 | it 
9 |  1.203 | 22.718 |  23859 | that 
11 |  1.079 | 24.953 |  21402 | he 
12 |  0.973 | 25.926 |  19303 | you 
13 |  0.888 | 26.814 |  17623 | his  
17 |  0.728 | 30.029 |  14441 | her 
25 |  0.569 | 35.122 |  11286 | she 
27 |  0.510 | 36.198 |  10120 | me 
29 |  0.491 | 37.198 |   9743 | all 
30 |  0.468 | 37.665 |   9276 | him 
31 |  0.466 | 38.131 |   9240 | this 
35 |  0.397 | 39.836 |   7877 | which 
37 |  0.384 | 40.605 |   7611 | they 
44 |  0.322 | 42.925 |   6394 | we 
47 |  0.284 | 43.817 |   5636 | what 
50 |  0.261 | 44.623 |   5174 | them 
61 |  0.217 | 47.208 |   4312 | who `

x = x.split('\n')
    .map((y) => y.split('|')[4])
    // .map((x) => Number(x));

x = x.map((y) => y.trim());
    //, x.reduce((a, b) => a + b));

const obj = {};
x.forEach((y) => obj[y] = null)

console.log(obj);

(function getText() {
    const x = document.getElementsByTagName('P');
    const str = Array(x.length).fill(null).map((y, i) => x[i].innerText).join('');
    copy(str);
})()


