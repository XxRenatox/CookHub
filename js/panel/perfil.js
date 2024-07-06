// Importar funciones desde el módulo supabase.js
import {
  getPref,
  getUserId,
  insertPref,
  insertProducts,
  deleteUser,
  getProducts,
  updateProducts,
  updatePref,
} from "../supabase.js"

// Traducciones de categorías de ingredientes
const traducciones = {
  "Lamb": "Cordero",
  "Miscellaneous": "Varios",
  "Pasta": "Pasta",
  "Pork": "Cerdo",
  "Side": "Acompañamiento",
  "Seafood": "Mariscos",
  "Starter": "Entrante",
  "Vegan": "Vegano",
  "Vegetarian": "Vegetariano",
  "Beef": "Res",
  "Breakfast": "Desayuno",
  "Chicken": "Pollo",
  "Dessert": "Postre",
  "Goat": "Cabra"
}

// Función para cargar opciones de ingredientes en un select
const cargarOpciones = (id) => {
  let select = document.getElementById(id)

  // Fetch para obtener la lista de ingredientes
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    .then((response) => response.json()) // Convertir la respuesta a JSON
    .then((data) => {
      const cantidadResultados = 200 // Limita la cantidad de resultados
      const ingredientesLimitados = data.meals.slice(0, cantidadResultados)

      // Ordenar los ingredientes alfabéticamente
      ingredientesLimitados.sort((a, b) =>
        a.strIngredient.localeCompare(b.strIngredient)
      )

      // Iterar sobre cada ingrediente y crear una opción en el select
      ingredientesLimitados.forEach((ingredient) => {
        let opcion = document.createElement("option")
        opcion.textContent = ingredient.strIngredient
        opcion.value = ingredient.strIngredient // Usar el nombre del ingrediente como valor
        select.appendChild(opcion)
      })
    })
    .catch((error) => {
      console.error("Error al cargar opciones:", error) // Manejo de errores
    })
}

// Función para cargar preferencias en un select
const cargarPref = (id) => {
  let select = document.getElementById(id)

  // Fetch para obtener la lista de categorías de comidas
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then((response) => response.json()) // Convertir la respuesta a JSON
    .then((preferencias) => {
      // Limitar y mostrar las primeras 14 preferencias
      preferencias.meals.slice(0, 14).forEach((ingredient) => {
        let opcion = document.createElement("option")
        opcion.textContent = traducciones[ingredient.strCategory] || ingredient.strCategory
        opcion.value = ingredient.strCategory // Usar la categoría como valor
        select.appendChild(opcion)
      })
    })
    .catch((error) => {
      console.error("Error al cargar preferencias:", error) // Manejo de errores
    })
}

// Función asincrónica para cargar información del usuario
const cargarInfo = async () => {
  const userData = await getUserId() // Obtener información del usuario
  const userPref = await getPref() // Obtener preferencia del usuario

  // Verificar si se encontró información del usuario y actualizar elementos en el DOM
  if (userData.length === 1) {
    document.getElementById("email").textContent = userData[0].email
    document.getElementById("Preferencia").textContent =
      traducciones[userPref[0].preferencia]
  } else {
    console.error("No se encontró información del usuario")
  }
}

// Evento que se dispara cuando el DOM está completamente cargado
window.addEventListener("DOMContentLoaded", function () {
  cargarInfo() // Cargar información del usuario
  cargarOpciones("select1") // Cargar opciones en el primer select
  cargarOpciones("select2") // Cargar opciones en el segundo select
  cargarOpciones("select3") // Cargar opciones en el tercer select
  cargarOpciones("select4") // Cargar opciones en el cuarto select
  cargarPref("select-pref") // Cargar preferencias en el select de preferencias
})

// Evento para el botón de actualizar
document.getElementById("btnUpdate").addEventListener("click", async () => {
  const products = await getProducts() // Obtener productos del usuario
  const pref = await getPref() // Obtener preferencia del usuario

  // Actualizar select de preferencias con la preferencia actual
  document.getElementById('select-pref').value = pref[0].preferencia

  // Actualizar campos de productos con los productos actuales
  products[1].forEach(products => {
    document.getElementById("select1").value = products.producto1 
    document.getElementById("select2").value = products.producto2 
    document.getElementById("select3").value = products.producto3 
    document.getElementById("select4").value = products.producto4 
  })

  document.getElementById("sendData").innerHTML = "Modificar"
})

// Evento para el botón de enviar/modificar datos
document.getElementById("sendData").addEventListener("click", async () => {
  const sendDataButton = document.getElementById("sendData")

  // Si el botón dice "Modificar", se actualizarán los productos y preferencias
  if (sendDataButton.innerHTML === "Modificar") {
    const product1 = document.getElementById("select1").value
    const product2 = document.getElementById("select2").value
    const product3 = document.getElementById("select3").value
    const product4 = document.getElementById("select4").value

    const pref = document.getElementById('select-pref').value

    // Llamar a funciones para actualizar productos y preferencia
    try {
      await updateProducts(product1, product2, product3, product4)
      await updatePref(pref)
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Productos y preferencia actualizados correctamente",
      })
      sendDataButton.innerHTML = "Enviar Datos"
    } catch (error) {
      console.error("Error al modificar los productos:", error.message)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al modificar los productos",
      })
    }
  } 
  // Si el botón dice "Enviar Datos", se guardarán los productos y preferencia
  else if (sendDataButton.innerHTML === "Enviar Datos") {
    const select1 = document.getElementById("select1")
    const product1 = select1.options[select1.selectedIndex].text

    const select2 = document.getElementById("select2")
    const product2 = select2.options[select2.selectedIndex].text

    const select3 = document.getElementById("select3")
    const product3 = select3.options[select3.selectedIndex].text

    const select4 = document.getElementById("select4")
    const product4 = select4.options[select4.selectedIndex].text

    const selectPref = document.getElementById("select-pref")
    const pref = selectPref.options[selectPref.selectedIndex].value

    // Validar que se haya seleccionado el primer producto y la preferencia
    if (product1 === "Productos" || pref === "Preferencia") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes ingresar el primer producto y la preferencia",
      })
    } else {
      try {
        // Insertar nuevos productos y preferencia en la base de datos
        await insertProducts(product1, product2, product3, product4)
        await insertPref(pref)
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Datos guardados correctamente",
        }).then(() => {
          document.getElementById("sendData").disabled = true
        })
      } catch (error) {
        console.error("Error al guardar los datos:", error.message)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al guardar los datos",
        })
      }
    }
  }
})
// Evento para el botón de eliminar cuenta
document.getElementById("btnDelete").addEventListener("click", () => {
  // Mostrar confirmación antes de eliminar la cuenta
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Sí, bórralo!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Pedir correo y contraseña para confirmar la eliminación
      Swal.fire({
        title: "Eliminar confirmada",
        text: "Por favor, ingresa tu correo y contraseña para confirmar.",
        html: `
            <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
          `,
        focusConfirm: false,
        preConfirm: () => {
          const email = Swal.getPopup().querySelector("#email").value
          const password = Swal.getPopup().querySelector("#password").value
          if (!email || !password) {
            Swal.showValidationMessage(
              "Por favor, ingresa el correo y la contraseña"
            )
          }
          return { email: email, password: password }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const email = result.value.email
          const password = result.value.password
          const deleteSuccess = await deleteUser(email, password)

          // Mostrar mensaje de éxito al eliminar la cuenta
          if (deleteSuccess) {
            Swal.fire({
              title: "¡Borrado!",
              text: "Cuenta eliminada con éxito",
              icon: "success",
            }).then(() => {
              window.location.href = "../../index.html"
            })
          } else {
            // Mostrar mensaje de error si hubo un problema al eliminar la cuenta
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al eliminar el usuario",
            })
          }
        }
      })
    }
  })
})