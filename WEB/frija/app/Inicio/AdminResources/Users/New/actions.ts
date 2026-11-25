"use server";

export interface NuevoUsuarioPayload {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: string;
}

export async function crearUsuarioEnBD(
  datos: NuevoUsuarioPayload
): Promise<{ ok: boolean; mensaje: string }> {
  // Validación básica de campos obligatorios (*)
  if (
    !datos.nombre.trim() ||
    !datos.apellidoPaterno.trim() ||
    !datos.correo.trim() ||
    !datos.rol.trim()
  ) {
    return {
      ok: false,
      mensaje: "Por favor completa todos los campos obligatorios (*).",
    };
  }

  try {
    // =========================================================================
    // AQUÍ CONECTARÁS TU BASE DE DATOS CUANDO TE DEN ACCESO:
    // =========================================================================
    // Ejemplo con Prisma:
    // await prisma.usuario.create({
    //   data: {
    //     nombre: datos.nombre,
    //     apellidoPaterno: datos.apellidoPaterno,
    //     apellidoMaterno: datos.apellidoMaterno || null,
    //     correo: datos.correo,
    //     telefono: datos.telefono || null,
    //     contrasena: datos.contrasena, // Recuerda hashearla con bcrypt
    //     rol: datos.rol,
    //     activo: true,
    //   },
    // });

    // Ejemplo con Supabase:
    // const { error } = await supabase.from("usuarios").insert([datos]);
    // if (error) throw new Error(error.message);

    // Simulación temporal mientras te entregan la BD:
    console.log("Datos listos para enviar a la BD:", datos);
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      ok: true,
      mensaje: "Usuario preparado correctamente (pendiente de conexión a BD).",
    };
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    return {
      ok: false,
      mensaje: "Ocurrió un error al intentar guardar el usuario.",
    };
  }
}