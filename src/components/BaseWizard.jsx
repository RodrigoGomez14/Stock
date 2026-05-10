import React from 'react'
import {
  Box, Button, Paper, Typography, Stepper, Step, StepLabel, Grid
} from '@mui/material'
import { Check, ChevronLeft, ChevronRight } from '@mui/icons-material'

export function BaseWizard({
  steps,
  activeStep,
  onNext,
  onBack,
  onFinish,
  disabled,
  finishLabel = 'Finalizar',
  stepLabels,
}) {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2, px: 2 }}>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ px: 3, pt: 3, pb: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {stepLabels.map((label, i) => (
              <Step key={label} completed={activeStep > i}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: 'primary.main' },
                      '&.Mui-completed': { color: 'success.main' },
                    },
                  }}
                >
                  <Typography variant="caption" fontWeight={activeStep === i ? 700 : 400}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ p: 3, minHeight: 300 }}>
          {steps[activeStep]}
        </Box>

        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={onBack}
            startIcon={<ChevronLeft />}
            variant="outlined"
          >
            Volver
          </Button>
          <Button
            variant="contained"
            disabled={disabled}
            onClick={activeStep === steps.length - 1 ? onFinish : onNext}
            endIcon={activeStep === steps.length - 1 ? <Check /> : <ChevronRight />}
          >
            {activeStep === steps.length - 1 ? finishLabel : 'Siguiente'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
