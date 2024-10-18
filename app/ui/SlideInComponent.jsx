'use client';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const SlideInComponent = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-500 ${
        inView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default SlideInComponent;
