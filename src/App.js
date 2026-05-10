import React, { Component } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Clientes from './Pages/Clientes'
import Cliente from './Pages/Cliente'
import NuevoCliente from './Pages/NuevoCliente'
import NuevoProveedor from './Pages/NuevoProveedor'
import Proveedores from './Pages/Proveedores'
import Proveedor from './Pages/Proveedor'
import Expresos from './Pages/Expresos'
import Expreso from './Pages/Expreso'
import NuevoExpreso from './Pages/NuevoExpreso'
import NuevoPedido from './Pages/NuevoPedido'
import Inicio from './Pages/Inicio'
import Deudas from './Pages/Deudas'
import Cheques from './Pages/Cheques'
import Productos from './Pages/Productos'
import Iva from './Pages/Iva'
import HistorialCliente from './Pages/HistorialCliente'
import HistorialProveedor from './Pages/HistorialProveedor';
import Pedidos from './Pages/Pedidos'
import Entregas from './Pages/Entregas'
import NuevaEntrega from './Pages/NuevaEntrega'
import RecibirEntrega from './Pages/RecibirEntrega'
import EnviarPedido from './Pages/EnviarPedido'
import NuevoProducto from './Pages/NuevoProducto'
import {SignInPage} from './Pages/SignIn'
import {PantallaDeCarga} from './Pages/PantallaDeCarga'
import { AppProvider } from './context/AppContext'
import {NotFound} from './Pages/NotFound'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { database, onAuthStateChanged } from './services'
import { RouteInjector } from './services/withRouter'
import NuevoPagoProveedor from './Pages/NuevoPagoProveedor';
import NuevoPagoCliente from './Pages/NuevoPagoCliente';
import CadenasDeProduccion from './Pages/CadenasDeProduccion';
import HistorialDeProduccion from './Pages/HistorialDeProduccion';
import FinalizarProceso from './Pages/FinalizarProceso';
import CuentasBancarias from './Pages/CuentasBancarias';
import NuevaCuentaBancaria from './Pages/NuevaCuentaBancaria';
import DepositarCheque from './Pages/DepositarCheque';
import ChequesPersonales from './Pages/ChequesPersonales';
import FinalizarProcesoPropio from './Pages/FinalizarProcesoPropio';
import NuevoConsumoFacturado from './Pages/NuevoConsumoFacturado';
import Producto from './Pages/Producto';
// Importar nuevas páginas de servicios
import Servicios from './Pages/Servicios';
import NuevoServicio from './Pages/NuevoServicio';
import PagarServicios from './Pages/PagarServicios';

class App extends Component {
  state={
    loading:true,
  }

  componentDidMount(){
    onAuthStateChanged(async user=>{
      if(user){
        const databaseRef = database().ref().child(user.uid)
        databaseRef.on('value', snapshot=>{
          const data = snapshot.val()
          fetch("https://dolarapi.com/v1/dolares/blue")
            .then((response) => response.json())
            .then((dolar)=>{
              this.setState({tipoDeCambio:dolar,user:user,...data,loading:false})
            })
        })
      }
      else{
        this.setState({user:null,loading:false})
      }
    })
  }
  
  render(){
    //creacion del tema 
    const themeProvider = createTheme({
      palette: {
          white:'#fff',
          primary: {
            light: '#5e92f3',
            main: '#01579b',
            dark: '#003c8f',
            contrastText: '#fff',
          },
          secondary: {
            light: '#4f5b62',
            main: '#263238',
            dark: '#000a12',
            contrastText: '#000',
          },
          info:{
            main:'#ffeb3b',
            contrastText:'#000'
          },
          danger:{
            main:'#c62828',
            light:'#ef5350'
          },
          success:{
            main:'#2e7d32',
            light:'#66bb6a',
            dark:'#43a047'
          },
          type:'dark'
      }
  });

    //PANTALLA DE CARGA
    if(this.state.loading){
      return(
          <ThemeProvider theme={themeProvider}>
              <PantallaDeCarga/>
          </ThemeProvider>
      )
    }
    //DIVISION DE RUTAS
    else{
      // RUTEADO DE LA APP
      if(this.state.user){
        return (
          <ThemeProvider theme={themeProvider}>
              <AppProvider value={this.state}>
                <BrowserRouter>
                  <Routes>
                    <Route path='/' element={<RouteInjector component={Inicio}/>}/>
                    <Route path='/Iva' element={<RouteInjector component={Iva}/>}/>
                    <Route path='/Clientes' element={<RouteInjector component={Clientes}/>}/>
                    <Route path='/Cliente' element={<RouteInjector component={Cliente}/>}/>
                    <Route path='/Nuevo-Cliente' element={<RouteInjector component={NuevoCliente}/>}/>
                    <Route path='/Editar-Cliente' element={<RouteInjector component={NuevoCliente}/>}/>
                    <Route path='/Proveedores' element={<RouteInjector component={Proveedores}/>}/>
                    <Route path='/Proveedor' element={<RouteInjector component={Proveedor}/>}/>
                    <Route path='/Nuevo-Proveedor' element={<RouteInjector component={NuevoProveedor}/>}/>
                    <Route path='/Editar-Proveedor' element={<RouteInjector component={NuevoProveedor}/>}/>
                    <Route path='/Expresos' element={<RouteInjector component={Expresos}/>}/>
                    <Route path='/Expreso' element={<RouteInjector component={Expreso}/>}/>
                    <Route path='/Historial-Cliente' element={<RouteInjector component={HistorialCliente}/>}/>
                    <Route path='/Historial-Proveedor' element={<RouteInjector component={HistorialProveedor}/>}/>
                    <Route path='/Nuevo-Expreso' element={<RouteInjector component={NuevoExpreso}/>}/>
                    <Route path='/Editar-Expreso' element={<RouteInjector component={NuevoExpreso}/>}/>
                    <Route path='/Deudas' element={<RouteInjector component={Deudas}/>}/>
                    <Route path='/Nuevo-Consumo-Facturado' element={<RouteInjector component={NuevoConsumoFacturado}/>}/>
                    
                    <Route path='/Cheques' element={<RouteInjector component={Cheques}/>}/>
                    <Route path='/Cheques-Personales' element={<RouteInjector component={ChequesPersonales}/>}/>
                    <Route path='/Depositar-Cheque' element={<RouteInjector component={DepositarCheque}/>}/>

                    <Route path='/Productos' element={<RouteInjector component={Productos}/>}/>
                    <Route path='/Producto' element={<RouteInjector component={Producto}/>}/>
                    <Route path='/Nuevo-Producto' element={<RouteInjector component={NuevoProducto}/>}/>
                    <Route path='/Editar-Producto' element={<RouteInjector component={NuevoProducto}/>}/>

                    <Route path='/Cuentas-Bancarias' element={<RouteInjector component={CuentasBancarias}/>}/>
                    <Route path='/Nueva-Cuenta-Bancaria' element={<RouteInjector component={NuevaCuentaBancaria}/>}/>
                    
                    <Route path='/Pedidos' element={<RouteInjector component={Pedidos}/>}/>
                    <Route path='/Nuevo-Pedido' element={<RouteInjector component={NuevoPedido}/>}/>
                    <Route path='/Editar-Pedido' element={<RouteInjector component={NuevoPedido}/>}/>
                    <Route path='/Enviar-Pedido' element={<RouteInjector component={EnviarPedido}/>}/>
                    
                    <Route path='/Entregas' element={<RouteInjector component={Entregas}/>}/>
                    <Route path='/Nueva-Entrega' element={<RouteInjector component={NuevaEntrega}/>}/>
                    <Route path='/Editar-Entrega' element={<RouteInjector component={NuevaEntrega}/>}/>
                    <Route path='/Recibir-Entrega' element={<RouteInjector component={RecibirEntrega}/>}/>

                    <Route path='/Nuevo-Pago-Cliente' element={<RouteInjector component={NuevoPagoCliente}/>}/>
                    <Route path='/Nuevo-Pago-Proveedor' element={<RouteInjector component={NuevoPagoProveedor}/>}/>

                    <Route path='/Cadenas-De-Produccion' element={<RouteInjector component={CadenasDeProduccion}/>}/>
                    <Route path='/Historial-De-Produccion' element={<RouteInjector component={HistorialDeProduccion}/>}/>
                    <Route path='/Finalizar-Proceso' element={<RouteInjector component={FinalizarProceso}/>}/>
                    <Route path='/Finalizar-Proceso-Propio' element={<RouteInjector component={FinalizarProcesoPropio}/>}/>
                    
                    {/* Nuevas rutas para servicios */}
                    <Route path='/Servicios' element={<RouteInjector component={Servicios}/>}/>
                    <Route path='/Nuevo-Servicio' element={<RouteInjector component={NuevoServicio}/>}/>
                    <Route path='/Editar-Servicio' element={<RouteInjector component={NuevoServicio}/>}/>
                    <Route path='/Pagar-Servicios' element={<RouteInjector component={PagarServicios}/>}/>

                    <Route path='*' element={<RouteInjector component={NotFound}/>}/>
                  </Routes>
                </BrowserRouter>
              </AppProvider>
            </ThemeProvider>
        )
      }
      //Si no hay usuario la unica ruta es SignIn
      else{
        return (
          <ThemeProvider theme={themeProvider}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<RouteInjector component={SignInPage}/>}/>
                <Route path='*' element={<RouteInjector component={NotFound}/>}/>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        )
      }
    }
  }
}

export default App;
