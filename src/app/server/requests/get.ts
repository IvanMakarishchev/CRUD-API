import { serverService } from '../../utils/serverService.ts';
import { uuidReg } from '../../constants/constants.ts';
import { Data } from '../../interfaces/data.ts';
import { randomUUID } from 'crypto';
import { DataService } from '../../utils/dataService.ts';
import { isData } from '../../utils/checkDataType.ts';
class RequestGet {
  private dataStotage = new DataService();

  processGet() {
    const server = serverService.getServer();
    if (server !== undefined) {
      server.on('request', (req, res) => {
        const requestUrl = req.url;
        const requestMethod = req.method;
        if (requestMethod === 'GET') {
          const data = this.dataStotage.getData();
          requestUrl &&
          requestUrl.slice(requestUrl.lastIndexOf('/') + 1) === 'users'
            ? res.end(() => {
                req.statusCode = 200;
                console.log(`Status code ${req.statusCode}`);
                console.log(data);
              })
            : res.end(() => {
                const userId = requestUrl
                  ? requestUrl.slice(requestUrl.lastIndexOf('/') + 1)
                  : undefined;
                const user = data.find((el) => el.id === userId);
                if (!userId?.match(uuidReg)) {
                  req.statusCode = 400;
                  console.error(`Status code ${req.statusCode}: Invalid uuid!`);
                } else if (!user) {
                  req.statusCode = 404;
                  console.error(
                    `Status code ${req.statusCode}: User ${userId} not found!`,
                  );
                } else if (user) {
                  req.statusCode = 200;
                  console.log(`Status code ${req.statusCode}`);
                  console.log(data.find((el) => el.id === userId));
                } else {
                  req.statusCode = 520;
                  console.log(
                    `Status code ${req.statusCode}: Server is returning an unknown error.`,
                  );
                }
              });
        }
        if (requestMethod === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const bodyParsed = JSON.parse(body);
            if (!isData(bodyParsed)) {
              res.end(() => {
                req.statusCode = 400;
                console.log(
                  `Status code ${req.statusCode}: Request body does not meet the requirements!`,
                );
              });
            } else {
              (<Data>bodyParsed).id = randomUUID();
              this.dataStotage.addData(bodyParsed);
              res.end(() => {
                req.statusCode = 201;
                console.log(`Status code ${req.statusCode}`);
                console.log(this.dataStotage.getData());
              });
            }
          });
        }
      });
    }
  }
}

export const getRequest = new RequestGet();
