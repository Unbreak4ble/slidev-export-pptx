'use strict';

const PptxGenJS = require('pptxgenjs');
const { puppeteerHandler, playwrightHandler } = require('./handlers');

// choose between puppeteer and playwright for detailed pptx or light pptx
const handler = puppeteerHandler;
const output_filename = "output.pptx";

(async () => {
    const pptx = new PptxGenJS();
    
    const callback = (scr_buffer, url, last) => {
        console.log(url);
        
        pptx.addSlide().background = {
            data: `data:image/png;base64,${scr_buffer.toString('base64')}`,
        };
    };

    await handler(callback);

    pptx.writeFile({ fileName: output_filename });

    console.log("done");
})();