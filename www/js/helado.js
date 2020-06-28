var helado = {
	stock: 0,
	crearTipoHelado(){

		const nombre = $('#sabor').val().trim().replace(',','.');
		const costo = $('#costo').val().trim().replace(',','.');
		const precio = $('#precio').val().trim().replace(',','.');

		// console.log(nombre + costo + precio);

		if(nombre == '' || costo == '' || precio == ''){
			alert('Ingrese todos los datos');
			return;
		}

		// Creamos perfil de helado
		const nuevo = {
			n: nombre,
			c: costo,
			p: precio,
			s: 0	// Stock
		}

		// Actualizamos lista de helados
		let data = fileSys.leer('data');
		if(data != null){
		// Revisamos que helado no se repita
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					alert('Sabor ya registrado');
					return;
				}
			}
			
			data.helados.push(nuevo);
			if(fileSys.escribir('data',data)){
				alert('OK');
				opcCrear.limpiarCampos();
			}
			else{
				alert('Error al guardar información en base de datos');
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	},
	// Permite cambiar costo y precio de un helado
	cambiarDatos(elem){
		const nombre = elem.dataset.id;

		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					let nuevoCosto = prompt('Nuevo costo', data.helados[i].c);
					let nuevoPrecio = prompt('Nuevo precio', data.helados[i].p);

					if(nuevoCosto == undefined || nuevoPrecio == undefined)
						return;

					nuevoCosto = nuevoCosto.replace(',','.').trim();
					nuevoPrecio = nuevoPrecio.replace(',','.').trim();

					var decimal=  /^[0-9]+\.[0-9]+$/;
					if(!nuevoCosto.match(decimal) || !nuevoPrecio.match(decimal))
					{
						alert('Formato incorrecto. Ejemplos: 1.00, 0.50');
						return;
					}

					// Actualizamos precio y costo
					data.helados[i].c = nuevoCosto;
					data.helados[i].p = nuevoPrecio;

					if(!fileSys.escribir('data',data)){
						alert('Error al actualizar datos');
						return;
					}

					opcMain.cargarPantalla();
					alert('OK');
					break;
				}
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}

	},
	aumentarHelado(elem){ // COMPRAS
		if(!confirm('Confirme'))
			return;
		// Obtenemos data
		const nombre = elem.dataset.id;
		let q = $('input[data-id="' + nombre + '"]').val().trim();
		q = q.replace('-','');
		q = q.replace('+','');
		q = q.replace('ˆ','');
		q = q.replace('.','');
		q = q.replace(',','');

		if(q == ''){
			q = 1;
		}
		else{
			q = Number(q);
		}

		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					// Actualizamos cantidad y grabamos
					data.helados[i].s = Number(data.helados[i].s) + Number(q);

					// Registre compra
					let valorCompra = Number(data.helados[i].c) * q; // Costo x cantidad comprada
					//console.log('valCompra: ' + valorCompra);

					if(!this.registCompra(data.helados[i].n, valorCompra, q)){
						alert('Error al registrar compra');
						return;
					}

					if(!fileSys.escribir('data',data)){
						alert('Error al actualizar stock');
						return;
					}

					$('[data-hay="' + nombre + '"]').text('Hay: ' + data.helados[i].s);
					$('input[data-id="' + nombre + '"]').val('');

					// Actualizamos fecha de ultima compra
					this.setFechaCompra();

					// Actualizamos stock
					this.stock += Number(q);
					opcMain.actStock();

					break;
				}
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	},
	disminuirHelado(elem){ // VENTAS
		if(!confirm('Confirme'))
			return;
		// Obtenemos data
		const nombre = elem.dataset.id;
		//console.log('input[data-id="' + nombre + '"]');
		let q = $('input[data-id="' + nombre + '"]').val().trim();
		q = q.replace('-','');
		q = q.replace('+','');
		q = q.replace('ˆ','');
		q = q.replace('.','');
		q = q.replace(',','');

		if(q == ''){
			q = 1;
		}
		else{
			q = Number(q);
		}

		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					// Actualizamos cantidad y grabamos
					data.helados[i].s = Number(data.helados[i].s) - Number(q); 

					if(Number(data.helados[i].s) < 0){
						return;
					}

					// Registre venta
					let valorVenta = Number(data.helados[i].p) * q; // Precio x cantidad vendida
					let valorCompra = Number(data.helados[i].c) * q; // Costo x cantidad vendida
					//console.log('val: ' + valorVenta);

					if(!this.registVenta(data.helados[i].n, valorVenta, valorCompra, q)){
						alert('Error al registrar venta');
						return;
					}

					if(!fileSys.escribir('data',data)){
						alert('Error al actualizar stock');
						return;
					}

					$('[data-hay="' + nombre + '"]').text('Hay: ' + data.helados[i].s);
					$('input[data-id="' + nombre + '"]').val('');

					// Actualizamos fecha de ultima venta
					this.setFechaVenta();

					// Actualizamos stock
					this.stock -= Number(q);
					opcMain.actStock();

					break;
				}
			}
		}

		else{
			alert('Error al leer información de la base de datos');
		}
	},
	// Disminuye helado, pero no registra en ventas
	disminuirHeladoFree(elem){ 
		// Obtenemos data
		const nombre = elem.dataset.id;
		//console.log('input[data-id="' + nombre + '"]');
		let q = $('input[data-id="' + nombre + '"]').val().trim();
		q = q.replace('-','');
		q = q.replace('+','');
		q = q.replace('ˆ','');
		q = q.replace('.','');
		q = q.replace(',','');

		if(q == ''){
			q = 1;
		}
		else{
			q = Number(q);
		}

		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					// Actualizamos cantidad y grabamos
					data.helados[i].s = Number(data.helados[i].s) - Number(q); 

					if(Number(data.helados[i].s) < 0){
						return;
					}

					if(!fileSys.escribir('data',data)){
						alert('Error al actualizar stock');
						return;
					}

					$('[data-hay="' + nombre + '"]').text('Hay: ' + data.helados[i].s);
					$('input[data-id="' + nombre + '"]').val('');

					// Actualizamos stock
					this.stock -= Number(q);
					opcMain.actStock();

					break;
				}
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	},
	// Aumenta helado, pero no registra en compras (devolucion, etc)
	aumentarHeladoFree(elem){ 
		// Obtenemos data
		const nombre = elem.dataset.id;
		//console.log('input[data-id="' + nombre + '"]');
		let q = $('input[data-id="' + nombre + '"]').val().trim();
		q = q.replace('-','');
		q = q.replace('+','');
		q = q.replace('ˆ','');
		q = q.replace('.','');
		q = q.replace(',','');

		if(q == ''){
			q = 1;
		}
		else{
			q = Number(q);
		}

		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				if(data.helados[i].n == nombre){
					// Actualizamos cantidad y grabamos
					data.helados[i].s = Number(data.helados[i].s) + Number(q); 

					if(!fileSys.escribir('data',data)){
						alert('Error al actualizar stock');
						return;
					}

					$('[data-hay="' + nombre + '"]').text('Hay: ' + data.helados[i].s);
					$('input[data-id="' + nombre + '"]').val('');

					// Actualizamos stock
					this.stock += Number(q);
					opcMain.actStock();

					break;
				}
			}
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	},
	registVenta(nombre,valorVenta,valorCompra,unidades){
		const now = fecha.now();

		const nueva = {
			n: nombre,
			u: unidades,
			v: valorVenta,
			c: valorCompra,
			f: now
		}

		let data = fileSys.leer('ventas');

		if(data != null){
			data.ventas.push(nueva);
			if(fileSys.escribir('ventas',data)){
				return true;
			}
		}

		return false;
	},
	registCompra(nombre,valor,unidades){
		const now = fecha.now();

		const nueva = {
			n: nombre,
			u: unidades,
			v: valor,
			f: now
		}

		let data = fileSys.leer('compras');

		if(data != null){
			data.compras.push(nueva);
			if(fileSys.escribir('compras',data)){
				return true;
			}
		}

		return false;
	},
	getFechaCompra(){
		let data = localStorage.getItem('fechaCompra');
		if(data == undefined)
			data = 'No disponible';

		$('#main').find('[data-tag="fUltCompra"]').text('Última compra:   ' + data);
	},
	setFechaCompra(){
		localStorage.setItem('fechaCompra', fecha.now());
		$('#main').find('[data-tag="fUltCompra"]').text('Última compra:   ' + fecha.now());
	},
	getFechaVenta(){
		let data = localStorage.getItem('fechaVenta');
		if(data == undefined)
			data = 'No disponible';

		$('#main').find('[data-tag="fUltVenta"]').text('Última venta:   ' + data);
	},
	setFechaVenta(){
		localStorage.setItem('fechaVenta', fecha.now());
		$('#main').find('[data-tag="fUltVenta"]').text('Última venta:   ' + fecha.now());
	},
	/*Cuenta stock de helados existente*/
	countStock(){
		let data = fileSys.leer('data');
		if(data != null){
			for(let i = 0; i < data.helados.length; i++){
				// Actualizamos cantidad y grabamos
				this.stock += data.helados[i].s;
			}
		}
		else{
			alert('Error al leer stock');
		}
	}

}