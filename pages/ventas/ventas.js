window.crearBaseDatos();
$(document).ready(function () {
  $('#tabla-todo').hide();

  
    sql = "SELECT * FROM clientes"
    window.query(sql).then(function (result) {
        var substringMatcher = function (strs) {
            return function findMatches(q, cb) {
              var matches, substringRegex;
              matches = [];
              substrRegex = new RegExp(q, "i");
              $.each(strs, function (i, str) {
                if (
                  substrRegex.test(str.nombres) ||
                  substrRegex.test(str.apellidos)
                ) {
                  matches.push(`${str.nombres} ${str.apellidos}`);
                }
              });
    
              cb(matches);
            };
          };
    
          $("#buscarNombre .typeahead").typeahead(
            {
              hint: true,
              highlight: true,
              minLength: 1,
            },
            {
              name: "nombres",
              source: substringMatcher(result),
            });

            //Llamamos a productos

            sql = "SELECT rowid, * FROM productos"
            window.query(sql).then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    const prod = result[i];
                    const prodString = JSON.stringify(prod)
                    $("#selectProductos").append(
                    `<option data-producto='` + prodString + `' value=${prod.rowid}> ${prod.nombre} $${prod.precio}</option>`
                    );
                };
            });

            var total_pagar = 0;
            $('#listaProductosSeleccionados').on('change','input', function () {

              const idPro = parseInt($(this).attr('id').substring(9,10));

              for (let i = 0; i < productosSeleccionados.length; i++) {
                const pro = productosSeleccionados[i].producto;

                if (idPro == pro.rowid) {

                  pro.cantidad = $(this).val();
                  pro.precio_total_prod = pro.precio * pro.cantidad;
                  
                  llenarListaProducto();
                  return
                  
                }
                
              }

            })


            $('#tabla').on('click', '#borrar_producto',function () {
              const cod = $(this).data('codigo')
              let restante = [];
              for (let i = 0; i < productosSeleccionados.length; i++) {
                const prod = productosSeleccionados[i];
                if (prod.producto.rowid != cod) {
                  restante.push(prod);
                }
              }
              productosSeleccionados = restante;
              llenarListaProducto()
            })


            function llenarListaProducto() {
            var totalpagar = 0;

              $('#listaProductosSeleccionados').html('')
              for (let i = 0; i < productosSeleccionados.length; i++) {
                const product = productosSeleccionados[i].producto;
                var totalpagar = totalpagar + product.precio_total_prod;

                $('#tabla-todo').show('fast');

                $('#listaProductosSeleccionados').append(
                  `
                  <tr>
                    <td> ${product.nombre}</td>
                    <td> ${product.precio}</td>
                    <td> <input type="number" min="1" id="cantidad-${product.rowid}" value="${product.cantidad}"></td>
                    <td> ${product.precio_total_prod}</td>
                    <td>\
                    <div class='btn-group'>\
                        <a data-codigo="${product.rowid}" id="borrar_producto" class='btn btn-sm'>\
                        <i class='fa fa-trash-alt'></i>\
                        </a>\
                    </div>\
                    </td>\
                  </tr>
                  `
                )


                $('#ventas_crear').on('change','input', function () {
                  pago =   $('#pago').val();
                  const vueltas = pago - totalpagar;
                  $('#cambio').html(vueltas)
              })
               

                  $('#total-todo').html('$ '+totalpagar)

                 
              }
            }

            var productosSeleccionados = [];
            
            $('#ventas_cli').click(function () {
            
              $('#tablas_info').html('');
  
  
              $('#caja_cliente').show('fast');
          
          
              console.log("asd")
              idcli = 1
              sql = 'SELECT rowid, * FROM clientes WHERE rowid=?';
              window.query(sql, [idcli]).then(function (result) {
                  var items = result;
                  for (let i = 0; i < items.length; i++) {
                      const u = items[i];
                      $('#select_cliente').append(
                        `<option value=${u.rowid}> ${u.nombres} ${u.apellidos}</option>`
                      );
          
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
                             
                               <div style="padding-left: 20px;padding-top: 20px;padding-bottom: 20px;padding-right: 20px;">
                                     <br>
                                  <h3> Venta #${ventas.rowid}<h3 class="float-right">${ventas.fecha}</h3></h3>
                                  <br>
                
                                  <div>
                                    <table class="table table-striped">
                                    <thead >
                                      <tr> 
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
                          
                        },100)
                       
                    }, function (error) {
                        console.log('Dato ingresado', error);
                    })
                  }
              }, function (error) {
                  console.log('Dato ingresado', error);
              }
              
              
              
              )
          
          
            })


            $('#btn-agregar-prod').click(function () {
              const idp = parseInt($('#selectProductos option:selected').val());
              const prod = $('#selectProductos option:selected').data();
              prod.producto.cantidad = 1;
              prod.producto.precio_total_prod = prod.producto.precio;
              let encontrado = false;
              for (let i = 0; i < productosSeleccionados.length; i++) {
                const prod = productosSeleccionados[i].producto;
                if (prod.rowid == idp) {
                  encontrado = true;
                }
              }
              if (!encontrado) {
                productosSeleccionados.push(prod);
                llenarListaProducto()
              }
            })

           

            $('#ventas_crear').submit(function (event) {
              event.preventDefault();

              $("#tabla-todo").hide();

              const fecha = new Date().toLocaleString();

              
                var USER = JSON.parse(localStorage.usuario);
                var id = USER.rowid;
               
                idcli = 1;
                pago =   $('#pago').val();
            
                sql = 'INSERT INTO ventas(usuario_id,fecha,pago,cliente_id)VALUES(?,?,?,?)';
                window.query(sql, [id,  fecha,pago,idcli]).then(function (result) {
                  let codiventa = result.insertId;

                  for (let i = 0; i < productosSeleccionados.length; i++) {
                    const prod = productosSeleccionados[i].producto;

                    venta_deta(prod.rowid,prod.cantidad, prod.precio)
                    
                  }
                  
                  function venta_deta(prodId,prodCant, prodPrec) {
                    sql = 'INSERT INTO venta_detalle(venta_id,producto_id,cantidad,precio)VALUES(?,?,?,?)';
                    window.query(sql, [codiventa, prodId,prodCant,prodPrec]).then(function (result) {

                      console.log(result)
                    })
                  }

                  productosSeleccionados= []

                  toastr.success('Venta Creado')

                }, function (error) {
                    console.log('Dato ingresado', error);
                })
                event.preventDefault();
            
          })

           
    })
})