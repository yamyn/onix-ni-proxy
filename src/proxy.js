const url = require('url');
const ProxyService = require('./service').ProxyService;
const link = require('./content/link').link;

/**
 * @function
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
async function getPage(req, res) {
    try {
        const reqUrl = url.parse(req.url, true);
        const host = reqUrl.query.host;

        if (host) {
            const service = new ProxyService(host);
            const page = await service.add(link);
            const pageLength = ProxyService.getLength(page);

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Encoding': 'gzip',
                'Content-Length': pageLength,
            });
            res.write(page);
            res.end();
        }
    } catch (error) {
        res.write(error);
    }
}

module.exports = {
    getPage,
};
