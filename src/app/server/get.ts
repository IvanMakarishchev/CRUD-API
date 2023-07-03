import { serverService } from '../utils/serverService.ts';
import { urlReg, uuidReg } from '../constants/constants.ts';
import { Data } from '../interfaces/data.ts';
import { randomUUID } from 'crypto';
import { DataService } from '../utils/dataService.ts';
import { isData } from '../utils/checkDataType.ts';
class RequestGet {
  private dataStotage = new DataService();

  processGet() {
    const server = serverService.getServer();
    if (server !== undefined) {
      server.on('request', (req, res) => {
        const requestUrl = req.url;
        const requestMethod = req.method;
        const urlEnd =
          requestUrl && requestUrl.slice(requestUrl.lastIndexOf('/') + 1);
        const userId = urlEnd !== 'users' && urlEnd;
        if (requestMethod === 'GET') {
          const data = this.dataStotage.getData();
          urlEnd === 'users'
            ? res.end(() => {
                req.statusCode = 200;
                console.log(`Status code ${req.statusCode}`);
                console.log(data);
              })
            : res.end(() => {
                const user = data.find((el) => el.id === userId);
                if (!requestUrl?.match(urlReg)) {
                  req.statusCode = 404;
                  console.error(`Status code ${req.statusCode}: Can't process your request. Unknown url.`);
                } else if (!(<string>userId)?.match(uuidReg)) {
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
                  console.log(user);
                } else {
                  req.statusCode = 520;
                  console.error(
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
            res.end(() => {
              if (!requestUrl?.match(urlReg)) {
                req.statusCode = 404;
                console.error(`Status code ${req.statusCode}: Can't process your request. Unknown url.`);
              } else if (!isData(bodyParsed)) {
                req.statusCode = 400;
                console.error(
                  `Status code ${req.statusCode}: Request body does not meet the requirements!`,
                );
              } else if (urlEnd !== 'users') {
                req.statusCode = 400;
                console.error(`Status code ${req.statusCode}: Bad Request`);
              } else {
                (<Data>bodyParsed).id = randomUUID();
                this.dataStotage.addData(bodyParsed);
                req.statusCode = 201;
                console.log(`Status code ${req.statusCode}`);
                console.log(this.dataStotage.getData());
              }
            });
          });
        }
        if (requestMethod === 'PUT') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const bodyParsed = JSON.parse(body);
            res.end(() => {
              if (!requestUrl?.match(urlReg)) {
                req.statusCode = 404;
                console.error(`Status code ${req.statusCode}: Can't process your request. Unknown url.`);
              } else if (!isData(bodyParsed)) {
                req.statusCode = 400;
                console.error(
                  `Status code ${req.statusCode}: Request body does not meet the requirements!`,
                );
              } else if (urlEnd === 'users') {
                req.statusCode = 400;
                console.error(`Status code ${req.statusCode}: Bad Request`);
              } else {
                const data = this.dataStotage.getData();
                const index = data.findIndex((user) => user.id === userId);
                if (!(<string>userId)?.match(uuidReg)) {
                  req.statusCode = 400;
                  console.error(`Status code ${req.statusCode}: Invalid uuid!`);
                } else if (index < 0) {
                  req.statusCode = 404;
                  console.error(
                    `Status code ${req.statusCode}: User ${userId} not found!`,
                  );
                } else if (index >= 0) {
                  req.statusCode = 200;
                  console.log(`Status code ${req.statusCode}`);
                  this.dataStotage.changeData(index, bodyParsed);
                  console.log(this.dataStotage.getData());
                } else {
                  req.statusCode = 520;
                  console.error(
                    `Status code ${req.statusCode}: Server is returning an unknown error.`,
                  );
                }
              }
            });
          });
        }
        if (requestMethod === 'DELETE') {
          const data = this.dataStotage.getData();
          res.end(() => {
            const userIndex = data.findIndex((el) => el.id === userId);
            if (!requestUrl?.match(urlReg)) {
              req.statusCode = 404;
              console.error(`Status code ${req.statusCode}: Can't process your request. Unknown url.`);
            } else if (urlEnd === 'users') {
              req.statusCode = 400;
              console.error(`Status code ${req.statusCode}: Bad Request`);
            } else if (!(<string>userId)?.match(uuidReg)) {
              req.statusCode = 400;
              console.error(`Status code ${req.statusCode}: Invalid uuid!`);
            } else if (userIndex < 0) {
              req.statusCode = 404;
              console.error(
                `Status code ${req.statusCode}: User ${userId} not found!`,
              );
            } else if (userIndex >= 0) {
              this.dataStotage.removeData(userIndex);
              req.statusCode = 204;
              console.log(`Status code ${req.statusCode}`);
              console.log(`User ${userId} removed.`);
            } else {
              req.statusCode = 520;
              console.error(
                `Status code ${req.statusCode}: Server is returning an unknown error.`,
              );
            }
          });
        }
      });
    }
  }
}

export const getRequest = new RequestGet();
