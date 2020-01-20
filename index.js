const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////
///////////////////FILES
// Blocking code execution. How his is synchronous action each line of the code blok another one for execution before is completed itself
//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textIn);

// Non-blocking code execution. Asynchronous read file function that accept callback function.
//fs.readFile('input.txt', 'utf-8', (err, data) => {
//  console.log(data);
//});
//console.log('Reading file...');

//const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
//fs.writeFileSync('./txt/output.txt', textOut);
//console.log('File written');

//fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
// if(err) return console.log('ERROR!');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//    console.log(data2);
//      fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//            console.log(data3);

//   fs.writeFile('.txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been writtin');
//       })
//     });
//   });
//});
//console.log('Will read file!');

///////////////////////////////////////////
//SERVER

//this is a top level code that is executed only once when we start to program and this is why is no problem to be synchronous

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  const pathName = req.url;

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world'
    });
    res.end('<h1>Page cannot be found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
