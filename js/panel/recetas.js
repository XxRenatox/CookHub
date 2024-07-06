// Importar funciones desde el módulo supabase.js
import { getPref, insertFav } from "../supabase.js"

let contador = 3 // Contador para limitar la cantidad de recetas favoritas
let ids = [] // Array para almacenar los IDs de las recetas favoritas

// Función asincrónica para agregar una receta a favoritos
const setFav = async (id) => {
    if (contador === 0) {
        // Mostrar mensaje de error cuando se alcanza el límite de recetas favoritas
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ya no puedes agregar más recetas favoritas",
        })
        return // Salir de la función si ya se alcanzó el límite
    }
    if (ids.includes(id)) {
        // Mostrar mensaje de error si la receta ya es favorita
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Esa receta ya es tu favorita!",
        })
        return // Salir de la función si la receta ya es favorita
    } else {
        ids.push(id) // Agregar ID de la receta al array
        contador-- // Reducir el contador de recetas favoritas disponibles
        // Mostrar mensaje de éxito cada vez que se agrega una receta favorita
        Swal.fire({
            icon: "success",
            title: "Receta añadida a favoritos",
        })
        if (contador === 0) {
            // Mostrar mensaje de éxito y guardar en la base de datos cuando se alcanza el límite
            Swal.fire({
                icon: "success",
                title: "Registro",
                text: "Recetas agregadas con éxito",
            }).then(() => {
                insertFav(ids) // Llamar a la función para guardar las recetas favoritas
            })
        }
    }
}

// Función para obtener detalles de una receta por su ID
const obtenerDetallesReceta = (idReceta) => {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`)
        .then(response => response.json())
        .then(data => data.meals[0])
        .catch(error => console.error('Error al obtener detalles de la receta:', error))
}

// Función para generar el HTML de una receta
const generarHTMLReceta = (receta, index) => {
    const html = `
        <div class="card mb-4">
          <img src="${receta.strMealThumb}" class="card-img-top" alt="${receta.strMeal}">
          <div class="card-body">
            <h5 class="card-title">${receta.strMeal}</h5>
            <div class="accordion" id="accordionExample_${index}">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseIngredientes_${index}" aria-expanded="false" aria-controls="collapseIngredientes_${index}">
                    Ingredientes
                  </button>
                </h2>
                <div id="collapseIngredientes_${index}" class="accordion-collapse collapse" aria-labelledby="headingIngredientes_${index}"
                     data-bs-parent="#accordionExample_${index}">
                  <div class="accordion-body">
                    <ul id="listaIngredientes_${index}" class="list-group"></ul>
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                          data-bs-target="#collapseInstrucciones_${index}" aria-expanded="false" aria-controls="collapseInstrucciones_${index}">
                    Instrucciones
                  </button>
                </h2>
                <div id="collapseInstrucciones_${index}" class="accordion-collapse collapse" aria-labelledby="headingInstrucciones_${index}"
                     data-bs-parent="#accordionExample_${index}">
                  <div class="accordion-body col-md-12">
                    <ul id="listaInstrucciones_${index}" class="list-group"></ul>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn-fav btn btn-success mt-2" id="${receta.idMeal}">Añadir a Favoritos</button>
          </div>
        </div>
    `;
    return html;
};

// Cuando el DOM está completamente cargado, se ejecuta esta función asincrónica
document.addEventListener('DOMContentLoaded', async () => {
    // Función para cargar las listas de ingredientes e instrucciones de una receta
    const cargarListas = (index, detalleReceta) => {
        // Obtener elementos del HTML generado
        const recetaDiv = document.getElementById(`receta_${index}`)
        const listaIngredientes = recetaDiv.querySelector(`#listaIngredientes_${index}`)
        const listaInstrucciones = recetaDiv.querySelector(`#listaInstrucciones_${index}`)

        // Iterar sobre los ingredientes de la receta y añadir a la lista de ingredientes
        for (let i = 1; i <= 20; i++) {
            let ingrediente = detalleReceta["strIngredient" + i]
            let medida = detalleReceta["strMeasure" + i]
            if (ingrediente) {
                let nuevoElemento = document.createElement("li")
                nuevoElemento.textContent = medida + " " + ingrediente
                listaIngredientes.appendChild(nuevoElemento)
            } else {
                break
            }
        }

        // Añadir instrucciones a la lista de instrucciones
        const instrucciones = detalleReceta.strInstructions.split("\n")
        instrucciones.forEach(function (instruccion) {
            if (instruccion.trim() !== "") {
                let nuevoElemento = document.createElement("li")
                nuevoElemento.textContent = instruccion.trim()
                listaInstrucciones.appendChild(nuevoElemento)
            }
        })
    }

    // Función para obtener recetas según las preferencias del usuario
    const obtenerRecetas = (preferencias) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${preferencias}`)
            .then(response => response.json())
            .then(data => {
                const recetas = data.meals.slice(0, 6)
                // Iterar sobre cada receta y obtener detalles
                recetas.forEach((receta, index) => {
                    obtenerDetallesReceta(receta.idMeal)
                        .then(detalleReceta => {
                            // Generar HTML para la tarjeta de la receta
                            const htmlReceta = generarHTMLReceta(receta, index)
                            // Añadir el HTML generado al elemento #principal
                            const recetaDiv = document.createElement('div')
                            recetaDiv.innerHTML = htmlReceta
                            recetaDiv.classList.add('col-md-4')
                            recetaDiv.id = `receta_${index}`
                            const contenedorRecetas = document.getElementById('principal')
                            contenedorRecetas.appendChild(recetaDiv)
                            // Llamar a cargarListas dentro de la cadena de promesas
                            cargarListas(index, detalleReceta)
                            const botonFavorito = recetaDiv.querySelector(`.btn-fav`);
                            botonFavorito.addEventListener("click", () => {
                              setFav(botonFavorito.id)
                            })
                        })
                        .catch(error => console.error('Error al obtener detalles de la receta:', error))
                })
            })
            .catch(error => console.error('Error al obtener las recetas:', error))
    }

    // Obtener las preferencias del usuario y llamar a obtenerRecetas con esas preferencias
    const userPref = await getPref()
    obtenerRecetas(userPref[0].preferencia)
})