document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos de navegación
    var linkPerfil = document.querySelector('a.nav-link[href="#perfil"]')
    var linkRecetas = document.querySelector('a.nav-link[href="#recetas"]')

    // Obtener las secciones a mostrar/ocultar
    var perfil = document.getElementById('perfil')
    var recetas = document.getElementById('recetas')

    // Manejar clic en el enlace para mostrar la sección de perfil
    linkPerfil.addEventListener('click', (e) => {
        e.preventDefault() 
        perfil.style.display = 'flex' 
        recetas.style.display = 'none' 
    })

    // Manejar clic en el enlace para mostrar la sección de recetas
    linkRecetas.addEventListener('click', (e) => {
        e.preventDefault() 
        recetas.style.display = 'flex' 
        perfil.style.display = 'none' 
    })
})