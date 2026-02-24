import { generateParticles, generateLargeParticles, generateConfetti } from '@/lib/utils/animation';

describe('Animation Utilities', () => {
  describe('generateParticles', () => {
    it('generates correct number of particles', () => {
      const particles = generateParticles(10);
      expect(particles).toHaveLength(10);
    });

    it('generates particles with correct properties', () => {
      const particles = generateParticles(5);
      
      particles.forEach((particle, index) => {
        expect(particle).toHaveProperty('id', index);
        expect(particle).toHaveProperty('width');
        expect(particle).toHaveProperty('height');
        expect(particle).toHaveProperty('left');
        expect(particle).toHaveProperty('top');
        expect(particle).toHaveProperty('yOffset');
        expect(particle).toHaveProperty('xOffset');
        expect(particle).toHaveProperty('duration');
      });
    });

    it('generates consistent values for same count', () => {
      const particles1 = generateParticles(5);
      const particles2 = generateParticles(5);
      expect(particles1).toEqual(particles2);
    });

    it('generates particles with values in expected ranges', () => {
      const particles = generateParticles(20);
      
      particles.forEach((particle) => {
        expect(particle.width).toBeGreaterThanOrEqual(40);
        expect(particle.width).toBeLessThan(100);
        expect(particle.height).toBeGreaterThanOrEqual(40);
        expect(particle.height).toBeLessThan(100);
        expect(particle.left).toBeGreaterThanOrEqual(0);
        expect(particle.left).toBeLessThan(100);
        expect(particle.top).toBeGreaterThanOrEqual(0);
        expect(particle.top).toBeLessThan(100);
      });
    });
  });

  describe('generateLargeParticles', () => {
    it('generates correct number of large particles', () => {
      const particles = generateLargeParticles(8);
      expect(particles).toHaveLength(8);
    });

    it('generates large particles with correct properties', () => {
      const particles = generateLargeParticles(5);
      
      particles.forEach((particle, index) => {
        expect(particle).toHaveProperty('id', index);
        expect(particle).toHaveProperty('width');
        expect(particle).toHaveProperty('height');
        expect(particle).toHaveProperty('left');
        expect(particle).toHaveProperty('top');
        expect(particle).toHaveProperty('yOffset');
        expect(particle).toHaveProperty('xOffset');
        expect(particle).toHaveProperty('duration');
      });
    });

    it('generates larger particles than regular particles', () => {
      const regular = generateParticles(10);
      const large = generateLargeParticles(10);
      
      // Check that large particles generally have larger dimensions
      const avgRegularWidth = regular.reduce((sum, p) => sum + p.width, 0) / regular.length;
      const avgLargeWidth = large.reduce((sum, p) => sum + p.width, 0) / large.length;
      
      expect(avgLargeWidth).toBeGreaterThan(avgRegularWidth);
    });

    it('generates consistent values for same count', () => {
      const particles1 = generateLargeParticles(5);
      const particles2 = generateLargeParticles(5);
      expect(particles1).toEqual(particles2);
    });
  });

  describe('generateConfetti', () => {
    it('generates correct number of confetti', () => {
      const confetti = generateConfetti(15);
      expect(confetti).toHaveLength(15);
    });

    it('generates confetti with correct properties', () => {
      const confetti = generateConfetti(10);
      
      confetti.forEach((piece, index) => {
        expect(piece).toHaveProperty('id', index);
        expect(piece).toHaveProperty('color');
        expect(piece).toHaveProperty('left');
        expect(piece).toHaveProperty('xOffset');
        expect(piece).toHaveProperty('rotation');
        expect(piece).toHaveProperty('duration');
        expect(piece).toHaveProperty('delay');
      });
    });

    it('uses predefined color palette', () => {
      const confetti = generateConfetti(20);
      const colors = ['#FF6B35', '#F7931E', '#FDC830', '#4ECDC4', '#44A8F5'];
      
      confetti.forEach((piece) => {
        expect(colors).toContain(piece.color);
      });
    });

    it('generates rotation in both directions', () => {
      const confetti = generateConfetti(10);
      const positiveRotations = confetti.filter((p) => p.rotation > 0);
      const negativeRotations = confetti.filter((p) => p.rotation < 0);
      
      expect(positiveRotations.length).toBeGreaterThan(0);
      expect(negativeRotations.length).toBeGreaterThan(0);
    });

    it('generates consistent values for same count', () => {
      const confetti1 = generateConfetti(10);
      const confetti2 = generateConfetti(10);
      expect(confetti1).toEqual(confetti2);
    });

    it('generates confetti with values in expected ranges', () => {
      const confetti = generateConfetti(20);
      
      confetti.forEach((piece) => {
        expect(piece.left).toBeGreaterThanOrEqual(0);
        expect(piece.left).toBeLessThan(100);
        expect(piece.duration).toBeGreaterThanOrEqual(2);
        expect(piece.duration).toBeLessThan(5);
        expect(piece.delay).toBeGreaterThanOrEqual(0);
        expect(piece.delay).toBeLessThan(0.5);
      });
    });
  });
});
