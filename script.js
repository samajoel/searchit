$(document).ready(function () {
  // Cargar categorías
  let productos;
  $.ajax({
    url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
    data: {
      _nombreMetodo_: "categoriasProductosTienda",
    },
    method: "POST",
    headers: {
      ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
      Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
    },
    success: function (response) {
      let productos = response.resultado.Table;

      productos.forEach(function (producto) {
        $("#categoria").append(
          `<option value="${producto.NOMBRE}">${producto.NOMBRE}</option>`
        );
      });
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });

  // Manejar envío del formulario
  $(document).on("submit", "#searchForm", function (event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    let nombre = $("#nombre").val();
    let categoria = $("#categoria").val();

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo_: "buscarProductosTienda",
        NOMBRE: nombre,
        CATEGORIA: categoria,
      },
      method: "POST",
      headers: {
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
      },
      success: function (response) {
        console.log(response);
        let productos = response.resultado.Table;
        mostrarResultados(productos);
      },
    });
  });

  // Mostrar resultados
  function mostrarResultados(productos) {
    let resultadosDiv = $("#resultados");
    resultadosDiv.empty(); // Limpiar resultados previos

    productos.forEach(function (producto) {
      let productoHTML = `
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
    let productoId = $(this).data("id");
    console.log(productoId);

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo_: "buscarProductosTienda",
        CODIGO: productoId,
      },
      method: "POST",
      headers: {
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
      },
      success: function (response) {
        console.log(response);
        let productos = response.resultado.Table;
        var productoSeleccionado = productos.filter(function (producto) {
          return producto.COD_PRODUCTO_TIENDA === productoId;
        });

        if (productoSeleccionado) {
          let detalleHTML = `
            <h5>${productoSeleccionado.NOMBRE}</h5>
            <p>${productoSeleccionado.DESCRIPCION}</p>
            <p>${productoSeleccionado.PRECIO} pesos</p>
            <p>${productoSeleccionado.PRESENTACION}</p>
            <p>${productoSeleccionado.CATEGORIA_PROD_TIENDA}</p>
          `;
          $("#detalleProductoBody").html(detalleHTML);
          $("#detalleProductoModal").modal("show");
        } else {
          console.error("No se encontró el producto con ID:", productoId);
        }
      },
    });
  });

  // Manejar cambio de categoría
  $("#categoria").change(function () {
    let nombre = $("#nombre").val();
    let categoria = $("#categoria").val();
    console.log(categoria);

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo_: "buscarProductosTienda",
        NOMBRE: nombre,
        CATEGORIA: categoria,
      },
      method: "POST",
      headers: {
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
      },
      success: function (response) {
        let productos = response.resultado.Table;
        var productosFiltrados = productos.filter(function (producto) {
          return producto.CATEGORIA_PROD_TIENDA === categoria;
        });
        console.log(productos);
        mostrarResultados(productosFiltrados);
      },
    });
  });

  // Manejar cambio de orden
  $("#ordenar").change(function () {
    let nombre = $("#nombre").val();
    let categoria = $("#categoria").val();
    let orden = $("#ordenar").val();
    let precio = $("#precio").val();

    $.ajax({
      url: "https://telemedicina.jakemate.net:7141/api/webservice/metodo",
      data: {
        _nombreMetodo_: "buscarProductosTienda",
        NOMBRE: nombre,
        CATEGORIA: categoria,
        ORDEN: orden,
        PRECIO: precio,
      },
      method: "POST",
      headers: {
        ApiKey: "ISSTIXZTV53RZURJKTZD3MXVMEW7X3",
        Token: "NJKJNTL8SNKH5JJRTS32ZGSIIDPGHLU6KRXLQMLMJJU8MD7EY5TSWMGD2D6Z",
      },
      success: function (response) {
        const productos = response.resultado.Table;
        let productosOrdenados;

        if (orden === "precio") {
          productosOrdenados = productos
            .slice()
            .sort((a, b) => a.PRECIO - b.PRECIO);
        } else {
          productosOrdenados = productos
            .slice()
            .sort((a, b) => a.NOMBRE.localeCompare(b.NOMBRE));
        }

        console.log(productosOrdenados);
        mostrarResultados(productosOrdenados);
      },
    });
  });
});
