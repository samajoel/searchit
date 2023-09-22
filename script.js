$(document).ready(function () {
  // Cargar categorías
  $.ajax({
    url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
    data: {
      _nombreMetodo: "categoriasProductosTienda",
      ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
      Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
    },
    method: "POST",
    success: function (response) {
      var categorias = response.resultado.Table;
      categorias.forEach(function (categoria) {
        $("#categoria").append(
          `<option value="${categoria.COD_CATEGORIA_PROD_TIENDA}">${categoria.CATEGORIA_PROD_TIENDA}</option>`
        );
      });
    },
  });

  // Manejar envío del formulario
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    var nombre = $("#nombre").val();
    var categoria = $("#categoria").val();

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo: "buscarProductosTienda",
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
        NOMBRE: nombre,
        CATEGORIA: categoria,
      },
      method: "POST",
      success: function (response) {
        var productos = response.resultado.Table;
        mostrarResultados(productos);
      },
    });
  });

  // Mostrar resultados
  function mostrarResultados(productos) {
    var resultadosDiv = $("#resultados");
    resultadosDiv.empty(); // Limpiar resultados previos

    productos.forEach(function (producto) {
      var productoHTML = `
                <div class="card mb-3">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="${producto.IMAGEN}" class="card-img" alt="${producto.NOMBRE}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${producto.NOMBRE}</h5>
                                <p class="card-text">${producto.PRECIO} pesos</p>
                                <p class="card-text">${producto.CATEGORIA_PROD_TIENDA}</p>
                                <a href="#" class="btn btn-primary ver-detalle" data-id="${producto.COD_PRODUCTO_TIENDA}">Ver Detalles</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      resultadosDiv.append(productoHTML);
    });
  }

  // Abrir modal con detalles
  $("#resultados").on("click", ".ver-detalle", function () {
    var productoId = $(this).data("id");

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo: "buscarProductosTienda",
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
        COD_PRODUCTO_TIENDA: productoId,
      },
      method: "POST",
      success: function (response) {
        var producto = response.resultado.Table[0];
        var detalleHTML = `
                    <h5>${producto.NOMBRE}</h5>
                    <p>${producto.DESCRIPCION}</p>
                    <p>${producto.PRECIO} pesos</p>
                    <p>${producto.PRESENTACION}</p>
                    <p>${producto.CATEGORIA_PROD_TIENDA}</p>
                `;
        $("#detalleProductoBody").html(detalleHTML);
        $("#detalleProductoModal").modal("show");
      },
    });
  });
});
