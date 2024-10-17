"use client"
import React from 'react';
import {useCallback} from "react";
import {loadSlim} from "tsparticles-slim";
import Particles from 'react-tsparticles';
import ParticlesConfig from './particles-config';

const ParticleBack = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return(
    <div id="particle-background">
      <Particles
        id="tsparticles"
        particlesInit="particlesInit"
        particlesLoaded="particlesLoaded"
        init={particlesInit}
        loaded={particlesLoaded}
        options={ParticlesConfig}
        height="100vh"
        width="100vw"
      ></Particles>
    </div>
  )
};

export default ParticleBack;
