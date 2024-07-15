import { getFav } from "./supabase.js";

// Diccionario para traducir los nombres de las categorías al español
const traducciones = {
  Lamb: "Cordero",
  Miscellaneous: "Varios",
  Pasta: "Pasta",
  Pork: "Cerdo",
  Side: "Acompañamiento",
  Seafood: "Mariscos",
  Starter: "Entrante",
  Vegan: "Vegano",
  Vegetarian: "Vegetariano",
  Beef: "Res",
  Breakfast: "Desayuno",
  Chicken: "Pollo",
  Dessert: "Postre",
  Goat: "Cabra",
};

const ingredientes = [
  { id:1, strCategory: 'Beef', imgSrc: 'https://www.themealdb.com/images/category/beef.png' },
  { id:2, strCategory: 'Chicken', imgSrc: 'https://www.themealdb.com/images/category/chicken.png' },
  { id:3, strCategory: 'Vegetarian', imgSrc: 'https://www.themealdb.com/images/category/vegetarian.png' },
  { id:4, strCategory: 'Pasta', imgSrc: 'https://www.themealdb.com/images/category/pasta.png' },
  { id:5, strCategory: 'Seafood', imgSrc: 'https://www.themealdb.com/images/category/seafood.png' },
  { id:6, strCategory: 'Dessert', imgSrc: 'https://www.themealdb.com/images/category/dessert.png' },
  { id:7, strCategory: 'Miscellaneous', imgSrc: 'https://www.themealdb.com/images/category/miscellaneous.png' },
  { id:8, strCategory: 'Side', imgSrc: 'https://www.themealdb.com/images/category/side.png' },
  { id:9, strCategory: 'Lamb', imgSrc: 'https://www.themealdb.com/images/category/lamb.png' },
  { id:10, strCategory: 'Pork', imgSrc: 'https://www.themealdb.com/images/category/pork.png' },
  { id:11, strCategory: 'Goat', imgSrc: 'https://www.themealdb.com/images/category/goat.png' },
  { id:12, strCategory: 'Starter', imgSrc: 'https://www.themealdb.com/images/category/starter.png' },
  { id:13, strCategory: 'Breakfast', imgSrc: 'https://www.themealdb.com/images/category/breakfast.png' },
  { id:14, strCategory: 'Vegan', imgSrc: 'https://www.themealdb.com/images/category/vegan.png' }
];

// Función para obtener los detalles de una receta por su ID
const obtenerDetallesReceta = (idReceta) => {
  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`)
    .then(response => response.json())
    .then(data => data.meals[0])
};

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

// Función para cargar las listas de ingredientes e instrucciones
const cargarListas = (index, detalleReceta) => {
  const listaIngredientes = document.querySelector(`#listaIngredientes_${index}`);
  const listaInstrucciones = document.querySelector(`#listaInstrucciones_${index}`);

  // Cargar ingredientes
  for (let i = 1; i <= 20; i++) {
    let ingrediente = detalleReceta["strIngredient" + i];
    let medida = detalleReceta["strMeasure" + i];
    if (ingrediente) {
      let nuevoElemento = document.createElement("li");
      nuevoElemento.textContent = medida + " " + ingrediente;
      listaIngredientes.appendChild(nuevoElemento);
    } else {
      break;
    }
  }

  // Cargar instrucciones
  const instrucciones = detalleReceta.strInstructions.split("\n");
  instrucciones.forEach(function (instruccion) {
    if (instruccion.trim() !== "") {
      let nuevoElemento = document.createElement("li");
      nuevoElemento.textContent = instruccion.trim();
      listaInstrucciones.appendChild(nuevoElemento);
    }
  });
};

// Event listener para cuando el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async ()=> {
  // Función para obtener las recetas basadas en las preferencias
  const obtenerRecetas = (preferencias) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${preferencias}`)
      .then(response => response.json())
      .then(async data => {
        const recetas = data.meals.slice(0, 3);

        recetas.forEach((receta, index) => {
          obtenerDetallesReceta(receta.idMeal)
            .then((detalleReceta) => {
              const htmlReceta = generarHTMLReceta(detalleReceta, index);
              const recetaDiv = document.createElement("div");
              recetaDiv.innerHTML = htmlReceta;
              recetaDiv.classList.add("col-md-4");
              recetaDiv.id = `receta_${index}`;
              document.getElementById("container-recetas").appendChild(recetaDiv);
              cargarListas(index, detalleReceta);
            });
        });
      });
  };
  obtenerRecetas("Beef");
  // Crear botones para cada categoría
    const container = document.getElementById('seccion-categorias');
  
    // Función para generar el HTML de un botón
    const generarHTMLBoton = (ingredient) => {
      const html = `
        <div class="col-6 col-md-4 col-lg-3">
          <button class="btn p-0 border-0" id="${ingredient.id}">
            <img src="${ingredient.imgSrc}" alt="${ingredient.strCategory}" class="img-fluid rounded-circle">
            <p class="mt-2">${traducciones[ingredient.strCategory] || ingredient.strCategory}</p>
          </button>
        </div>`;
      return html;
    };
  
    // Recorrer los ingredientes y crear botones dinámicamente
    ingredientes.forEach((ingredient) => {
      container.innerHTML += generarHTMLBoton(ingredient);
    });
  
    // Añadir eventos después de que los botones se hayan agregado al DOM
    ingredientes.forEach((ingredient) => {
      document.getElementById(ingredient.id).addEventListener("click", () => {
        // Abrir una nueva pestaña con la URL adecuada
        const category = ingredient.strCategory;
        window.location.href = `templates/panels/categories.html?category=${category}`
      });
    });

document.getElementById("btnBuscar").addEventListener("click", async (e) => {
  e.preventDefault()
  const ingredient = document.getElementById("search-bar").value
  if(ingredient.trim() != ""){
    window.location.href = `templates/panels/search.html?ingredient=${ingredient}`
  }
})

document.getElementById("btnLogin").addEventListener("click", async () => {
  if(!localStorage.getItem("userId")){
    window.location.href = "templates/auth/login.html"
  } else {
    window.location.href = "templates/panels/userPanel.html"
  }
})

// Event listener para el botón de favoritos
document.getElementById("btnFav").addEventListener("click", async () => {
  try {
      const ids = await getFav(); // Obtener los IDs de las recetas favoritas
      const div = document.getElementById("seccion-recetasFav");
      div.innerHTML = ""; // Limpiar el contenido existente en el contenedor

      // Iterar sobre cada ID de receta favorita
      for (let i = 0; i < ids.length; i++) {
          const detalleReceta = await obtenerDetallesReceta(ids[i]); // Obtener detalles de la receta por ID

          // Generar HTML para la receta
          const htmlReceta = generarHTMLReceta(detalleReceta, i);
          const recetaDiv = document.createElement("div");
          recetaDiv.innerHTML = htmlReceta;
          recetaDiv.classList.add("receta");
          recetaDiv.id = `receta_${i}`;
          
          // Agregar el div de la receta al contenedor
          div.appendChild(recetaDiv);
          
          // Cargar listas de ingredientes e instrucciones
          cargarListas(i, detalleReceta);
      }
  } catch (error) {
      console.error("Error al obtener o mostrar las recetas favoritas:", error);
      // Aquí podrías agregar una lógica para manejar el error, por ejemplo, mostrar un mensaje al usuario
  }
  });
});
