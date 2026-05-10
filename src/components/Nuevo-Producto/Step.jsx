import React, { useState } from 'react'
import {Grid, Button,Switch,InputLabel,Select,Input,MenuItem,Paper,FormControl, TextField,Tab,Tabs,AppBar,Typography,Box,FormControlLabel,Collapse,Checkbox,FormGroup,Autocomplete,Divider} from '@mui/material'
import {AddOutlined} from '@mui/icons-material'
import {content} from '../../Pages/styles/styles'
import { StepperNuevoProducto } from './StepperNuevoProducto'
import {Subproductos} from './Subproductos'
import {Matrices} from './Matrices'
import {DialogEliminarElemento} from './Dialogs/DialogEliminarElemento'
import Empty from '../../images/Empty.png'

export const Step = ({tipoDeDato,nombre,setnombre,precio,setprecio,matrices,setMatrices,cantidad,setcantidad,proveedoresList,disableCantidad,cadenaDeProduccion,setcadenaDeProduccion,isSubproducto,setIsSubproducto,subproductos,setSubproductos,subproductosList,proveedores}) =>{
    const classes = content()
    const [showDialogNuevaMatriz,setshowDialogNuevaMatriz]=useState(false)
    const [editIndexMatriz,seteditIndexMatriz]=useState(-1)
    const [showDialog,setshowDialog]=useState(false)
    const [editIndex,seteditIndex]=useState(-1)
    const [showDialogDelete,setshowDialogDelete]=useState(false)
    const [deleteIndex,setdeleteIndex]=useState(undefined)

    // Proceso form state
    const [nombreProceso, setNombreProceso] = useState(undefined)
    const [proveedor, setProveedor] = useState(undefined)
    const [isProcesoPropio, setIsProcesoPropio] = useState(false)

    // Matriz form state
    const [nombreMatriz, setNombreMatriz] = useState(undefined)

    // Subproducto form state
    const [nombreSubproducto, setNombreSubproducto] = useState(undefined)
    const [cantidadSubproducto, setCantidadSubproducto] = useState(undefined)

    React.useEffect(() => {
        if (editIndex !== -1 && showDialog) {
            if (tipoDeDato === 'Cadena De Produccion') {
                setNombreProceso(cadenaDeProduccion[editIndex].proceso)
                setProveedor(cadenaDeProduccion[editIndex].proveedor)
                setIsProcesoPropio(cadenaDeProduccion[editIndex].isProcesoPropio)
            } else if (tipoDeDato === 'Componentes') {
                setNombreSubproducto(subproductos[editIndex].nombre)
                setCantidadSubproducto(subproductos[editIndex].cantidad)
            }
        }
    }, [editIndex, showDialog, tipoDeDato])

    React.useEffect(() => {
        if (editIndexMatriz !== -1 && showDialogNuevaMatriz) {
            setNombreMatriz(matrices[editIndexMatriz].nombre)
        }
    }, [editIndexMatriz, showDialogNuevaMatriz])

    const openDialogDelete = (index) =>{
        setdeleteIndex(index)
        setshowDialogDelete(true)
    }

    const renderStep = () =>{
        switch (tipoDeDato) {
            case 'Detalles': 
                return(
                    <Grid container item xs={12} direction='column' alignItems='center' spacing={3}>
                        <Grid item>
                            {console.log(isSubproducto)}
                            <FormControlLabel 
                                control={
                                    <Switch
                                        checked={Boolean(isSubproducto)}
                                        value={isSubproducto}
                                        color='default'
                                        onChange={e=>{
                                            setIsSubproducto(!isSubproducto)
                                        }}
                                    />
                                } 
                                label="Subproducto" />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={nombre}
                                label="Nombre"
                                onChange={e=>{
                                    setnombre(e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={precio}
                                onChange={e=>{
                                    setprecio(e.target.value)
                                }}
                                disabled={!nombre}
                                type='number'
                                label="Precio"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                value={cantidad}
                                disabled={disableCantidad}
                                onChange={e=>{
                                    setcantidad(e.target.value)
                                }}
                                type='number'
                                label="Cantidad"
                            />
                        </Grid>
                    </Grid>
                )
            case 'Cadena de Producción':
                return(
                    <Box>
                        <Typography variant="body2" fontWeight={600} gutterBottom>Pasos de la cadena de producción</Typography>

                        {cadenaDeProduccion.map((p, i) => (
                            <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>{p.proceso}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {p.isProcesoPropio ? 'Proceso propio' : `Proveedor: ${p.proveedor || '—'}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Button size="small" variant="outlined" onClick={() => { seteditIndex(i); setNombreProceso(p.proceso); setProveedor(p.proveedor); setIsProcesoPropio(p.isProcesoPropio); setshowDialog(true) }}>
                                        Editar
                                    </Button>
                                    <Button size="small" color="error" variant="outlined" onClick={() => { setdeleteIndex(i); setshowDialogDelete(true) }}>
                                        Eliminar
                                    </Button>
                                </Box>
                            </Paper>
                        ))}

                        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => { setshowDialog(true); seteditIndex(-1); setNombreProceso(''); setProveedor(''); setIsProcesoPropio(false) }} sx={{ mb: 2 }}>
                            Agregar Proceso
                        </Button>

                        <Collapse in={showDialog}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    {editIndex !== -1 ? 'Editar Proceso' : 'Nuevo Proceso'}
                                </Typography>

                                {/* Tipo de proceso — cards seleccionables */}
                                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    TIPO DE PROCESO
                                </Typography>
                                <Grid container spacing={1} sx={{ mb: 2 }}>
                                    {['Fundido', 'Mecanizado', 'Pintado', 'Ensamblado', 'Laminado', 'Corte', 'Soldadura'].map((tipo) => (
                                        <Grid item xs={6} sm={4} md={3} key={tipo}>
                                            <Paper
                                                variant="outlined"
                                                onClick={() => setNombreProceso(tipo)}
                                                sx={{
                                                    py: 1.5, px: 1, borderRadius: 2, textAlign: 'center', cursor: 'pointer',
                                                    borderColor: nombreProceso === tipo ? 'primary.main' : 'divider',
                                                    borderWidth: nombreProceso === tipo ? 2 : 1,
                                                    bgcolor: nombreProceso === tipo ? 'action.selected' : 'transparent',
                                                    transition: '0.15s', '&:hover': { borderColor: 'primary.light' },
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight={600}>{tipo}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel control={<Checkbox checked={isProcesoPropio} disabled={!!proveedor}
                                            onChange={() => { setIsProcesoPropio(!isProcesoPropio); if (!isProcesoPropio) setProveedor('') }} />}
                                            label="Proceso propio (no tiene proveedor)" />
                                    </Grid>
                                    {!isProcesoPropio && (
                                        <Grid item xs={12}>
                                            <Autocomplete freeSolo
                                                options={proveedores ? Object.keys(proveedores) : []}
                                                value={proveedor} onInputChange={(_, v) => setProveedor(v || '')} onChange={(_, v) => setProveedor(v || '')}
                                                disabled={!proveedores || isProcesoPropio}
                                                renderInput={(p) => <TextField {...p} label="Proveedor encargado" fullWidth size="small" />} />
                                        </Grid>
                                    )}
                                </Grid>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Button variant="contained" size="small" disabled={!nombreProceso || (!proveedor && !isProcesoPropio)}
                                        onClick={() => {
                                            if (editIndex !== -1) {
                                                let aux = [...cadenaDeProduccion]
                                                aux[editIndex] = { proceso: nombreProceso, proveedor: proveedor || null, isProcesoPropio }
                                                setcadenaDeProduccion(aux)
                                            } else {
                                                setcadenaDeProduccion([...cadenaDeProduccion, { proceso: nombreProceso, proveedor: proveedor || null, isProcesoPropio }])
                                            }
                                            setshowDialog(false); setNombreProceso(''); setProveedor(''); setIsProcesoPropio(false); seteditIndex(-1)
                                        }}>
                                        {editIndex !== -1 ? 'Guardar' : 'Agregar'}
                                    </Button>
                                    <Button variant="outlined" size="small" onClick={() => { setshowDialog(false); seteditIndex(-1); setNombreProceso(''); setProveedor(''); setIsProcesoPropio(false) }}>
                                        Cancelar
                                    </Button>
                                </Box>
                            </Paper>
                        </Collapse>
                    </Box>
                )
            case 'Componentes': 
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialog(true)}}>
                                Agregar Subproducto
                            </Button>
                        </Grid>
                        {subproductos.length?
                            <Grid container item xs={12} justify='center' >
                                <Subproductos subproductos={subproductos} seteditIndex={seteditIndex} showDialog={()=>{setshowDialog(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Posee Componentes</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <Collapse in={showDialog}>
                            <Paper elevation={3} style={{ padding: 16, marginTop: 16, width: '100%' }}>
                                <Grid container direction='column' alignItems='center' spacing={2}>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            {editIndex !== -1 ? 'Editar Subproducto' : 'Agregar Nuevo Subproducto'}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <FormControl fullWidth>
                                            <InputLabel id="subproducto-label">Subproductos</InputLabel>
                                            <Select
                                                value={nombreSubproducto}
                                                onChange={(e)=>{setNombreSubproducto(e.target.value)}}
                                                input={<Input />}
                                            >
                                                {subproductosList.map(subproducto => (
                                                    <MenuItem key={subproducto.nombre} value={subproducto.nombre}>
                                                        {subproducto.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            color='primary'
                                            label='Cantidad'
                                            value={cantidadSubproducto}
                                            onChange={e=>{setCantidadSubproducto(e.target.value)}}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={()=>{
                                            if(editIndex !== -1) seteditIndex(-1)
                                            setNombreSubproducto(undefined)
                                            setCantidadSubproducto(undefined)
                                            setshowDialog(false)
                                        }}>Cancelar</Button>
                                        <Button
                                            disabled={!cantidadSubproducto || !nombreSubproducto}
                                            onClick={()=>{
                                                if(editIndex !== -1){
                                                    let aux = subproductos
                                                    aux[editIndex]={nombre:nombreSubproducto,cantidad:cantidadSubproducto}
                                                    setSubproductos(aux)
                                                    seteditIndex(-1)
                                                } else {
                                                    let aux = subproductos
                                                    aux.push({nombre:nombreSubproducto?nombreSubproducto:null,cantidad:cantidadSubproducto?cantidadSubproducto:null})
                                                    setSubproductos(aux)
                                                }
                                                setNombreSubproducto(undefined)
                                                setCantidadSubproducto(undefined)
                                                setshowDialog(false)
                                            }}
                                        >
                                            {editIndex !== -1 ? 'Editar' : 'Agregar'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Collapse>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={subproductos} setDatos={setSubproductos} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Subproducto'/>
                    </Grid>
                )
            case 'Matrices': 
                return(
                    <Grid container item xs={12} justify='center' spacing={3}>
                        <Grid container item xs={12} justify='center' >
                            <Button variant='contained' color='primary' startIcon={<AddOutlined/>} onClick={()=>{setshowDialogNuevaMatriz(true)}}>
                                Agregar Matriz / Noyo
                            </Button>
                        </Grid>
                        {matrices.length?
                            <Grid container item xs={12} justify='center' >
                                {console.log(matrices)}
                                <Matrices matrices={matrices} seteditIndexMatriz={seteditIndexMatriz} showDialog={()=>{setshowDialogNuevaMatriz(true)}} openDialogDelete={i=>{openDialogDelete(i)}}/>
                            </Grid>
                            :
                            <Grid container xs={12} justify='center' spacing={2}>
                                <Grid container item xs={12} justify='center'>
                                    <Typography variant='h5'>No Posee Matrices / Noyos</Typography>
                                </Grid>
                                <Grid item>
                                    <img src={Empty} alt="" height='200px'/>
                                </Grid>
                            </Grid>
                        }
                        <Collapse in={showDialogNuevaMatriz}>
                            <Paper elevation={3} style={{ padding: 16, marginTop: 16, width: '100%' }}>
                                <Grid container direction='column' alignItems='center' spacing={2}>
                                    <Grid item>
                                        <Typography variant='h6'>
                                            {editIndexMatriz !== -1 ? 'Editar Matriz / Noyo' : 'Agregar Nueva Matriz / Noyo'}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            color='primary'
                                            label='Nombre'
                                            value={nombreMatriz}
                                            onChange={e=>{setNombreMatriz(e.target.value)}}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={()=>{
                                            if(editIndexMatriz !== -1) seteditIndexMatriz(-1)
                                            setNombreMatriz(undefined)
                                            setshowDialogNuevaMatriz(false)
                                        }}>Cancelar</Button>
                                        <Button
                                            disabled={!nombreMatriz}
                                            onClick={()=>{
                                                if(editIndexMatriz !== -1){
                                                    let aux = matrices
                                                    aux[editIndexMatriz]={...aux[editIndexMatriz],nombre:nombreMatriz}
                                                    setMatrices(aux)
                                                    seteditIndexMatriz(-1)
                                                } else {
                                                    let aux = matrices
                                                    aux.push({nombre:nombreMatriz?nombreMatriz:null,ubicacion:"Taller"})
                                                    setMatrices(aux)
                                                }
                                                setNombreMatriz(undefined)
                                                setshowDialogNuevaMatriz(false)
                                            }}
                                        >
                                            {editIndexMatriz !== -1 ? 'Editar' : 'Agregar'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Collapse>
                        <DialogEliminarElemento open={showDialogDelete} setopen={setshowDialogDelete} datos={matrices} setDatos={setMatrices} index={deleteIndex} setdeleteIndex={setdeleteIndex} tipoDeElemento='Matrices'/>
                    </Grid>
                )
            
        }
    }

    return( renderStep() )
}
