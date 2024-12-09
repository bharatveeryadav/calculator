   // server.js
   import express from 'express';
   import path from 'path';
   import { fileURLToPath } from 'url';
   import pdf from 'html-pdf';
   import puppeteer from 'puppeteer';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const app = express();
   const port = 8000;

   app.set('view engine', 'ejs');
   app.use(express.urlencoded({ extended: true }));
   app.use(express.json()); // Add this line to parse JSON requests
   app.use(express.static(path.join(__dirname, 'public')));

   app.get('/', (req, res) => {
       res.render('index', { total: null, totalWeight: null, products: [] });
   });

   app.post('/calculate', (req, res) => {
       const products = req.body.products || [];
       let total = 0;
       let totalWeight = 0;

       const calculatedProducts = products.map(product => {
           const weight = parseFloat(product.weight) || 0;
           const rate = parseFloat(product.rate) || 0;
           const rowTotal = weight * rate;
           total += rowTotal;
           totalWeight += weight;
           return { ...product, rowTotal };
       });

       res.render('index', { total, totalWeight, products: calculatedProducts });
   });

   app.post('/generate-pdf', (req, res) => {
       const html = req.body.html;
       if (!html) {
           return res.status(400).send('No HTML content provided');
       }
       pdf.create(html).toFile('./public/product-calculator.pdf', (err, result) => {
           if (err) return res.status(500).send(err);
           res.sendFile(path.resolve(__dirname, 'public/product-calculator.pdf'));
       });
   });

   app.post('/screenshot', async (req, res) => {
    const html = req.body.html;
    if (!html) {
        return res.status(400).send('No HTML content provided');
    }
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Add these flags
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.screenshot({ path: './public/screenshot.png' });
    await browser.close();
    res.sendFile(path.resolve(__dirname, 'public/screenshot.png'));
});

   app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
   });