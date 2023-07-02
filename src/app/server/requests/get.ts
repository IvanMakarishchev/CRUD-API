import { createReadStream, createWriteStream } from 'fs';
import { serverService } from '../../utils/serverService.ts';
import { DATA_FILE } from '../../constants/constants.ts';
import { Data } from '../../interfaces/data.ts';
import { randomUUID } from 'crypto';
import { DataService } from '../../utils/dataService.ts';
import { Readable } from 'stream';

class RequestGet {
  private dataStotage = new DataService();

  processGet() {
    const server = serverService.getServer();
    if (server !== undefined) {
      server.on('request', (req, res) => {
        const requestUrl = req.url;
        const requestMethod = req.method;
        if (requestMethod === 'GET') {
          requestUrl &&
          requestUrl.slice(requestUrl.lastIndexOf('/') + 1) === 'users'
            ? res.end(() => {
                console.log(this.dataStotage.getData());
              })
            : res.end(() => {
                const userId = requestUrl
                  ? requestUrl.slice(requestUrl.lastIndexOf('/') + 1)
                  : undefined;
                console.log(
                  this.dataStotage.getData().find((el) => el.id === userId),
                );
              });
        }
        if (requestMethod === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const bodyParsed = JSON.parse(body) as Data;
            bodyParsed.id = randomUUID();
            this.dataStotage.addData(bodyParsed);
            res.end(() => {
              console.log(this.dataStotage.getData());
            });
          });
        }
        res.end(() => {
          if (requestUrl !== '/api/users') {
            res.statusCode = 404;
          }
          console.log(res.statusCode);
        });
      });
    }
  }
}

export const getRequest = new RequestGet();
