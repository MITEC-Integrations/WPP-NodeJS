# WebPay Plus Library

SDK WebPay Plus es un modulo nodeJs para facilitar la integracion al generador de ligas.

## Instalación

Para compilar y dar mantenimiento al proyecto

```bash
npm install
```

## Estructura del proyecto.

El código fuente esta implementado en `Typescript`.

**WppClient** es la clase encargada de armar y procesar la petición para la generacion de ligas.

El folder **models** tiene la definición de interfaces que definen el contrato de implementación y armado de los objetos para generar la cadena XML.

El folder **validators** incluye reglas de validación básicas requeridas para determinar si el objeto puede ser enviado al generador de ligas. 
La documentación de los datos requeridos se pueden encontrar en el sandbox de [Pagos Online](https://sandboxpol.mit.com.mx/generar).

El folder **builders** incluye clases que permiten que los usuarios de `Nodejs` puedan crear la solicitud de generación de ligas de una forma más intuitiva (Ambas formas pueden ser usadas desde los dos lenguajes).

Finalmente, **test** incluye pruebas unitarias del proyecto, puede ejecutarse con `npm run test`

## Construcción del proyecto.
Para compilar el proyecto y generar el artefacto que será usado por los integradores solo es necesario ejecutar `npm run buildFull`, al finalizar la ejecución se creará la carpeta **dist/cjs** y **dist/types** que contienen todos los elementos que se publicaran en el *repositorio npm*.

La carpeta *dist/types* es la declaración de tipos necesaria para proyectos *Typescript*. La carpeta *dist/cjs/* contiene los javascript de ejecución.

## Publicación
Para publicar el modulo es necesario ejecutar los siguientes pasos:

1. `npm run prepare` creará la carpeta de distribución.
2. `npm run prepublishOnly` ejecuta las pruebas unitarias y el análisis de código estático.
3. `npm run version` agrega al índice de git los cambios faltantes. Se realiza antes de  ejecutar un `git commit`.
4. `npm run postversion` se invoca despues de un *commit*, ejecutando un push de los commit pendientes y de los tags.

A continuación, si ya tienes una cuenta *NPM* ejecuta `npm login` para acceder; finalmente ejecuta `npm publish` para publicar el modulo en *NPM*.


## Uso
El modulo esta implementado para trabajar con *NodeJs lts/Fermium (-> v14.20.0)* o superior.

Se muestran ejemplos de uso para `Typescript` y `NodeJs`. Es importante observar que este modulo no debe ser utilizado en Angular pues la llave de cifrado puede quedar expuesta.

### Typescript

Usando `Typescript`, se debe declarar un objeto de tipo *PaymentData* y capturar los datos proporcionados por **MIT**. Posteriormente, se crea una instancia de *WppClient* proporcionando el *endpoint*, *identificador de pagos* y *llave de cifrado* en **hexadecimal**



```typescript
import { WppClient } from "./wppClient";
import { PaymentData } from './models/Interfaces';

function invoke() {
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
        }
    }

    let client: WppClient = new WppClient("https://sandboxpo.mit.com.mx/gen", "SNDBX123", "5DCC67393750523CD165F17E1EFADD21");
    client.getUrlPayment(payment).then(console.log).catch(console.log);
}
```

### Node JS

Con `Node JS` se puede importar la clase *PaymentBuilder*. Esta clase nos permite crear la solicitud de una manera mas intuitiva, ya que contiene los métodos constructores necesarios para formar el objeto de generación de liga.

```javascript
const wppClient = require("./wppClient");
const PaymentBuilder = require("./builders/PaymentBuilder");

function invokeWithBuilder() {
    const payment = new PaymentBuilder().paymentMethod("TCD")
        .withBusiness().idCompany("SNBX").idBranch("01SNBXBRNCH").user("SNBXUSR0123").password("SECRETO")
        .and()
        .withUrl().amount(10).reference("FACTURA999").currency("MXN").omitNotification(1)
        .and().build();
    let client = new WppClient("https://sandboxpo.mit.com.mx/gen", "SNDBX123", "5DCC67393750523CD165F17E1EFADD21");
    client.getUrlPayment(payment).then(console.log).catch(console.log);
}
invokeWithBuilder();
```

## Webhook o Http Callback
El **comercio** debe exponer un *http callback* o *URI endpoint* que le permita conocer si el pago del cliente fue **aprobado** o **declinado** y aplicar la lógica correspondiente a su negocio.

Para descifrar el mensaje, se puede utilizar el método `processAfterPaymentResponse` de la clase `WppClient`

```javascript
function afterPayment() {
    const response = "otB4VyAtYh5bW4IeVhM30125kqfmzVxxDlFQRZHCUroq6e1MSISChhDstN1gKKnA%0D%0AOs%2Bdgr...";
    //const response = request.params["strResponse"];
    client.processAfterPaymentResponse(response).then(console.log).catch(console.error);
}
afterPayment();
```

## License
[MIT](https://choosealicense.com/licenses/mit/)