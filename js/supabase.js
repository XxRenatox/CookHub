import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Crear una instancia del cliente de Supabase
const supabaseUrl = 'https://yimnzksurtyjremognpp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbW56a3N1cnR5anJlbW9nbnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwODY1MjAsImV4cCI6MjAzMjY2MjUyMH0.X__gHWZ291yHc4I5B5oy-73E7xo2oOpVjiyqJJVNgpE'
const supabase = createClient(supabaseUrl, supabaseKey)

// LOGIN Y REGISTER 
// Función para registrar al usuario
export const register = async (email, passwd) => {
  // Verificar si existe el usuario
  const { data: existingUsers, error: fetchError } = await supabase
    .from('Usuarios')
    .select()
    .eq('email', email)

  if (fetchError) return true

  if (existingUsers.length === 1) return true

  // Insertar el nuevo usuario
  const { error: insertError, data } = await supabase
    .from('Usuarios')
    .insert({ email: email, contrasena: passwd })
    .select()

  const userId = data[0].id
  localStorage.setItem('userId', userId)

  if (insertError) return true

  return false
}

// Función para iniciar sesión
export const login = async (email, passwd) => {
  const { data, error } = await supabase
    .from('Usuarios')
    .select()
    .match({ email: email, contrasena: passwd })

  if (error) return false

  if (data.length === 1) {
    const userId = data[0].id
    localStorage.setItem('userId', userId)
    return true
  } else {
    return false
  }
}

// FUNCIONES PARA INSERTAR INFO

// Insertar preferencia
export const insertPref = async (pref) => {
  const userId = localStorage.getItem('userId')
  const { data, error } = await supabase
    .from('Preferencias')
    .select()
    .eq('fk_id_usuario', userId)

  if (error) return false

  if (data.length > 0) return false

  const { error: insertError } = await supabase
    .from('Preferencias')
    .insert({ preferencia: pref, fk_id_usuario: userId })

  if (insertError) return false

  return true
}

// Insertar productos
export const insertProducts = async (produc1, produc2, produc3, produc4) => {
  const userId = localStorage.getItem('userId')
  const { data, error } = await supabase
    .from('Productos')
    .select()
    .eq('fk_id_usuario', userId)

  if (error) return false

  if (data.length > 0) return false

  const { error: insertError } = await supabase
    .from('Productos')
    .insert({
      producto1: produc1,
      producto2: produc2,
      producto3: produc3,
      producto4: produc4,
      fk_id_usuario: userId
    })

  if (insertError) return false

  return true
}

// Insertar favoritos
export const insertFav = async (ids) => {
  const { error } = await supabase
    .from('Favoritas')
    .insert({ fav1: ids[0], fav2: ids[1], fav3: ids[2], fk_id_usuario: localStorage.getItem('userId') })
    .select()

  return !error
}

// FUNCIONES PARA OBTENER INFO

// Obtener ID de usuario
export const getUserId = async () => {
  const { error, data } = await supabase
    .from('Usuarios')
    .select()
    .eq('id', localStorage.getItem('userId'))

  return data
}

// Obtener favoritos
export const getFav = async () => {
  const { error, data } = await supabase
    .from('Favoritas')
    .select('fav1,fav2,fav3')
    .eq('fk_id_usuario', localStorage.getItem('userId'))

  if (error) return false

  return [data[0].fav1, data[0].fav2, data[0].fav3]
}

// Obtener productos
export const getProducts = async () => {
  const userId = localStorage.getItem('userId')
  const { data, error } = await supabase
    .from('Productos')
    .select()
    .eq('fk_id_usuario', userId)

  if (error) return false

  return data.length > 0 ? [false, data] : true
}

// Obtener preferencias
export const getPref = async () => {
  const { data, error } = await supabase
    .from('Preferencias')
    .select('preferencia, fk_id_usuario')
    .match({ fk_id_usuario: localStorage.getItem('userId') })

  if (error) return false

  return data.length > 0 ? data : false
}

// ELIMINAR CUENTA DEL USUARIO Y ASI ELIMINAR TODA SU INFORMACION DE CADA UNA DE LAS TABLAS EN FORMA DE CASCADA

// Eliminar usuario
export const deleteUser = async (email, passwd) => {
  // Obtener ID del usuario
  const { data, error: userError } = await supabase
    .from('Usuarios')
    .select('id')
    .match({ email: email, contrasena: passwd })

  if (userError) return false

  const userId = data[0].id

  // Eliminar las filas relacionadas en la tabla Preferencias
  const { error: prefError } = await supabase
    .from('Preferencias')
    .delete()
    .match({ fk_id_usuario: userId })

  if (prefError) return false

  // Eliminar las filas relacionadas en la tabla Productos
  const { error: prodError } = await supabase
    .from('Productos')
    .delete()
    .match({ fk_id_usuario: userId })

  if (prodError) return false

  const { error: favError } = await supabase
    .from('Favoritas')
    .delete()
    .match({ fk_id_usuario: userId })

  if (favError) return false

  // Eliminar el usuario de la tabla Usuarios
  const { error: userDeleteError } = await supabase
    .from('Usuarios')
    .delete()
    .match({ id: userId })

  if (userDeleteError) return false

  return true
}

// Función para actualizar la tabla de Productos
export const updateProducts = async (product1, product2, product3, product4) => {
  const { error } = await supabase
    .from('Productos')
    .update({ producto1: product1, producto2: product2, producto3: product3, producto4: product4 })
    .eq('fk_id_usuario', localStorage.getItem('userId'))
    .select()
}

// Función para actualizar preferencias
export const updatePref = async (pref) => {
  const { error } = await supabase
    .from('Preferencias')
    .update({ preferencia: pref })
    .eq('fk_id_usuario', localStorage.getItem('userId'))
}
