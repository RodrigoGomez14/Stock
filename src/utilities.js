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
export const checkSearch =(search)=>{
  let aux = checkWhiteSpace(search.slice(1).toString())
  return aux
}

export const checkSearchProducto =(search)=>{
  let aux = checkWhiteSpace(search.slice(1).toString())
  return checkCode(aux)
}
const checkWhiteSpace =(text)=>{
  var aux = text
  while(aux.indexOf('%20')!=-1){
      aux = aux.slice(0,aux.indexOf('%20')) + ' ' + aux.slice(aux.indexOf('%20')+3)
  }
  return aux
}
const checkCode =(text)=>{
  var aux = text
  while(aux.indexOf('%C2%BD')!=-1){
      aux = aux.slice(0,aux.indexOf('%C2%BD')) + ' ½' + aux.slice(aux.indexOf('%C2%BD')+6)
  }
  while(aux.indexOf('%C2%BC')!=-1){
    aux = aux.slice(0,aux.indexOf('%C2%BC')) + ' ¼' + aux.slice(aux.indexOf('%C2%BC')+6)
  }
  while(aux.indexOf('%C2%BE')!=-1){
    aux = aux.slice(0,aux.indexOf('%C2%BE')) + ' ¾' + aux.slice(aux.indexOf('%C2%BE')+6)
  }
  while(aux.indexOf('%22')!=-1){
    aux = aux.slice(0,aux.indexOf('%22')) + '"' + aux.slice(aux.indexOf('%22')+3)
  }
  return aux
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
  let auxCotizaciones = []
  console.log(aux)
  auxCotizaciones[0] = {nombre:'Oficial Compra',valor:parseFloat(aux[0].casa.compra)}
  auxCotizaciones[1] = {nombre:'Oficial Promedio',valor:(parseFloat(aux[0].casa.compra)+parseFloat(aux[0].casa.venta))/2}
  auxCotizaciones[2] = {nombre:'Blue Compra',valor:parseFloat(aux[1].casa.compra)}
  auxCotizaciones[3] = {nombre:'Blue Venta',valor:parseFloat(aux[1].casa.venta)}
  auxCotizaciones[4] = {nombre:'Blue Promedio',valor:(parseFloat(aux[1].casa.compra)+parseFloat(aux[1].casa.venta))/2}
  auxCotizaciones[5] = {nombre:'Oficial Venta',valor:parseFloat(aux[0].casa.venta)}
  return(auxCotizaciones)
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