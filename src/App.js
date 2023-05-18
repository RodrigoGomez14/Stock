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
import IvaPage from './Pages/IvaPage'
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
import * as firebase from 'firebase'
import {NotFound} from './Pages/NotFound'
import { createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import NuevoPagoProveedor from './Pages/NuevoPagoProveedor';
import NuevoPagoCliente from './Pages/NuevoPagoCliente';
import CadenasDeProduccion from './Pages/CadenasDeProduccion';
import HistorialDeProduccion from './Pages/HistorialDeProduccion';
import FinalizarProceso from './Pages/FinalizarProceso';
import CuentasBancarias from './Pages/CuentasBancarias';
import NuevaCuentaBancaria from './Pages/NuevaCuentaBancaria';
import DepositarCheque from './Pages/DepositarCheque';
import ChequesPersonales from './Pages/ChequesPersonales';

let store 
let data


//FIREBASE
var config = {
    apiKey: "AIzaSyDPmTjxjMxN2abofP8ZczgFGeYQYSvbXHE",
    authDomain: "stock-119e8.firebaseapp.com",
    databaseURL: "https://stock-119e8.firebaseio.com",
    projectId: "stock-119e8",
    storageBucket: "stock-119e8.appspot.com",
    messagingSenderId: "1007277754269",
    appId: "1:1007277754269:web:d1db0def0da907b2"
};

firebase.initializeApp(config)
class App extends Component {
  state={
    loading:true,
  }

  // Comprobacion de usuario y creacion del store
  async componentDidMount(){
    firebase.auth().onAuthStateChanged(async user=>{
      if(user){
        const databaseRef = await firebase.database().ref().child(user.uid)
        databaseRef.on('value', snapshot=>{
          data= snapshot.val()
          store=createStore(reducer, {user:user,...data})
          this.setState({store,user:user,loading:false})
          this.setState({loading:false})
        })
      }
      else{
        this.setState({user:null,loading:false})
        this.setState({loading:false})
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
                    
                    <Route exact path='/Cheques' component={Cheques}/>
                    <Route exact path='/Cheques-Personales' component={ChequesPersonales}/>
                    <Route exact path='/Depositar-Cheque' component={DepositarCheque}/>

                    <Route exact path='/Productos' component={Productos}/>
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
