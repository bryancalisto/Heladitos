var opcCrear = {
	limpiarCampos(){
		$('#sabor').val('');
		$('#costo').val('');
		$('#precio').val('');
	},
	cargarPantalla(){
		this.limpiarCampos();
        $('#crear').show();
	}
}