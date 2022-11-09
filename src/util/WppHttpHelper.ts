import https from 'https';
import { WppError } from '../models/WppError';

export class WppHttpHelper {
  constructor(private endpoint: string) {}

  public post(message: string): Promise<string>;
  public post(message: string, cb: (err: Error, responseBody: string) => void): void;

  public post(message: string, cb?: (err: Error, responseBody: string) => void): any {
    if (!cb) {
      return this.postPromise(message);
    } else {
      return this.postCb(message, cb);
    }
  }

  private postPromise(message: string): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      const req = https.request(
        this.endpoint,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(message),
          },
          method: 'POST',
        },
        (res) => {
          const statusCode = res.statusCode!;
          const statusMessage = res.statusMessage;
          // console.log('headers:', res.headers);
          res.on('data', (d: Buffer) => {
            chunks.push(d);
          });
          res.on('end', () => {
            const responseBody = Buffer.concat(chunks).toString("utf-8");
            if( statusCode >= 400 ){
              let e = new WppError(
                `${statusCode} ${statusMessage}`);
                e.errors = responseBody;
                reject(e);
                return;
            }
            resolve(responseBody);
          });
        },
      );

      req.on('error', (e) => {
        reject(e);
      });
      req.write(message);
      req.end();
    });
  }

  private postCb(message: string, cb: (err: Error, responseBody: string) => void): void {
    const chunks: Buffer[] = [];
    const req = https.request(
      this.endpoint,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(message),
        },
        method: 'POST',
      },
      (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);

        res.on('data', (d: Buffer) => {
          chunks.push(d);
        });
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks);
          let err!: Error;
          cb(err, responseBody.toString('utf-8'));
        });
      },
    );

    req.on('error', (e) => {
      let s!: string;
      cb(e, s);
    });
    req.write(message);
    req.end();
  }
}
