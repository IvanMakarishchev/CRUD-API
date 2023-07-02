import { createReadStream, createWriteStream } from 'fs';
import { serverService } from '../../utils/serverService.ts';
import path from 'path';
// import { PORT, serverURL } from '../../constants/environment.ts';
// import * as http from 'http';
import * as url from 'url';
import { DATA_FILE } from '../../constants/constants.ts';
import { Data } from '../../interfaces/data.ts';
import { randomUUID } from 'crypto';

class RequestGet {
  processGet() {
    const server = serverService.getServer();
    if (server !== undefined) {
      server.on('request', (req, res) => {
        const requestUrl = req.url;
        const requestMethod = req.method;
        if (requestMethod === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const bodyParsed = JSON.parse(body) as Data;
            bodyParsed.id = randomUUID();
            const rs = createReadStream(DATA_FILE);
            let appendData = '';
            rs.on('readable', (chunk: Buffer) => {
              while (null !== (chunk = rs.read())) {
                appendData += chunk;
              }
            });
            rs.on('end', () => {
              const fileDataParsed = JSON.parse(
                appendData || '[]',
              ) as Array<Data>;
              fileDataParsed.push(bodyParsed);
              const ws = createWriteStream(DATA_FILE);
              ws.write(JSON.stringify(fileDataParsed));
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
