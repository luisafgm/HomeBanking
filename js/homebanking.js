//Declaración de variables
var nombreUsuario = "Luisa Fernanda Giraldo Manrique";
var saldoCuenta = 10000;
var limiteExtraccion = 3500;
var pin=0000;

    //Lista de servicios inicial
    var listaServicios = [];
      var servicioAgua = ["Agua",450,];
      var servicioTelefono = ["Telefono",325,];
      var servicioLuz = ["Luz",396,];
      var servicioInternet = ["Internet",400, ];
    listaServicios.push(servicioAgua, servicioTelefono, servicioLuz,servicioInternet);

//Variables de inicio de sesión

var password = 0000;
var loginIntentosDisp = 3;

//Cuentas amigas iniciales
var cuentasAmigas = [];
    var cuentaAmiga1 = ["Alejandro", 1234567];
    var cuentaAmiga2 = ["Martín", 7654321];
cuentasAmigas.push(cuentaAmiga1,cuentaAmiga2);


//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
    iniciarSesion();
}


//Funciones que tenes que completar

    //CAMBIAR LÍMITE DE EXTRACCIÓN
    function cambiarLimiteDeExtraccion() {
        OldLimit = limiteExtraccion;
        newLimit = parseInt(prompt("Ingrese nuevo límite de extracción"));

        //Validaciones
        if (checkLimitMayora0(newLimit)){ 
            limiteExtraccion = newLimit;
            alert("Su nuevo límite de extracción es $"+ limiteExtraccion);
            actualizarLimiteEnPantalla();
        } else {
            alert("Error: El límite de extracción no es válido");
        }
    }

    //EXTRACCIÓN
    function extraerDinero(monto) {
            
        var montoRet = parseInt(prompt("Ingrese monto a retirar")) || 0;
            var successMessage = "La operación ha sido realizada exitosamente";
            var failMessage = "Error:";

        

            //Validaciones

            
            if (montoRet===0){
                failMessage += "\nEl monto a retirar no es válido";
            }

            if (!montoEspositivo(monto)) {
                return alert(" Debes ingresar solo numeros positivos");
            }

            if (!chequearLimite(montoRet)) {
                failMessage += "\nEl monto ingresado es mayor al límite de extracción";
            }
            
            if (!chequearExtSaldo(montoRet)) {
                failMessage += "\nEl monto ingresado es mayor a tu Saldo actual";
            }
            
            if(!chequearMultiplo100(montoRet)) {
                failMessage += "\nEl monto ingresado no es multiplo de 100";
            }
            
            
        var returnValue = failMessage === "Error:";


        if (returnValue) {
            restarSaldo(montoRet);
            actualizarSaldoEnPantalla();
            alert("Has extraido $"+ montoRet + ".\n Saldo anterior: $" + (saldoCuenta + montoRet) + ".\n Tu nuevo saldo es $" + saldoCuenta);
        } else { alert(failMessage)}
        return [returnValue, returnValue ? successMessage : failMessage];
        
       
    }

    //DEPÓSITO
    function depositarDinero() {
        var montoDep = parseInt(prompt("Ingresar monto a depositar"));
        if (montoDep >= 0){

        var saldoAnterior = saldoCuenta;
        saldoCuenta = saldoCuenta + montoDep
            actualizarSaldoEnPantalla();
            alert("Se ha depositado$ "+ montoDep + ".\n Saldo anterior: $" + (saldoCuenta - montoDep) + ".\n Tu nuevo saldo es $" + saldoCuenta);
            return true;
        } else {
            alert ("Error: El monto a depositar no es válido");
            return false;
        }

    }

    //PAGO SERVICIOS
    function pagarServicio() {

     //Armo string con lista de contactos
     var MensajeServicios= "Ingrese el número correspondiente al servicio que quieres abonar de la siguiente lista:";

        if(listaServicios.length>0) {
            for (x=0; x<listaServicios.length ; x++){
                MensajeServicios += "\n"+ (x+1) +". " +listaServicios[x][0] + " ($" + listaServicios[x][1] + ").";
            }
        } else {
                alert("No posees servicios registrados, por favor agrega uno nuevo desde el menú principal");
                return false;
        }
        var numeroServicio = parseInt(prompt(MensajeServicios)) || 0;
        var CostoServicio = listaServicios[(numeroServicio-1)][1];
        var ServicioNombre = listaServicios[(numeroServicio-1)][0]

        //Validaciones
        if (!chequearExtSaldo(CostoServicio)) {
            alert("\nEl costo del servicio a pagar excede tu Saldo actual");
            return false;
        } else {
            saldoCuenta = saldoCuenta - CostoServicio;
            alert("Ha pagado el servicio "+ ServicioNombre + " por $"+ CostoServicio + ".\n Saldo anterior: $" + (saldoCuenta + CostoServicio) + ".\n Tu nuevo saldo es $" + saldoCuenta);
            actualizarSaldoEnPantalla();
        }
    }

    function solicitarCuentaAmigaATransferir(cuentasAmigas) {
        //Armo string con lista de contactos
        var mensajeContactos= "Por favor seleccione la cuenta amiga para transferir:";
        for (x=0; x<cuentasAmigas.length ; x++){
            mensajeContactos += "\n"+ (x+1) +". " +cuentasAmigas[x][0];
        }
        var idCuentaSeleccionada = parseInt(prompt(mensajeContactos));
        if(idCuentaSeleccionada <=0 || idCuentaSeleccionada > cuentasAmigas.length) {
            alert("Cuenta inválida, por favor seleccione un numero entre 1 y "+(cuentasAmigas.length));
            return solicitarCuentaAmigaATransferir(cuentasAmigas);
        }

        return cuentasAmigas[idCuentaSeleccionada-1];
    }

    //TRANSFERENCIA DINERO
    function transferirDinero() {
        //Verificar si tiene cuentas amigas
        if(cuentasAmigas.length<=0) {
            alert("No posee contacto registrado, agrege uno nuevo en el menú principal");
            return false;
        }

        //Pido Monto a transferir
        var montoTrans = parseInt(prompt("Ingrese monto a transferir")) || 0;

        //Validacion 1: monto válido
        if (montoTrans<=0 || !chequearExtSaldo(montoTrans)){
            alert("El monto a transferir no es válido.\nPor favor ingresa un monto disponible en tu cuenta");
            return false;
        }
        

        var cuentaATransf = solicitarCuentaAmigaATransferir(cuentasAmigas);

        //Confirma operación
        var confTransf = confirm("Transferirá $"+montoTrans+ " a " + cuentaATransf[0] + " con número de cuenta "+ cuentaATransf[1]+ "\nDesea confirmar?")
        
        //Ejecución de la transferencia
        if (confTransf) {
            restarSaldo(montoTrans);
            alert("Has transferido $"+ montoTrans + " a "+ cuentaATransf[0] + ".\n Saldo anterior: $" + (saldoCuenta + montoTrans) + ".\n Tu nuevo saldo es $" + saldoCuenta);
            actualizarSaldoEnPantalla();
        } else {
            alert("La operación ha sido cancelada")
            return false;
        }
    }

    //INICIO SESIÓN
    function iniciarSesion() {
        nombreUsuario = prompt("Ingrese su nombre de usuario de HomeBanking");
        var codeEntered = parseInt(prompt("Ingrese su código de seguridad de HomeBanking")) || 0;
        //VALIDACIÓN CÓDIGO
        if (codeEntered === password){
            alert("Bienvenido/a " + nombreUsuario + ", ya puedes comenzar a operar.");
            cargarNombreEnPantalla();
        } else if (codeEntered === 0) {
            alert("El código ingresado no es válido. Deben ser 4 cifras numéricas");
            iniciarSesion();
        } else {
            if (loginIntentosDisp>1){
                loginIntentosDisp--;
                alert("Código incorrecto, tienes " + loginIntentosDisp + " restantes antes de que tu cuenta se bloquee.");
                iniciarSesion();
            } else {
            alert("Código incorrecto, tu dinero ha sido retenido por cuestiones de seguridad");
            saldoCuenta = 0;
            actualizarSaldoEnPantalla();
            actualizarSaldoEnU$sPantalla();
            cargarNombreEnPantalla();
            }
        }
    }

    //AGREGAR CONTACTO
    function agregarContacto(){
        var nombreCon = prompt("Ingrese nombre del contacto: ") || 0;
                //Validación 1: Existencia de usuario
                if (checkContactExist(cuentasAmigas,nombreCon)){
                    alert("El nombre de contacto ingresado ya existe, por favor intenta nuevamente.");
                    return false
                }

        var accountNum = parseInt(prompt("Ingrese numero de cuenta del contacto: ")) || 0;
                //Validación 2: Es un número de 7 cifras?
                if (countNumberDigits(accountNum)!=7){
                    alert("El número de cuenta ingresado no es válido.\nDebe contener 7 caracteres númericos.");
                    return false
                }


        AgregarAListaContacto(nombreCon,accountNum);
        alert("El contacto: " + nombreCon + " con número de cuenta: "+ accountNum + " ha sido agregado a tu lista.");
    }



    //AGREGAR SERVICIO
    function agregarServicio(){
        var NombreServicio = prompt("Ingrese el nombre del nuevo servicio: ") || 0;
                //Validación 1: Existencia del servicio
                console.log(NombreServicio);
                console.log(checkContactExist(listaServicios,NombreServicio));
                if (checkContactExist(listaServicios,NombreServicio)){
                    alert("El nombre de contacto ingresado ya existe, por favor intenta nuevamente.");
                    return false
                }

        var costo = parseInt(prompt("Ingrese el costo del servicio: ")) || 0;
        var NumRef = parseInt(prompt("Ingrese el número de referencia de pago del servicio: ")) || 0;

        addService(NombreServicio,costo,NumRef);
        alert("El servicio " + NombreServicio + " con número de referencia "+ NumRef + " ha sido agregado a tu lista para pagos.");
    }


//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
    document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
    document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
    document.getElementById("limite-extraccion").innerHTML = "Tu límite de extracción es: $ " + limiteExtraccion;
}


//Funciones de validación
function chequearLimite(monto) {
    return monto <= limiteExtraccion;
}

function montoEspositivo(monto) {
    return monto >= 0;
}

function chequearMultiplo100(monto) {
    return monto % 100 === 0;
}

function chequearExtSaldo(monto) {
    return monto <= saldoCuenta;
}

function checkLimitMayora0(limit){
    return limit >0;
}

function checkContactExist(arr, nombre){
    return arr.some(row => row.includes(nombre));
}


//Otras funciones
//Agregar Usuario
function AgregarAListaContacto(nombre,accountNum){
    var newContact = [nombre,accountNum]
    cuentasAmigas.push(newContact);
}


//Sumar dinero a la cuenta
function sumarSaldo(montoSumar){
    saldoCuenta = saldoCuenta + montoSumar;
}

//restar dinero a la cuenta
function restarSaldo(montoRestar){
    saldoCuenta = saldoCuenta - montoRestar;  
}


  