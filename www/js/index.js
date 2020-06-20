var app = {
    go() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady() {
        // Inicializamos localStorage
        fileSys.inicData();

        // Inicializamos pantalla principal
        opcMain.cargarPantalla();

        // Cargamos datepickers
        $("#dpFechaIni").datepicker({ 
            defaultDate: "+0d",
            dateFormat: "yy-mm-dd",
          });
        $("#dpFechaFin").datepicker({ 
            defaultDate: "+0d",
            dateFormat: "yy-mm-dd",
          });

        // Para permitir arrastrar y recolocar divs de sabores
        $('#sortable').sortable();
        $('.helado').draggable();

        // Eventos MENU
        $('#menu').find('[data-tag="crear"]').click(() => app.showCrear());
        $('#menu').find('[data-tag="main"]').click(() => app.showMain());
        $('#menu').find('[data-tag="report"]').click(() => app.showReport());

        // Eventos MAIN
        // Nada

        // Eventos CREAR
        $('#crear').find('[data-tag="crearHelado"]').click(() => helado.crearTipoHelado());

        // Eventos REPORT
        $('#report').find('[data-tag="consultar"]').click(() => opcReport.cargarReporte());
    },
    hidePants(){
        $('#crear').hide();
        $('#main').hide();
        $('#report').hide();
    },
    showMain(){
        this.hidePants();
        opcMain.cargarPantalla();
    },
    showCrear(){
        this.hidePants();
        opcCrear.cargarPantalla();
    },
    showReport(){
        this.hidePants();
        opcReport.cargarPantalla();
    }
};

app.go();