var opcReport = {
	cargarPantalla(){
		// Cargamos sabores de helado
		$('#selSabores').empty();
		$('#reportConsol').hide();
		$('#reportPorSabor').hide();

		// Seteamos fechas
		const fechaHoy = fecha.getSoloFecha();
		$('#dpFechaIni').val(fechaHoy);
		$('#dpFechaFin').val(fechaHoy);

		// Seteamos horas
		$('#hpFechaIni').val('00:00');
		$('#hpFechaFin').val('23:59');


		let data = fileSys.leer('data');
		if(data != null){
			let html = '';

			if(data.helados.length == 0){
				alert('Primero registre los heladitos');
				return;
			}

			html += '<option value="Todos">Todos</option>';

			for(let i = 0; i < data.helados.length; i++){
				// Creamos divs de helados
				html += '<option value="' + data.helados[i].n + '">' + data.helados[i].n + '</option>'
			}

			$('#selSabores').append(html);
        	$('#report').show();
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	},
	cargarReporte(){
		let fechaIni = $('#dpFechaIni').val().trim();
		let fechaFin = $('#dpFechaFin').val().trim();
		const horaIni = $('#hpFechaIni').val().trim();
		const horaFin = $('#hpFechaFin').val().trim();
		const nombreHelado = $('#selSabores :selected').val();
		// const nombreHelado = 'crema'; // DEBUG


		if(fechaIni == '' || fechaFin == '' || horaIni == '' || horaFin == ''){
			alert('Ingrese fechas y horas, por favor');
			return;
		}

		fechaIni = fechaIni + ' ' + horaIni + ':00';
		fechaFin = fechaFin + ' ' + horaFin + ':00';

		//DEBUG START
		// fechaIni = '2020-06-13 10:48:00';
		// fechaFin = '2020-06-14 16:55:00';

		// this.hallarEntreFechas(fechaIni, fechaFin, 'compras');
		// return;
		// DEBUG END


		// Vaciamos secciones donde se append nueva informacion
		$('#reportConsol').hide();
		$('#reportConsol').find('[data-tag="bloquesSabores"]').empty();
		$('#reportConsol').find('[data-tag="infoContable"]').empty();
		$('#reportPorSabor').hide();
		$('#reportPorSabor').empty();	

		// Reporte de todos los sabores
		if(nombreHelado == 'Todos'){ 
			let dataVendidosConsol = this.hallarEntreFechas(fechaIni, fechaFin,'ventas');
			let dataCompradosConsol = this.hallarEntreFechas(fechaIni, fechaFin,'compras');

			//DEBUG START
			// dataVendidosConsol = [
			// 	{
			// 		n: 'crema',
			// 		u: 3,
			// 		v: 3,
			// 		c: 1.50,
			// 		f: '2020-06-14 11:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 2,
			// 		v: 2,
			// 		c: 1,
			// 		f: '2020-06-14 11:15:00'
			// 	},
			// 	{
			// 		n: 'azucarrr r rrrrr rr',
			// 		u: 5,
			// 		v: 5,
			// 		c: 2.50,
			// 		f: '2020-06-14 12:00:00'
			// 	},
			// 	{
			// 		n: 'azucarrr r rrrrr rr',
			// 		u: 2,
			// 		v: 2,
			// 		c: 1,
			// 		f: '2020-06-14 12:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 2,
			// 		v: 2,
			// 		c: 1,
			// 		f: '2020-06-14 12:15:00'
			// 	},
			// ];

			// dataCompradosConsol = [
			// 	{
			// 		n: 'crema',
			// 		u: 4,
			// 		v: 2,
			// 		f: '2020-06-13 11:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 4,
			// 		v: 2,
			// 		f: '2020-06-13 11:01:00'
			// 	},
			// 	{
			// 		n: 'azucar',
			// 		u: 5,
			// 		v: 2.50,
			// 		f: '2020-06-13 12:02:00'
			// 	},
			// ];

			// console.log(dataVendidosConsol);
			// console.log('comprados: ');
			// console.log(dataCompradosConsol);
			//DEBUG END

			if(dataVendidosConsol.length == 0)
			{
				alert('No se han registrado ventas');
				return;
			}

			// Obteenemos los mas y menos vendidos
			let contadores = [];
			let mayor = {
				n: '', // nombre
				s: 0, // unidades (antes era stock)
				v: 0, // valor
				c: 0 // costo
			};
			let menor = {
				n: '',
				s: 99999999,
				v: 0,
				c: 0
			};

			for(let i = 0; i < dataVendidosConsol.length; i++){
				console.log(dataVendidosConsol[i]);

				let yaIncluido = false;
				for(let j = 0; j < contadores.length; j++){
					if(contadores[j].n == dataVendidosConsol[i].n){
						yaIncluido = true;
						// Sume las ventas y costo
						contadores[j].s = Number(contadores[j].s) + dataVendidosConsol[i].u; // unidades
						contadores[j].v = Number(contadores[j].v) + dataVendidosConsol[i].v; // valor ventas
						contadores[j].c = Number(contadores[j].c) + dataVendidosConsol[i].c; // costo
						break;
					}
				}

				// Si sabor no se ha incluido en contadores todavia
				if(!yaIncluido){
					let nuevo = {
						n: dataVendidosConsol[i].n,
						s: dataVendidosConsol[i].u,
						v: dataVendidosConsol[i].v,
						c: dataVendidosConsol[i].c
					}
					contadores.push(nuevo);
				}
			}

			for(let i = 0; i < contadores.length; i++){
				if(Number(contadores[i].s) < Number(menor.s)){
					menor.n = contadores[i].n;
					menor.s = contadores[i].s;
					menor.v = contadores[i].v;
					menor.c = contadores[i].c;
				}
				if(Number(contadores[i].s) > Number(mayor.s)){
					mayor.n = contadores[i].n;
					mayor.s = contadores[i].s;
					mayor.v = contadores[i].v;
					mayor.c = contadores[i].c;
				}
			}

			// Sacamos informacion contable
			datosContables = {
				uniComp: 0, // unidades compradas
				uniVend: 0, // unidades vendidas
				costo: 0, // costo total de unidades vendidas
				ventas: 0 // valor ventas
			}

			for(let i = 0; i < dataVendidosConsol.length; i++){
				datosContables.ventas += dataVendidosConsol[i].v;
				datosContables.costo += dataVendidosConsol[i].c; // Comentar si desea volver a version anteior
				datosContables.uniVend += dataVendidosConsol[i].u;
			}

			for(let i = 0; i < dataCompradosConsol.length; i++){
				// datosContables.costo += dataCompradosConsol[i].v; // Descomentar si desea volver a la ver ant
				datosContables.uniComp += dataCompradosConsol[i].u;
			}

			// Mostramos reporte
			$('#reportConsol').find('[data-tag="infoContable"]').append('<div class="bloqueSaborReporte">'+
				'<label><img src="img/numbers.png">Comprados: ' + datosContables.uniComp + ' helados</label><br/>' +
				'<label><img src="img/numbers.png">Vendidos:  ' + datosContables.uniVend + ' helados</label><br/>' +
				'<label><img src="img/moneybag.png">Costo: $ ' + datosContables.costo.toFixed(2) + '</label><br/>' +
				'<label><img src="img/moneybag.png">Venta: $ ' + datosContables.ventas.toFixed(2) + '</label><br/>' +
				'<label><img src="img/moneybag.png">Utilidad: $ ' + (datosContables.ventas - datosContables.costo).toFixed(2) + '</label>' +
				'</div>');


			// Bloques de cada sabor
			let html = '';
			contadores.forEach(elem =>{
				html += '<div class="bloqueSaborReporte">'+
				'<label style="background-color:pink;">' + elem.n + '</label><br/>' +
				'<label><img src="img/numbers.png"> ' + elem.s + ' unidades vendidas</label><br/>' +
				'<label><img src="img/moneybag.png"> $ ' + elem.v.toFixed(2) + ' de ganancia</label>' +
				'</div>';
			});

			// Mostramos reporte
			$('#reportConsol').find('[data-tag="bloquesSabores"]').append(html);
			$('#reportConsol').find('[data-tag="masVend"]').val(mayor.n + ' / ' + mayor.s + ' unidades / $ ' + mayor.v.toFixed(2));
			$('#reportConsol').find('[data-tag="menosVend"]').val(menor.n + ' / ' + menor.s + ' unidades / $ ' + menor.v.toFixed(2));
			$('#reportConsol').show();
		}

		// Reporte de un solo sabor
		else{
			let dataVendidosConsol = this.hallarEntreFechas(fechaIni, fechaFin,'ventas');
			let dataCompradosConsol = this.hallarEntreFechas(fechaIni, fechaFin,'compras');

			//DEBUG START
			// dataVendidosConsol = [
			// 	{
			// 		n: 'crema',
			// 		u: 3,
			// 		v: 3,
			// 		c: 1.50,
			// 		f: '2020-06-14 11:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 2,
			// 		v: 2,
			// 		c: 1,
			// 		f: '2020-06-14 11:15:00'
			// 	},
			// 	{
			// 		n: 'azucarrr r rrrrr rr',
			// 		u: 5,
			// 		v: 5,
			// 		c: 2.50,
			// 		f: '2020-06-14 12:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 1,
			// 		v: 2,
			// 		c: 1,
			// 		f: '2020-06-14 12:15:00'
			// 	},
			// ];

			// dataCompradosConsol = [
			// 	{
			// 		n: 'crema',
			// 		u: 4,
			// 		v: 2,
			// 		f: '2020-06-13 11:00:00'
			// 	},
			// 	{
			// 		n: 'limon',
			// 		u: 4,
			// 		v: 2,
			// 		f: '2020-06-13 11:01:00'
			// 	},
			// 	{
			// 		n: 'azucar',
			// 		u: 5,
			// 		v: 2.50,
			// 		f: '2020-06-13 12:02:00'
			// 	},
			// ];

			// console.log(dataVendidosConsol);
			// console.log('comprados: ')
			// console.log(dataCompradosConsol)
			// DEBUG END

			if(dataVendidosConsol.length == 0)
			{
				alert('No se han registrado ventas');
				return;
			}

			datosContables = {
				uniComp: 0, // unidades compradas
				uniVend: 0, // unidades vendidas
				costo: 0, // costo total de las unidades vendidas
				ventas: 0 // valor ventas
			}

			for(let i = 0; i < dataVendidosConsol.length; i++){
				if(dataVendidosConsol[i].n == nombreHelado){
					datosContables.ventas += dataVendidosConsol[i].v;
					//datosContables.costo += dataVendidosConsol[i].c; // Comtente si desea volver a la version anterior
					datosContables.uniVend += dataVendidosConsol[i].u;
				}
			}

			for(let i = 0; i < dataCompradosConsol.length; i++){
				if(dataCompradosConsol[i].n == nombreHelado){
					datosContables.costo += dataCompradosConsol[i].v; // Descomente para volver a la version anterior
					datosContables.uniComp += dataCompradosConsol[i].u;
				}
			}

			// Mostramos reporte
			$('#reportPorSabor').append('<div class="bloqueSaborReporte">'+
				'<label style="background-color:pink;">' + nombreHelado + '</label><br/>' +
				'<label><img src="img/numbers.png">Comprados: ' + datosContables.uniComp + ' helados</label><br/>' +
				'<label><img src="img/numbers.png">Vendidos:  ' + datosContables.uniVend + ' helados</label><br/>' +
				'<label><img src="img/moneybag.png">Costo: $ ' + datosContables.costo.toFixed(2) + '</label><br/>' +
				'<label><img src="img/moneybag.png">Venta: $ ' + datosContables.ventas.toFixed(2) + '</label><br/>' +
				'<label><img src="img/moneybag.png">Utilidad: $ ' + (datosContables.ventas - datosContables.costo).toFixed(2) + '</label>' +
				'</div>');

			$('#reportPorSabor').show();
		}
	},
	hallarEntreFechas(fIni,fFin,tabla){ // tabla = ventas o compras
		const data = fileSys.leer(tabla);
		
		try{
			fIni = new Date(fIni);
			fFin = new Date(fFin);
		}
		catch(ex){
			return null;
		}

		if(data == null){
			return null;
		}

		let dataClasif = [];
		
		for(let i = 0; i < data[tabla].length; i++){
			let f = new Date(data[tabla][i].f);

			// Si esta en el rango, agrega a nuevo dataset
			if(f >= fIni && f <= fFin){
				dataClasif.push(data[tabla][i]);
			}
		}

		return dataClasif;
	},
	/*Devuelve data totalizada por sabor segun cuenta de ventas o compras*/
	obtenerDataPorSabor(nombre,lista,tipo){ // lista = lista de compras o ventas ya depuradas por rango de fechas. tipo = "ventas" o "compras"

		let data = null;

		if(tipo === 'ventas'){
			data = {
				n: 0,
				ventas: 0
			}

			lista.forEach(elem => {
				if(elem.n == nombre){
					data.n++;
					data.ventas += elem.p; // p = valor de la venta
				}
			});
		}
		else if(tipo === 'compras'){
			data = {
				n: 0,
				costo: 0,
			}

			lista.forEach(elem => {
				if(elem.n == nombre){
					data.n++;
					data.costo += elem.p; // p = valor de la compra
				}
			});
		}

		return data;
	},
	/*Devuelve data totalizada de todos los sabores segun cuenta de ventas o compras*/
	obtenerDataConsol(nombre,lista,tipo){ // lista = lista de compras o ventas ya depuradas por rango de fechas. tipo = "ventas" o "compras"

		let data = null;

		if(tipo === 'ventas'){
			data = {
				n: 0,
				ventas: 0
			}

			lista.forEach(elem => {
				data.n++;
				data.ventas += elem.p; // p = valor de la venta
			});
		}
		else if(tipo === 'compras'){
			data = {
				n: 0,
				costo: 0,
			}

			lista.forEach(elem => {
				data.n++;
				data.costo += elem.p; // p = valor de la compra
			});
		}

		return data;
	},
}