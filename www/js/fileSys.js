var fileSys = {
	inicData(){
		const data = {
			helados: []
		}

		const compras = {
			compras: []
		}

		const ventas = {
			ventas: []
		}
		
		if(localStorage.getItem('data') == undefined){
			try{
				localStorage.setItem('data', JSON.stringify(data));
			}
			catch(ex){
				alert('No se pudo crear base de datos (data)');
			}
		}

		if(localStorage.getItem('compras') == undefined){
			try{
				localStorage.setItem('compras', JSON.stringify(compras));
			}
			catch(ex){
				alert('No se pudo crear base de datos (compras)');
			}
		}

		if(localStorage.getItem('ventas') == undefined){
			try{
				localStorage.setItem('ventas', JSON.stringify(ventas));
			}
			catch(ex){
				alert('No se pudo crear base de datos (ventas)');
			}
		}

		if(localStorage.getItem('fechaCompra') == undefined){
			try{
				localStorage.setItem('fechaCompra', '');
			}
			catch(ex){
				alert('No se pudo crear base de datos (fechaCompra)');
			}
		}

		if(localStorage.getItem('fechaVenta') == undefined){
			try{
				localStorage.setItem('fechaVenta', '');
			}
			catch(ex){
				alert('No se pudo crear base de datos (fechaVenta)');
			}
		}
	},
	escribir(id,data){
		try{
			localStorage.setItem(id, JSON.stringify(data));
			return true;
		}
		catch(ex){
			return false;
		}
	},
	leer(id){
		try{
			return JSON.parse(localStorage.getItem(id));
		}
		catch(ex){
			return null;
		}
	},
	limpiarContabilidad(){
		if(!confirm('Estás segura?'))
			return;

		if(this.limpiarVentas() && this.limpiarCompras())
		{
			alert('OK');
		}
		else{
			alert('No se pudo limpiar los registros de contabilidad');
		}
	},
	limpiarVentas(){
		const ventas = {
			ventas: []
		}

		try{
			localStorage.setItem('ventas', JSON.stringify(ventas));
			return true;
		}
		catch(ex){
			return false;
		}
	},
	limpiarCompras(){
		const compras = {
			compras: []
		}

		try{
			localStorage.setItem('compras', JSON.stringify(compras));
			return true;
		}
		catch(ex){
			return false;
		}
	}
}