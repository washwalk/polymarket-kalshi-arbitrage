// lib/diffraction/fresnel.ts

// Simple complex number type
export interface Complex {
  real: number;
  imag: number;
}

export function complex(real: number, imag: number = 0): Complex {
  return { real, imag };
}

export function multiply(a: Complex, b: Complex): Complex {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  };
}

export function exp(c: Complex): Complex {
  const e = Math.exp(c.real);
  return {
    real: e * Math.cos(c.imag),
    imag: e * Math.sin(c.imag)
  };
}

// Simple 2D FFT implementation (basic, for demo purposes)
export function fft2d(input: Complex[][]): Complex[][] {
  const N = input.length;
  const output: Complex[][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => complex(0, 0))
  );

  // For each frequency (kx, ky)
  for (let ky = 0; ky < N; ky++) {
    for (let kx = 0; kx < N; kx++) {
      let sum = complex(0, 0);

      // Sum over all spatial points (x, y)
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const phase = -2.0 * Math.PI * (((kx * x) + (ky * y)) / N);
          const phaseFactor = exp(complex(0, phase));
          const val = input[y][x];
          sum = {
            real: sum.real + val.real * phaseFactor.real - val.imag * phaseFactor.imag,
            imag: sum.imag + val.real * phaseFactor.imag + val.imag * phaseFactor.real
          };
        }
      }

      output[ky][kx] = sum;
    }
  }

  return output;
}

export function propagateFresnel(
  aperture: number[][],
  z: number, // Distance in meters
  wavelength: number = 532e-9, // Default Green laser
  pixelSize: number = 1e-5
): number[][] {
  const N = aperture.length;
  const k = (2 * Math.PI) / wavelength;

  // Convert aperture to complex field
  const field: Complex[][] = aperture.map(row =>
    row.map(val => complex(val, 0))
  );

  // 1. Apply quadratic phase factor for Fresnel propagation
  const phasedField: Complex[][] = field.map((row, i) =>
    row.map((val, j) => {
      const x = (i - N/2) * pixelSize;
      const y = (j - N/2) * pixelSize;
      const phase = (k * (x * x + y * y)) / (2 * z);
      const phaseFactor = exp(complex(0, phase));
      return multiply(val, phaseFactor);
    })
  );

  // 2. Apply 2D FFT (angular spectrum method)
  const propagatedField = fft2d(phasedField);

  // 3. Convert back to intensity
  return propagatedField.map(row =>
    row.map(c => c.real * c.real + c.imag * c.imag)
  );
}