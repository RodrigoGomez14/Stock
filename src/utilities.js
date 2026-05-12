export const formatMoney =amount=> {
    let decimalCount = 2
    let decimal = ','
    let thousands = '.'
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
        
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } 
    catch (e) {
      console.log(e)
    }
}
export const obtenerFecha = () =>{
  var f=new Date()
  return `${f.getDate()}/${f.getMonth()+1}/${f.getFullYear()}`
}
export const convertirFecha = (fecha) =>{
  return `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`
}

export const fechaDetallada = () =>{
  let meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
  let diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
  var f=new Date()
  return `${diasSemana[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`
}

// CHECK IF SEARCH CONTAINS WHITE SPACES
export const checkSearch = (search) => {
  try {
    return decodeURIComponent(search.slice(1))
  } catch {
    return search.slice(1)
  }
}

export const checkSearchProducto = (search) => {
  try {
    return decodeURIComponent(search.slice(1))
  } catch {
    return search.slice(1)
  }
}

// Formatea un valor para mostrar (string directamente, objeto extrae campo relevante)
export const fmtValor = (v) => {
  if (typeof v === 'string') return v
  if (typeof v !== 'object' || v === null) return ''
  if (v.mail) return v.mail
  if (v.email) return v.email
  if (v.telefono) return v.telefono
  if (v.numero) return `${v.nombre ? v.nombre + ': ' : ''}${v.numero}`
  if (v.calleYnumero) return [v.calleYnumero, v.ciudad, v.cp, v.provincia].filter(Boolean).join(', ')
  if (v.nombre) return v.nombre
  if (v.descripcion) return v.descripcion
  return JSON.stringify(v)
}

// Busca un producto por id (pushKey) o por nombre
export const getProducto = (productos, id) => {
  if (!productos || !id) return null
  if (productos[id]) return productos[id]
  return Object.values(productos).find((p) => p.nombre === id) || null
}

// Busca un cliente por id (pushKey) o por nombre
export const getCliente = (clientes, id) => {
  if (!clientes || !id) return null
  if (clientes[id]) return clientes[id]
  const found = Object.values(clientes).find((c) => c.nombre === id || c.datos?.nombre === id)
  return found || null
}

// Busca un proveedor por id (pushKey) o por nombre
export const getProveedor = (proveedores, id) => {
  if (!proveedores || !id) return null
  if (proveedores[id]) return proveedores[id]
  const found = Object.values(proveedores).find((p) => p.nombre === id || p.datos?.nombre === id)
  return found || null
}

// Busca un expreso por id (pushKey) o por nombre
export const getExpreso = (expresos, id) => {
  if (!expresos || !id) return null
  if (expresos[id]) return expresos[id]
  const found = Object.values(expresos).find((e) => e.nombre === id || e.datos?.nombre === id)
  return found || null
}

// Migración genérica: toma {key: data} y lo pushea, luego elimina la key vieja
export const migrarModulo = async (uid, modulo, data) => {
  if (!data) return 0
  const { removeData } = await import('./services')
  const firebase = (await import('./services/firebase')).default
  let migrados = 0
  for (const [key, item] of Object.entries(data)) {
    await firebase.database().ref().child(uid).child(modulo).push().set(item)
    await removeData(uid, `${modulo}/${key}`)
    migrados++
  }
  return migrados
}

export const getActualMonth = (date) =>{
  if(date){
    let month = date.slice(date.indexOf('/')+1)
    if(month.indexOf('/')){
      month = month.slice(0,month.indexOf('/'))
    }
    return month
  }
  else{
    return new Date().getMonth()+1
  }
}
export const getActualMonthDetailed = (date) =>{
    return monthsList[new Date().getMonth()]
}
export const filtrarCotizaciones = (aux) => {
  if (!aux || !Array.isArray(aux) || aux.length < 2) return []
  const oficial = aux[0]
  const blue = aux[1]
  return [
    { nombre: 'Oficial Compra', valor: parseFloat(oficial.compra) },
    { nombre: 'Oficial Venta', valor: parseFloat(oficial.venta) },
    { nombre: 'Oficial Promedio', valor: (parseFloat(oficial.compra) + parseFloat(oficial.venta)) / 2 },
    { nombre: 'Blue Compra', valor: parseFloat(blue.compra) },
    { nombre: 'Blue Venta', valor: parseFloat(blue.venta) },
    { nombre: 'Blue Promedio', valor: (parseFloat(blue.compra) + parseFloat(blue.venta)) / 2 },
  ]
}

// OBTENER LISTA DE PRODUCTOS Y SUBPRODUCTOS
export const getProductosList = (productos) =>{
  let aux = []
  if(productos){
      Object.keys(productos).map(key=>{
          if(!productos[key].isSubproducto){
              aux.push(productos[key])
          }
      })
  }
  console.log(aux)
  return aux

}
export const getProductosListWithPrice = (productos) =>{
  let aux = []
  if(productos){
      Object.keys(productos).map(key=>{
          if(!productos[key].isSubproducto){
              aux.push({nombre:productos[key].nombre,precio:productos[key].precio})
          }
      })
  }
  return aux

}
export const getClientList = (clientes) =>{
  let aux = []
  if(clientes){
      Object.keys(clientes).map(key=>{
        aux.push(key)
      })
  }
  return aux

}
export const getSubproductosList = (subproducto) =>{
  let aux = []
  if(subproducto){
      Object.keys(subproducto).map(key=>{
          if(subproducto[key].isSubproducto){
              aux.push(subproducto[key])
          }
      })
  }
  return aux
}

export const getAllProductosList = (subproducto) =>{
  let aux = []
  if(subproducto){
      Object.keys(subproducto).map(key=>{
        aux.push(subproducto[key])
      })
  }
  return aux
}
export const monthsList = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]