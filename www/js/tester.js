/*Para reportar problemas a 'servidor'*/
var tester = {
	/*Enviar correo*/
	sendCorreo(sender, receiver, tema, msg){
		cordova.plugins.email.open({
		    to:      receiver,
		    subject: tema,
		    body:    msg
		});
	},
	sendCorreoDataLS(){
		const helados = fileSys.leer('data');
		const compras = fileSys.leer('compras');
		const ventas = fileSys.leer('ventas');
		const fechaVenta = localStorage.getItem('fechaVenta');
		const fechaCompra = localStorage.getItem('fechaCompra');

		let data = {
			helados,
			compras,
			ventas,
			fechaVenta,
			fechaCompra
		};

		try{
			data = JSON.stringify(data);
		}
		catch(ex){
			data = 'Datos de DB no se pudieron convertir con JSON.stringify';
		}
		// console.log(data); //DEBUG
		this.sendCorreo(null,'bryancalisto@yahoo.es','Data LS', data);
	},
	importarData(){
		const jsonStr = $('#crear').find('[data-tag="txtImportarData"').val();
		const data = JSON.parse(jsonStr);
		fileSys.escribir('data',data.helados);
		fileSys.escribir('compras',data.compras);
		fileSys.escribir('ventas',data.ventas);
		localStorage.getItem('fechaVenta',data.fechaVenta);
		localStorage.getItem('fechaCompra', data.fechaCompra);
	},
	paraPonerCostoEnRegistrosDeVentaVersionAntigua(){
		let data = opcReport.hallarEntreFechas('2020-06-10 10:48:00', '2020-06-30 10:48:00','ventas');

		if(data != null){
			for(let i = 0; i < data.length; i++){
				data[i].c = 1.00 * data[i].u;
			}

			const ventas = {
				ventas: data
			}

			if(fileSys.escribir('ventas',ventas)){
				alert('OK');
			}
			else{
				alert('Error al guardar información en base de datos');
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	}



}