
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
        </div>
      </div>
  `;
  return html;
};

// Función para obtener detalles de una receta por su ID
const obtenerDetallesReceta = (idReceta) => {
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`
  )
    .then((response) => response.json())
    .then((data) => data.meals[0])
    .catch((error) =>
      console.error("Error al obtener detalles de la receta:", error)
    )
}

// Función para cargar los ingredientes e instrucciones de una receta en la lista correspondiente
const cargarListas = (index, detalleReceta) => {
  const listaIngredientes = document.querySelector(`#listaIngredientes_${index}`)
  const listaInstrucciones = document.querySelector(`#listaInstrucciones_${index}`)

  // Iterar sobre los ingredientes de la receta y agregar a la lista de ingredientes
  for (let i = 1; i <= 20; i++) {
    let ingrediente = detalleReceta["strIngredient" + i]
    let medida = detalleReceta["strMeasure" + i]
    if (ingrediente) {
      let nuevoElemento = document.createElement("li")
      nuevoElemento.textContent = medida + " " + ingrediente
      listaIngredientes.appendChild(nuevoElemento)
    } else {
      break // Si no hay más ingredientes, salir del bucle
    }
  }

  // Dividir las instrucciones por línea y agregar cada una como un elemento de lista
  const instrucciones = detalleReceta.strInstructions.split("\n")
  instrucciones.forEach(function (instruccion) {
    if (instruccion.trim() !== "") {
      let nuevoElemento = document.createElement("li")
      nuevoElemento.textContent = instruccion.trim()
      listaInstrucciones.appendChild(nuevoElemento)
    }
  })
}

// Función para obtener el parámetro de consulta 'category' de la URL
const getQueryParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// Evento que se dispara cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
  let cantidadRecetas = 3
  // Función para obtener las recetas basadas en las preferencias del usuario
  const obtenerRecetas = (ingredient) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then((response) => response.json())
      .then( async (data) => {
        if (localStorage.getItem("userId")){
          cantidadRecetas = 6
        }
        const recetas = data.meals.slice(0, cantidadRecetas); // Array de recetas obtenidas de la API
        recetas.forEach((receta, index) => {
          // Para cada receta, obtener sus detalles
          obtenerDetallesReceta(receta.idMeal)
            .then((detalleReceta) => {
              const htmlReceta = generarHTMLReceta(detalleReceta, index) // Generar HTML de la receta
              const recetaDiv = document.createElement("div") // Crear un nuevo elemento div
              recetaDiv.innerHTML = htmlReceta // Agregar el HTML generado al elemento div
              recetaDiv.classList.add("col-md-4") // Agregar la clase 'receta' al elemento div
              recetaDiv.id = `receta_${index}` // Establecer el ID del elemento div
              document.getElementById("search-div").appendChild(recetaDiv) // Agregar el elemento div al contenedor de recetas
              cargarListas(index, detalleReceta) // Cargar ingredientes e instrucciones de la receta
            })
            .catch((error) =>
              console.error("Error al obtener detalles de la receta:", error)
            )
        })
      })
      .catch((error) => console.error("Error al obtener las recetas:", error))
  }

  // Llamar a la función obtenerRecetas con la categoría obtenida de los parámetros de consulta
  obtenerRecetas(getQueryParameter("ingredient"))
})
