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
const checkWhiteSpace =(text)=>{
  var aux = text
  while(aux.indexOf('%20')!=-1){
      aux = aux.slice(0,aux.indexOf('%20')) + ' ' + aux.slice(aux.indexOf('%20')+3)
  }
  return aux
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