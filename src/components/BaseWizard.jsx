import React from 'react'
import {
  Stepper, Step, StepLabel, StepContent,
  Button, Paper, Grid, Typography, Box, Chip
} from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'

const stepIcons = {
  detalles: '1',
  productos: '2',
  pago: '3',
  confirmacion: '4',
}

export function BaseWizard({
  steps,
  activeStep,
  onNext,
  onBack,
  onFinish,
  disabled,
  labels,
  finishLabel = 'Finalizar',
  finishIcon: FinishIcon,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        maxWidth: 800,
        mx: 'auto',
        mt: 2,
      }}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Último paso</Typography>
                ) : null
              }
              StepIconComponent={() => (
                <Chip
                  size="small"
                  label={index + 1}
                  color={activeStep >= index ? 'primary' : 'default'}
                  sx={{
                    minWidth: 32,
                    fontWeight: 700,
                    borderRadius: '50%',
                  }}
                />
              )}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  cursor: 'pointer',
                  color: activeStep >= index ? 'primary.main' : 'text.secondary',
                  fontWeight: activeStep === index ? 700 : 400,
                }}
                onClick={() => {}}
              >
                {label}
              </Typography>
            </StepLabel>
            <StepContent>
              {steps[index] && steps[index]}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button
                    disabled={activeStep === 0}
                    onClick={onBack}
                    variant="outlined"
                    size="small"
                  >
                    Volver
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={disabled}
                    onClick={activeStep === steps.length - 1 ? onFinish : onNext}
                    size="small"
                    endIcon={activeStep === steps.length - 1 && FinishIcon}
                  >
                    {activeStep === steps.length - 1 ? finishLabel : 'Siguiente'}
                  </Button>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  )
}
