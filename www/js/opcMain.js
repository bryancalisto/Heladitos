var opcMain = {
	cargarPantalla(){
		$('#main').find('[data-tag="helados"]').empty(); // Limpiamos lista de helados

		let data = fileSys.leer('data');
		if(data != null){
			let html = '';

			if(data.helados.length == 0){
				alert('Primero registre los heladitos');
				return;
			}

			// Seteamos fechas de ultima compra y venta
			helado.getFechaCompra();
			helado.getFechaVenta();

			for(let i = 0; i < data.helados.length; i++){
				// Creamos divs de helados
				html += '<li><div class="helado"><h4 class="helado-nombre">' + data.helados[i].n + '</h4>' +
				'<b class="helado-precio" data-id="' + data.helados[i].n + '" onclick="helado.cambiarDatos(this)">$' + data.helados[i].p + '</b><br/>' +
				'<input data-id="' + data.helados[i].n + '" type="number" style="width:40px; margin-left: 15px; box-shadow:none !important;" min="0" max="100">' +
				'<img data-id="' + data.helados[i].n + '" class="restar" src="img/vender.png" style="margin-left:10px;" onclick="helado.disminuirHelado(this)">' +
				'<img data-id="' + data.helados[i].n + '" class="restarFree" src="img/menos.png" style="margin-left:10px;" onclick="helado.disminuirHeladoFree(this)">' +
				'<img data-id="' + data.helados[i].n + '" class="sumarFree" src="img/mas.png" style="margin-left:10px;" onclick="helado.aumentarHeladoFree(this)">' +
				'<img data-id="' + data.helados[i].n + '" class="sumar" src="img/comprar.png" style="margin-left:10px;" onclick="helado.aumentarHelado(this)">' +
				'<label data-hay="' + data.helados[i].n + '" class="helado-hay">Hay: ' + data.helados[i].s + 
				'</label></div></li>';
			}

			$('#main').find('[data-tag="helados"]').append(html);
        	$('#main').show();
		}
		else{
			alert('Error al leer información de la base de datos');
		}
	}

}