window.crearBaseDatos();
$(document).ready(function () {
 
  $('#clientes').hide();
  $('#ventas').hide();
  $('#productos').hide();
  $('#caja_cliente').hide();


  


  $('#abrir_productos').click(
        function () {
            $('#productos').show('fast');
            $('#clientes').hide();
            $('#ventas').hide();
            $('#ventas_detalles').hide();
            $('#caja_cliente').hide();
        })


        $('#abrir_clientes').click(
          function () {
              $('#clientes').show('fast');
              $('#ventas').hide();
              $('#productos').hide();
              $('#ventas_detalles').hide();
              $('#caja_cliente').hide();
          })

          $('#abrir_ventas').click(
            function () {
                $('#ventas').show('fast');
                $('#clientes').hide();
                $('#productos').hide();
                $('#ventas_detalles').hide();
                $('#caja_cliente').hide();
            })
        
        

            sql = 'SELECT *, rowid FROM productos';
            window.query(sql).then(function (result) {
                var items = result;
                for (let i = 0; i < items.length; i++) {
                    const u = items[i];
                    $('#productos_datos').append(
                      "<tr>\
                        <td >"+ u['nombre'] + "</td>\
                        <td >"+ u['abreviatura'] + "</td>\
                        <td >"+ u['precio'] + "</td>\
                        <td >"+ u['costo'] +  "</td>\
                        <td >"+ u['descripcion'] + "</td>\
                        <td >"+ u['proveedor'] + "</td>\
                        <td >"+ u['cell_proveedor'] + "</td>\
                      </tr>"
                    );
                }
            }, function (error) {
                console.log('Dato ingresado', error);
            })
          

          sql = 'SELECT *, rowid FROM ventas';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('#ventas_datos').append(
                  "<tr>\
                    <td >"+ u['usuario_id'] + "</td>\
                    <td >"+ u['fecha'] + "</td>\
                    <td >"+ u['cliente_id'] +  "</td>\
                    <td >"+ u['descripcion'] + "</td>\
                    <td >"+ u['pago'] + "</td>\
                  </tr>"
                );
            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })


          sql = 'SELECT *, rowid FROM clientes';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('#clientes_datos').append(
                  "<tr>\
                    <td >"+ u['nombres'] + "</td>\
                    <td >"+ u['apellidos'] + "</td>\
                    <td >"+ u['sexo'] + "</td>\
                    <td >"+ u['documento'] +  "</td>\
                    <td >"+ u['acudiente'] + "</td>\
                    <td >"+ u['telefono'] + "</td>\
                  </tr>"
                );

                
            }
        }, function (error) {
            console.log('Dato ingresado', error);
        })

        
        sql = 'SELECT rowid, * FROM clientes';
        window.query(sql).then(function (result) {
            var items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];
                $('#select_cliente').append(
                  `<option value=${u.rowid}> ${u.nombres} ${u.apellidos}</option>`
                );
    
              let clientes = result[0];



      }
    })




  $('#ver_ventas_cli').click(function () {

    $('#caja_cliente').show('fast');
    $('#clientes').hide();
    $('#ventas').hide();
    $('#productos').hide();

   
    idcli = 1
    sql = 'SELECT rowid, * FROM clientes WHERE rowid=?';
    window.query(sql, [idcli]).then(function (result) {
        var items = result;
        for (let i = 0; i < items.length; i++) {
            const u = items[i];
           

          let clientes = result[0];

          $("#clien_info").html(clientes.nombres + " " + clientes.apellidos)

          sql = 'SELECT rowid, *  FROM clientes WHERE rowid=?';
          window.query(sql,[idcli]).then(function (result) {
            let clientes = result[0]   
            $("#clien_info").html(clientes.nombres + " " + clientes.apellidos)
            $('#caja_cliente').show('fast');
          }, function (error) {
              console.log('Dato ingresado', error);
          })
      
          sql = 'SELECT rowid, * FROM ventas WHERE cliente_id=?';
          window.query(sql,[idcli]).then(function (result) {
            function traerdetalle(venta, venta_id) {
              let   sql = 'SELECT d.rowid, d.*, p.rowid, p.* FROM venta_detalle d INNER JOIN productos p ON p.rowid=d.producto_id WHERE venta_id=?';
              window.query(sql,[venta_id]).then(function (result) {
                venta.detalle = result
                console.log(venta.detalle)
               })
            }
      
              for (let i = 0; i < result.length; i++) {
                  const venta = result[i];
                  traerdetalle(venta, venta.rowid)
              }
      
              setTimeout( () =>{
                for (let i = 0; i < result.length; i++) {
                  const ventas = result[i];
                  $('#tablas_info').append(
                    `
                    <br>
                   
                     <div style="border: solid 1px #dee2e6;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;padding-right: 20px;">
                           <br>
                        <h3> Venta #${ventas.rowid}<h3 class="float-right">${ventas.fecha}</h3></h3>
                        <br>
      
                        <div>
                          <table class="table table-bordered">
                          <thead class="thead-dark">
                            <tr style="border: 1px solid #454d55;"> 
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Precio</th>
                              <th>Pago</th>
                            </tr>
                          </thead>
                          <tbody id="detalle_producto-${ventas.rowid}">
                             
                          </tbody>
                          </table>
                        </div>
                       </div>
                  `
                  );
                  console.log(ventas)
                  for (let j = 0; j < ventas.detalle.length; j++) {
                    const detalle = ventas.detalle[j];
      
                    $('#detalle_producto-' + ventas.rowid).append(
                      `
      
                      <tr >
                              <td >${detalle.nombre} </td>
                              <td >${detalle.cantidad} </td>
                              <td >${detalle.precio} </td>
                              <td> ${ventas.pago}</td>
                            </tr>
                      `
                    );
                  }
                  
                }
                
              },1000)
             
          }, function (error) {
              console.log('Dato ingresado', error);
          })
        }
    })


  }) 
  
})