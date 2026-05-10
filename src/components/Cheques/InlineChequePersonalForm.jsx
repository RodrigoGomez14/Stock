import React, { useState, useEffect } from 'react'
import { Collapse, Paper, Grid, TextField, Button } from '@mui/material'
import { content } from '../../Pages/styles/styles'

export const InlineChequePersonalForm = ({ show, setShow, listaChequesPersonales, setListaChequesPersonales, editIndex, seteditIndex, totalChequesPersonales, setTotalChequesPersonales, cliente }) => {
    const classes = content()
    const [numero, setnumero] = useState('')
    const [vencimiento, setvencimiento] = useState('')
    const [valor, setvalor] = useState('')

    const resetTextFields = () => {
        setnumero('')
        setvencimiento('')
        setvalor('')
    }

    const convertirVencimiento = (vencimiento) => {
        return `${vencimiento.slice(vencimiento.indexOf('/') + 1, vencimiento.lastIndexOf('/'))}/${vencimiento.slice(0, vencimiento.indexOf('/'))}${vencimiento.slice(vencimiento.lastIndexOf('/'))}`
    }

    const agregarCheque = () => {
        let aux = [...listaChequesPersonales]
        aux.push({
            destinatario: cliente,
            numero: numero,
            vencimiento: vencimiento.toLocaleDateString(),
            valor: valor
        })
        setTotalChequesPersonales(parseFloat(totalChequesPersonales) + parseFloat(valor))
        setListaChequesPersonales(aux)
    }

    const editarCheque = () => {
        let aux = [...listaChequesPersonales]
        let nuevoTotal = parseFloat(totalChequesPersonales) - parseFloat(aux[editIndex].valor) + parseFloat(valor)
        const auxVencimiento = vencimiento === (convertirVencimiento(listaChequesPersonales[editIndex].vencimiento)) ? convertirVencimiento(vencimiento) : vencimiento.toLocaleDateString()
        setTotalChequesPersonales(nuevoTotal)
        aux[editIndex] = {
            destinatario: cliente,
            numero: numero,
            vencimiento: auxVencimiento,
            valor: valor
        }
        setListaChequesPersonales(aux)
    }

    useEffect(() => {
        if (editIndex !== -1 && listaChequesPersonales[editIndex]) {
            setnumero(listaChequesPersonales[editIndex].numero)
            setvencimiento(convertirVencimiento(listaChequesPersonales[editIndex].vencimiento))
            setvalor(listaChequesPersonales[editIndex].valor)
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
                                disabled={!numero || !vencimiento || !valor}
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
