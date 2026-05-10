import React, { useState, useEffect } from 'react'
import { Collapse, Paper, Grid, TextField, Button } from '@mui/material'
import { content } from '../../Pages/styles/styles'

export const InlineChequeForm = ({ show, setShow, datos, setdatos, editIndex, seteditIndex, total, settotal, cliente }) => {
    const classes = content()
    const [numero, setnumero] = useState('')
    const [banco, setbanco] = useState('')
    const [vencimiento, setvencimiento] = useState('')
    const [valor, setvalor] = useState('')

    const resetTextFields = () => {
        setnumero('')
        setbanco('')
        setvencimiento('')
        setvalor('')
    }

    const convertirVencimiento = (vencimiento) => {
        return `${vencimiento.slice(vencimiento.indexOf('/') + 1, vencimiento.lastIndexOf('/'))}/${vencimiento.slice(0, vencimiento.indexOf('/'))}${vencimiento.slice(vencimiento.lastIndexOf('/'))}`
    }

    const agregarCheque = () => {
        let aux = [...datos]
        aux.push({
            nombre: cliente,
            numero: numero,
            banco: banco,
            vencimiento: vencimiento.toLocaleDateString(),
            valor: valor
        })
        settotal(parseFloat(total) + parseFloat(valor))
        setdatos(aux)
    }

    const editarCheque = () => {
        let aux = [...datos]
        let nuevoTotal = parseFloat(total) - parseFloat(aux[editIndex].valor) + parseFloat(valor)
        const auxVencimiento = vencimiento === (convertirVencimiento(datos[editIndex].vencimiento)) ? convertirVencimiento(vencimiento) : vencimiento.toLocaleDateString()
        settotal(nuevoTotal)
        aux[editIndex] = {
            nombre: cliente,
            numero: numero,
            banco: banco,
            vencimiento: auxVencimiento,
            valor: valor
        }
        setdatos(aux)
    }

    useEffect(() => {
        if (editIndex !== -1 && datos[editIndex]) {
            setnumero(datos[editIndex].numero)
            setbanco(datos[editIndex].banco)
            setvencimiento(convertirVencimiento(datos[editIndex].vencimiento))
            setvalor(datos[editIndex].valor)
        }
    }, [editIndex])

    const handleCancel = () => {
        if (editIndex !== -1) {
            seteditIndex(-1)
        }
        resetTextFields()
        setShow(false)
    }

    const handleSubmit = () => {
        if (editIndex !== -1) {
            editarCheque()
            seteditIndex(-1)
        } else {
            agregarCheque()
        }
        resetTextFields()
        setShow(false)
    }

    return (
        <Collapse in={show}>
            <Paper elevation={2} style={{ padding: 16, marginTop: 8, marginBottom: 8 }}>
                <Grid container direction='column' alignItems='center' spacing={2}>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label='Numero'
                            type='number'
                            value={numero}
                            onChange={e => setnumero(e.target.value)}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label='Banco'
                            value={banco}
                            onChange={e => setbanco(e.target.value)}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label='Fecha de Vencimiento'
                            type='date'
                            InputLabelProps={{ shrink: true }}
                            value={vencimiento}
                            onChange={e => setvencimiento(e.target.value)}
                        />
                    </Grid>
                    <Grid item style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label='Valor'
                            type='number'
                            value={valor}
                            onChange={e => setvalor(e.target.value)}
                        />
                    </Grid>
                    <Grid item container spacing={2} justifyContent='center'>
                        <Grid item>
                            <Button onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                color='primary'
                                disabled={!numero || !banco || !vencimiento || !valor}
                                onClick={handleSubmit}
                            >
                                {editIndex !== -1 ? 'Editar' : 'Agregar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Collapse>
    )
}
