import React from 'react'
import { Box, Button, Typography, Stepper, Step, StepLabel } from '@mui/material'
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
  showJumpToLast,
}) {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
      {/* Stepper minimal */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3, mt: 2 }}>
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

      {/* Content — full width, sin Paper */}
      <Box sx={{ minHeight: 300 }}>
        {steps[activeStep]}
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 4 }}>
        <Button disabled={activeStep === 0} onClick={onBack} startIcon={<ChevronLeft />} variant="outlined">
          Volver
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showJumpToLast && activeStep < steps.length - 1 && (
            <Button variant="outlined" onClick={() => onNext(steps.length - 1)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 }, fontSize: 12 }}>
              Ir al último paso
            </Button>
          )}
          <Button variant="contained" disabled={disabled}
            onClick={activeStep === steps.length - 1 ? onFinish : () => onNext()}
            endIcon={activeStep === steps.length - 1 ? <Check /> : <ChevronRight />}>
            {activeStep === steps.length - 1 ? finishLabel : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
