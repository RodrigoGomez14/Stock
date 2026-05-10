import React, { Component } from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom'
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
import {Provider} from 'react-redux'
import reducer from './reducers'
import {createStore} from 'redux'
import {NotFound} from './Pages/NotFound'
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import { database, onAuthStateChanged } from './services'
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
              const store=createStore(reducer, {tipoDeCambio:dolar,user:user,...data})
              this.setState({store,user:user,loading:false})
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
    const themeProvider = createMuiTheme({
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
              <Provider store={this.state.store}>
                <BrowserRouter>
                  <Switch>
                    <Route exact path='/' component={Inicio}/>
                    <Route exact path='/Iva' component={Iva}/>
                    <Route exact path='/Clientes' component={Clientes}/>
                    <Route exact path='/Cliente' component={Cliente}/>
                    <Route exact path='/Nuevo-Cliente' component={NuevoCliente}/>
                    <Route exact path='/Editar-Cliente' component={NuevoCliente}/>
                    <Route exact path='/Proveedores' component={Proveedores}/>
                    <Route exact path='/Proveedor' component={Proveedor}/>
                    <Route exact path='/Nuevo-Proveedor' component={NuevoProveedor}/>
                    <Route exact path='/Editar-Proveedor' component={NuevoProveedor}/>
                    <Route exact path='/Expresos' component={Expresos}/>
                    <Route exact path='/Expreso' component={Expreso}/>
                    <Route exact path='/Historial-Cliente' component={HistorialCliente}/>
                    <Route exact path='/Historial-Proveedor' component={HistorialProveedor}/>
                    <Route exact path='/Nuevo-Expreso' component={NuevoExpreso}/>
                    <Route exact path='/Editar-Expreso' component={NuevoExpreso}/>
                    <Route exact path='/Deudas' component={Deudas}/>
                    <Route exact path='/Nuevo-Consumo-Facturado' component={NuevoConsumoFacturado}/>
                    
                    <Route exact path='/Cheques' component={Cheques}/>
                    <Route exact path='/Cheques-Personales' component={ChequesPersonales}/>
                    <Route exact path='/Depositar-Cheque' component={DepositarCheque}/>

                    <Route exact path='/Productos' component={Productos}/>
                    <Route exact path='/Producto' component={Producto}/>
                    <Route exact path='/Nuevo-Producto' component={NuevoProducto}/>
                    <Route exact path='/Editar-Producto' component={NuevoProducto}/>

                    <Route exact path='/Cuentas-Bancarias' component={CuentasBancarias}/>
                    <Route exact path='/Nueva-Cuenta-Bancaria' component={NuevaCuentaBancaria}/>
                    
                    <Route exact path='/Pedidos' component={Pedidos}/>
                    <Route exact path='/Nuevo-Pedido' component={NuevoPedido}/>
                    <Route exact path='/Editar-Pedido' component={NuevoPedido}/>
                    <Route exact path='/Enviar-Pedido' component={EnviarPedido}/>
                    
                    <Route exact path='/Entregas' component={Entregas}/>
                    <Route exact path='/Nueva-Entrega' component={NuevaEntrega}/>
                    <Route exact path='/Editar-Entrega' component={NuevaEntrega}/>
                    <Route exact path='/Recibir-Entrega' component={RecibirEntrega}/>

                    <Route exact path='/Nuevo-Pago-Cliente' component={NuevoPagoCliente}/>
                    <Route exact path='/Nuevo-Pago-Proveedor' component={NuevoPagoProveedor}/>

                    <Route exact path='/Cadenas-De-Produccion' component={CadenasDeProduccion}/>
                    <Route exact path='/Historial-De-Produccion' component={HistorialDeProduccion}/>
                    <Route exact path='/Finalizar-Proceso' component={FinalizarProceso}/>
                    <Route exact path='/Finalizar-Proceso-Propio' component={FinalizarProcesoPropio}/>
                    
                    {/* Nuevas rutas para servicios */}
                    <Route exact path='/Servicios' component={Servicios}/>
                    <Route exact path='/Nuevo-Servicio' component={NuevoServicio}/>
                    <Route exact path='/Editar-Servicio' component={NuevoServicio}/>
                    <Route exact path='/Pagar-Servicios' component={PagarServicios}/>

                    <Route component={NotFound}/>
                  </Switch>
                </BrowserRouter>
              </Provider>
            </ThemeProvider>
        )
      }
      //Si no hay usuario la unica ruta es SignIn
      else{
        return (
          <ThemeProvider theme={themeProvider}>
            <BrowserRouter>
              <Switch>
                <Route exact path='/' component={SignInPage}/>
                <Route component={NotFound}/>
              </Switch>
            </BrowserRouter>
          </ThemeProvider>
        )
      }
    }
  }
}

export default App;
