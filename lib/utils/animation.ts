/**
 * Generate stable random values for animations
 * These values are computed once and don't change on re-render
 */

export const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: 40 + (i * 7) % 60,
    height: 40 + (i * 11) % 60,
    left: (i * 37) % 100,
    top: (i * 23) % 100,
    yOffset: -50 + (i * 13) % 100,
    xOffset: -50 + (i * 17) % 100,
    duration: 10 + (i * 3) % 10,
  }));
};

export const generateLargeParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: 50 + (i * 11) % 100,
    height: 50 + (i * 13) % 100,
    left: (i * 41) % 100,
    top: (i * 29) % 100,
    yOffset: -50 + (i * 17) % 100,
    xOffset: -50 + (i * 19) % 100,
    duration: 10 + (i * 5) % 10,
  }));
};

export const generateConfetti = (count: number) => {
  const colors = ['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#44A8F5'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % 5],
    left: (i * 43) % 100,
    xOffset: -100 + (i * 23) % 200,
    rotation: (i % 2 === 0 ? 1 : -1) * 360,
    duration: 2 + (i * 7) % 3,
    delay: (i * 3) % 5 / 10,
  }));
};
