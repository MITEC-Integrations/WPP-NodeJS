import { expect } from "chai";
import { PaymentBuilder } from "../src/builders/PaymentBuilder";
import { PaymentData } from "../src/models/Interfaces";
import { WppClient } from "../src/WppClient";

const key = "5DCC67393750523CD165F17E1EFADD21";

describe("WppClient test", ()=>{
    let client: WppClient = new WppClient("https://sandboxpo.mit.com.mx/gen", "SNDBX123", "5DCC67393750523CD165F17E1EFADD21");
    it('should return a URL, with builder', async()=> {
        const payment = new PaymentBuilder().paymentMethod("TCD")
        .withBusiness().idCompany("SNBX").idBranch("01SNBXBRNCH").user("SNBXUSR0123").password("SECRETO")
        .and()
        .withUrl().amount(10).reference("FACTURA999").currency("MXN").omitNotification(1)
        .and()
        .withAditionalData().append(1, true, "label3", "value3")
        .and().build();

        const url = await client.getUrlPayment(payment).catch(console.error);
        console.log(url);
        expect(url).to.be.a("string");
    });

    it("should return a URL", async()=>{
        const payment: PaymentData = {
            business: {
                id_company: "SNBX",
                id_branch: "01SNBXBRNCH",
                user: "SNBXUSR0123",
                pwd: "SECRETO",
            },
            version: "IntegraWPP",
            url: {
                reference: "FACTURA999",
                amount: 10.51,
                moneda: "MXN",
                canal: "W",
                omitir_notif_default: 1,
            },
            datos_adicionales: {
                data: [{
                    $: { id: 1, display: false },
                    label: "label",
                    value: "value"
                },
                {
                    $: { id: 2, display: false },
                    label: "label2",
                    value: "value"
                }]
            }
        }    
        const url = await client.getUrlPayment(payment).catch(console.error);
        console.log(url);
        expect(url).to.be.a("string");
    });

    it('should process a payment notification', async ()=> {
        const strResponse = "otB4VyAtYh5bW4IeVhM30125kqfmzVxxDlFQRZHCUroq6e1MSISChhDstN1gKKnA%0D%0AOs%2BdgrMxpLDffJQjJ8GJyGeOaOG8LSfUg0vaxVwnTwXEzXFheI%2BbgarDW0fUXS6h%0D%0ARd1jFwMKLduhHrQ2dyE9EijwtdQv6TmI2Gp6tfQaPix0GRHcPZUCAozNyhZWaNIO%0D%0AAqfI%2FRRb8FNHbvYHEEVssRRfeF8f8k%2F8HF5oM4Ec%2BcT848llOgwETNjpGgOAaHi8%0D%0AZwjPk2YBxoqxhFLd8Kht2qnAyOht3SSLXvSG3mx1Cd1NfJGDWfjkFXv0omump%2FF1%0D%0AZEHr7MzgWCPROTfSaWaz1phQO%2BNNmba4lwS2KMMnlp76XQXhHqW3AVvSbtcZyj2i%0D%0APAL5Y3aJI%2BswMXe97IvyUW%2FM6GiBESoSOh4m5TTeEZfmwAT47H81w%2F%2FBRaEmUM92%0D%0A9Pq5kCTdizBOjf9OiZkthM3rTsWJJ9nc93UHCZ%2BTuyTsyDwxoSHJ32cRt2G9M%2Fhq%0D%0AYXNfh8Deh45Fgi8K4gj9KQJ25FUd%2F0mknDMxCva7EbW6oOADKBV3GlBN1RSyJSIt%0D%0A0LIVfVCgFtY1sPdrk8FGhsy7Z3jXb2kpYrUhbMwVGw1Jui4jdNVjsoxWy1Q8MZmP%0D%0AaLoiHGMnijnQXDw9SnyypB9nIhpMhnp2z%2FPlLU%2BJNo9NeO%2BupcQuINIeFDke1cBd%0D%0ASPGUhLMDjBPSBpz8irtRuSHo1QJSILtxKXCe5ifnFFps98dzaAYKL03fwQbWgShg%0D%0AIHfWuuUdE6sHm22lIZeNdN8PvDgJ6MPLuy26wz5dCJUc4s%2BS3XHIQ63jFAnTJ4ig%0D%0AQnvl6DquCWQnMIRejd7JCN%2FEspPLJ52ftT27xJxfg3b0sTeQLcRZflZU56Rj4j%2FP%0D%0AorxVsgze0frAA%2FFc52LJ9LrUiTv9hb27X5JqOtDZ35Qpq3bpPEghZtjOdGptKuB4%0D%0AA0c%2FcCzHwlZbJ7Aakqm2IG2gLOA%2BAqxJYOSSSMz5CjRQuHVXTv8gAK81JrPxM46t%0D%0ABUGVgAKNSbgzADaACDhxPL8GyBwb4ZhMZdCYHUanHGziS9rmhV5ynggidbF3Ssen%0D%0AvK1fvJT9%2F2d5JXQv%2B4TSv3b63nnm173yFS7cqLG3f38Mgz%2B89Vm3FHssKMkme1NH%0D%0AlWT5Q02bpDRmvhI8EIlDr5Fnj8pS6ck4i62fbdBZCaIE2jMUeonGtdqw3Ymy6Sn4%0D%0Ah2eEErVoJmDmesEpHglkFBcwze3XC6cysyx16hdDWJIbIueCbK57jgEC5%2BT4mJ1h%0D%0AsZJC2q7hzFagLcssdicr1w%3D%3D";
        const oJson = await client.processAfterPaymentResponse(strResponse);
        console.log(oJson);
        expect(oJson).to.be.an("object");
        expect(oJson.reference).equals("MIFACTURA001");
    });
});