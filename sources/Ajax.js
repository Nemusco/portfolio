function Constructor(){
	if( window.ActiveXObject ){
		const versions = new Array(
			'Msxml2.XMLHTTP.5.0',
			'Msxml2.XMLHTTP.4.0',
			'Msxml2.XMLHTTP.3.0',
			'Msxml2.XMLHTTP',
			'Microsoft.XMLHTTP'
			);

		for(let i=0;i < versions.length;++i){
			try{
				return new ActiveXObject(versions[i]);
			}
			catch(e){
				/* Todavia no me decido que rutinas poner */
			}
		}
	}
	else if( window.XMLHttpRequest ) return new XMLHttpRequest();
	throw new Error("We cant use Ajax on this environment");
}

function Ajax(){
	this.xmlHttpRequest = Constructor();
}

	/* Estos 7 metodos son los metodos de mi objeto Ajax...
	El metodo RequestData ira llamando a cada uno de los demas metodos de mi objeto a medida que vaya cambiando
	el estado de mi peticion...
	No usare eventos del objeto debido a incompatibilidad */
	function RequestData(method = "GET"|"POST",url,format = "xml"|"text",data = null){
		const currentAjax = this;
		let status,response,message;

		this.xmlHttpRequest.open(method,url,true);

		this.xmlHttpRequest.onreadystatechange = function (){
			status = currentAjax.xmlHttpRequest.status;
			message = currentAjax.xmlHttpRequest.statusText;
			
			switch(currentAjax.xmlHttpRequest.readyState){
				//Conexion con el servidor establecida
				case 1: currentAjax.starting(); break;
				//Cuando la peticion es recibida puedo obtener el status de esta
				case 2:
				//cuando hay un redireccionamiento
				//Cuando hay errores en la peticion del lado del cliente
				//Cuando hay errores en la peticion del lado del servidor
				if( (status >= 300 && status <= 308) ){
					currentAjax.redirection(status);
					currentAjax.xmlHttpRequest.abort();
				}

				if( (status >= 400 && status <= 417) ){
					currentAjax.clientError(status,message);
					currentAjax.xmlHttpRequest.abort();
				}

				if( ( status >= 500 && status <= 511 ) ){
					currentAjax.serverError(status,message);
					currentAjax.xmlHttpRequest.abort();
				}
				break;
				//Cuando se esta transmitiendo la respuesta
				case 3: currentAjax.receiving(); break;
				//Cuando la respuesta esta completamente cargada
				case 4:
				//Si la respuesta ha sido realizada correctamente
				if( status >= 200 && status <= 206 ){
					response = (format === "xml") 
					? currentAjax.xmlHttpRequest.responseXML 
					: currentAjax.xmlHttpRequest.responseText;

					currentAjax.ready(status,message,response);
				}
				break; 
			}
		}
		//Cuando quiero enviar algo la peticion solo puede ser POST y no GET
		if( data && method === "POST" ){
			data = createSetData(data);
			this.xmlHttpRequest.send(data);
		}
		else this.xmlHttpRequest.send(null);
	}
	/* Estos 3 metodos seran prototipos, esto es ya que en cada aplicacion que hagamos queremos adaptarlas a las
	necesidades que esta tenga, por eso solo se indican los parametros que estas deben recibir */
	function Starting(){}

	function Receiving(){}

	function Ready(status, statusText,response){}

	/*Estos 3 metodos manejan eventos inesperados(Error del cliente, error del servidor y redireccionamiento)*/
	function ClientError(status,statusText){}

	function ServerError(status,statusText){}

	function Redirection(status){}

	/* Aqui declaro prototipos, estos prototipos deben tener sus parametros a recibir especificados */
	Ajax.prototype.request = RequestData;
	Ajax.prototype.starting = Starting;
	Ajax.prototype.receiving = Receiving;
	Ajax.prototype.ready = Ready;
	Ajax.prototype.clientError = ClientError;
	Ajax.prototype.serverError = ServerError;
	Ajax.prototype.redirection = Redirection;

	//Con el bucle dentro de esta funcion obtengo el indice y valor de los elementos dentro de un arreglo asociativo
	//Para agregarlos como elementos "nombre":"valor" a mi objeto FormData... Siempre debo usar un objeto FormData
	//Para pasar informacion al servidor
	function createSetData(data){
		const setData = new FormData();

		//El metodo append añade un campo a mi FormData
		for(assocIndex in data) setData.append(assocIndex,data[assocIndex]);
		return setData;
	}