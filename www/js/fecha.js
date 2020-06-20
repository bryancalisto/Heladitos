var fecha = {
	now(){
		const hoy = new Date();
	    const dd = String(hoy.getDate()).padStart(2, '0');
		const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0.
		const yyyy = hoy.getFullYear();
		const h = String(hoy.getHours()).padStart(2, '0');
		const m = String(hoy.getMinutes()).padStart(2, '0');
		const s = String(hoy.getSeconds()).padStart(2, '0');

		return yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
	},
	getSoloFecha(){
		const hoy = new Date();
	    const dd = String(hoy.getDate()).padStart(2, '0');
		const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0.
		const yyyy = hoy.getFullYear();

		return yyyy + '-' + mm + '-' + dd;
	}
}