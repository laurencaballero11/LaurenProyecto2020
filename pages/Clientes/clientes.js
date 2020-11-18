window.crearBaseDatos();
$(document).ready(
    function () {

        $('#conten-crear').hide();
        $('#conten-editar').hide();

        $('table').on('click', '.eliminar', function () {

            const resp = confirm('¿Esta seguro que quiere elimnarlo?')
            if (resp) {
                const fila = $(this).closest('tr');
                const codi = fila.data('id');
                sql = 'DELETE FROM clientes WHERE rowid=?';
                window.query(sql, [codi]).then(function (result) {
                    fila.remove();
                    console.log('Eliminado correctamente');
                     toastr.info('Clientes Eliminado')

                }, function (error) {
                    console.log('Error eliminando...', error);
                })

            }

        });


        sql = 'SELECT *, rowid FROM clientes';
        window.query(sql, []).then(function (result) {
            items = result;
            for (let i = 0; i < items.length; i++) {
                const u = items[i];

                $('table tbody').append(
                    "<tr data-id='" + u['rowid'] + "'>\
                        <th>"+ u['rowid'] + "</th>\
                        <td class='td-nombres'>"+ u['nombres'] + "</td>\
                        <td class='td-apellidos'>"+ u['apellidos'] + "</td>\
                        <td class='td-sexo'>"+ u['sexo'] + "</td>\
                        <td class='td-documento'>"+ u['documento'] + "</td>\
                        <td class='td-telefono'>"+ u['telefono'] + "</td>\
                        <td class='td-acudiente'>"+ u['acudiente'] + "</td>\
                        <td><button class='btn btn-primary editar'> <i class='fas fa-user-edit'></i></button> <button class='btn btn-danger eliminar'> <i class='fas fa-user-minus '></i></button>  \
                        </td>\
                    <tr>"
                );

            }
        }, function (tx, error) {
            console.log('Dato ingresado', error.message);
        })


        var fila_editantdo = null;
        $('table').on('click','.editar',function () {
            var tr = $(this).closest('tr');
            fila_editantdo = tr;
            const id= tr.data('id');

            const nombres = tr.find('.td-nombres').text();
            const apellidos = tr.find('.td-apellidos').text();
            const sexo = tr.find('.td-sexo').text();
            const documento = tr.find('.td-documento').text();
            const telefono = tr.find('.td-telefono').text();
            const acudiente = tr.find('.td-acudiente').text();


            $('#inputnombreEdit').val(nombres);
            $('#inputapellidoEdit').val(apellidos);
            $('#inputsexoEdit').val(sexo);
            $('#inputdocumentoEdit').val(documento);
            $('#inputtelefonoEdit').val(telefono);
            $('#inputacudienteEdit').val(acudiente);

            $('#conten-editar').show('fast');
            $('#conten-crear').hide();

        })

        $('#formEditar').submit(function () {
            a = $('#inputnombreEdit').val();
            b = $('#inputapellidoEdit').val();
            c = $('#inputsexoEdit').val();
            e = $('#inputdocumentoEdit').val();
            f = $('#inputtelefonoEdit').val();
            g = $('#inputacudienteEdit').val();

        
            sql = 'UPDATE clientes SET nombres=?,apellidos=?,sexo=?,documento=?,telefono=?,acudiente=? WHERE rowid=? ';

            window.query(sql, [a, b, c, e, f, g, fila_editantdo.data('id')]).then(function (result) {

                fila_editantdo.find('.td-nombres').text(a);
                fila_editantdo.find('.td-apellidos').text(b);
                fila_editantdo.find('.td-sexo').text(c);
                fila_editantdo.find('.td-documento').text(e);
                fila_editantdo.find('.td-telefono').text(f);
                fila_editantdo.find('.td-acudiente').text(g);


                toastr.info('Cliente actualizado')


                $('#conten-editar').hide();
                
            }, function (error) {
                console.log('Dato ingresado', error);
            })


            event.preventDefault();
        }) 



        $('#btncrear').click(
            function () {
                $('#conten-crear').show('fast');
                $('#conten-editar').hide();

            }
        )
        $('#btncancel').click(
            function () {
                $('#conten-crear').hide();
            }
        )

        $('#btncanceledit').click(
            function () {
                $('#conten-editar').hide();
            }
        )
        $('#formcrear').submit(function (e) {
            e.preventDefault();

            a = $('#inputnombre').val();
            b = $('#inputapellido').val();
            c = $('#inputsexo').val();
            e = $('#inputdocumento').val();
            f = $('#inputtelefono').val();
            g = $('#inputacudiente').val();




            window.db.transaction(function (tx) { sql = 'INSERT INTO clientes(nombres,apellidos,sexo,documento,telefono,acudiente)VALUES(?,?,?,?,?,?)';
                tx.executeSql(sql, [a,b,c,e,f,g], function ( result) {
                    toastr.success('Cliente ingresado')
                    $('#conten-crear').hide();

                    $('table tbody').append(
                        "<tr data-id='" + result['rowid'] + "'>\
                            <td>10</td>\
                            <td>"+ a + "</td>\
                            <td>"+ b + "</td>\
                            <td>"+ c + "</td>\
                            <td>"+ e + "</td>\
                            <td>"+ f + "</td>\
                            <td>"+ g + "</td>\
                            <td><button class='btn btn-primary editar'> <i class='fas fa-user-edit'></i></button> <button class='btn btn-danger eliminar'> <i class='fas fa-user-minus '></i></button>  \
                        </tr>"
                    );

                }, function (tx, error) {
                    console.log('Dato ingresado', error.message);
                })
            })
            

            e.preventDefault();
        })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

    })