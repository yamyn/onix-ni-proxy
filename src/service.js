let request = require('request');
let zlib = require('zlib');
const cheerio = require('cheerio');

class ProxyService {
    constructor(url) {
        this.url = url;
        this.page = '';
    }

    static getLength(page) {
        return Buffer.byteLength(page, 'utf8');
    }

    /**
     * @method unzipPage
     * @returns {void}
     */
    async unzipPage() {
        this.page = await new Promise(resolve => {
            request(this.url, { gzip: true }, (err, resp, body) => {
                resolve(body);
            });
        });
    }

    /**
     * @method addContent
     * @param {string} content
     * @returns {string}
     */
    addContent(content) {
        const $ = cheerio.load(this.page);
        $('body').append(content);

        this.page = $.html();
    }

    /**
     * @method tozipPage
     * @returns {void}
     */
    async tozipPage() {
        this.page = await new Promise(resolve => {
            zlib.gzip(this.page, (err, encoded) => {
                resolve(encoded);
            });
        });
    }

    /**
     * @method add
     * @param {string} content
     * @returns {Promise<string>}
     */
    async add(content) {
        try {
            await this.unzipPage();
            this.addContent(content);
            await this.tozipPage();

            return this.page;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    ProxyService,
};
