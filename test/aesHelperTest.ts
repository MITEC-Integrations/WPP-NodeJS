import { expect } from "chai";
import { AESHelper } from "../src/util/AESHelper";

const key = "5DCC67393750523CD165F17E1EFADD21";

describe("AesHelper test", ()=>{
    let expected = '<?xml version="1.0" encoding="UTF-8"?><P><business><id_company>SNBX</id_company><id_branch>01SNBXBRNCH</id_branch><user>SNBXUSR0123</user><pwd>SECRETO</pwd></business><url><reference>FACTURA999</reference><amount>1.00</amount><moneda>MXN</moneda><canal>W</canal></url><version>IntegraWPP</version></P>';
    it('should return a cipherTest', ()=> {
        let aesHelper = new AESHelper(Buffer.from(key, "hex"));
        let encrypted = aesHelper.encrypt(expected);
        console.log("encrypted", encrypted);
        
        expect(encrypted).to.be.an("string")

        let decrypted = aesHelper.decrypt(encrypted);
        console.log("decrypted", decrypted);
        
        // expect(decrypted).equal(expected);

    });
});