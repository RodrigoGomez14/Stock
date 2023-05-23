import React,{useState} from 'react'
import { Carousel } from 'react-responsive-carousel';
import { Paper, Typography } from '@material-ui/core';
import {content} from '../../Pages/styles/styles'
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const CarouselCotizaciones = ({ dolares }) => {
    const classes = content()

    return (
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        centerMode={true}
        interval={2000}
        transitionTime={100}
        centerSlidePercentage={20}
        className={classes.CarouselCotizaciones}
      >
        {dolares.map((cotizacion, index) => (
          <Paper key={index} className={classes.PaperCarouselCotizaciones}>
            <Typography variant="h6">{cotizacion.nombre}</Typography>
            <Typography variant="body1">$ {cotizacion.valor}</Typography>
          </Paper>
        ))}
      </Carousel>
    );
  };