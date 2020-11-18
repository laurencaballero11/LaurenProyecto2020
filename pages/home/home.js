window.crearBaseDatos();
$(document).ready(
    function () {

        var USER = JSON.parse(localStorage.usuario);

            const nombres = USER.nombres;
            const apellidos = USER.apellidos;
           
            todo = nombres + " " + apellidos
           

        $("#nombre_apellido").html(todo)
        

    })