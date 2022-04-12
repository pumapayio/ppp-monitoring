import fs = require('fs');
import { Injectable } from '@nestjs/common';
import { BlockchainGlobals } from './blockchain';

@Injectable()
export class SmartContractReader {
  /**
   * @description Reads the ABI of the smart contract specified
   * @param {string} abiFileName Name of the file that holds the smart contract ABI
   * @returns {any} Returns the ABI of the smart contract
   * */
  public readABI(abiFileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(
          `${BlockchainGlobals.GET_ABI_DIRECTORY()}${abiFileName}`,
          'utf-8',
          (err, data) => {
            if (err) {
              return reject(err);
            }
            return resolve(data);
          },
        );
      } catch (err) {
        reject(err);
      }
    });
  }
}
