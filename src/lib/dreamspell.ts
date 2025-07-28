/**
 * Dreamspell Calendar System Implementation
 * Based on José Argüelles' Dreamspell system
 * 260-day cycle (13 tones × 20 solar seals)
 */

export interface SolarSeal {
  id: number;
  name: string;
  color: 'red' | 'white' | 'blue' | 'yellow';
  essence: string;
  power: string;
  action: string;
}

export interface GalacticTone {
  id: number;
  name: string;
  essence: string;
  action: string;
}

export interface GalacticSignature {
  kin: number;
  solarSeal: SolarSeal;
  galacticTone: GalacticTone;
  wavespell: number;
  color: string;
}

export interface Oracle {
  destiny: number;
  guide: number;
  analog: number;
  antipode: number;
  occult: number;
}

export const SOLAR_SEALS: SolarSeal[] = [
  { id: 1, name: "Red Dragon", color: "red", essence: "Being", power: "Birth", action: "Nurtures" },
  { id: 2, name: "White Wind", color: "white", essence: "Spirit", power: "Breath", action: "Communicates" },
  { id: 3, name: "Blue Night", color: "blue", essence: "Abundance", power: "Intuition", action: "Dreams" },
  { id: 4, name: "Yellow Seed", color: "yellow", essence: "Flowering", power: "Flowering", action: "Targets" },
  { id: 5, name: "Red Serpent", color: "red", essence: "Life Force", power: "Life Force", action: "Survives" },
  { id: 6, name: "White World-Bridger", color: "white", essence: "Death", power: "Equalizes", action: "Equalizes" },
  { id: 7, name: "Blue Hand", color: "blue", essence: "Accomplishment", power: "Accomplishment", action: "Knows" },
  { id: 8, name: "Yellow Star", color: "yellow", essence: "Elegance", power: "Beautifies", action: "Beautifies" },
  { id: 9, name: "Red Moon", color: "red", essence: "Universal Water", power: "Purifies", action: "Purifies" },
  { id: 10, name: "White Dog", color: "white", essence: "Heart", power: "Love", action: "Loves" },
  { id: 11, name: "Blue Monkey", color: "blue", essence: "Magic", power: "Magic", action: "Plays" },
  { id: 12, name: "Yellow Human", color: "yellow", essence: "Free Will", power: "Wisdom", action: "Influences" },
  { id: 13, name: "Red Skywalker", color: "red", essence: "Space", power: "Prophecy", action: "Explores" },
  { id: 14, name: "White Wizard", color: "white", essence: "Timelessness", power: "Enchantment", action: "Enchants" },
  { id: 15, name: "Blue Eagle", color: "blue", essence: "Vision", power: "Vision", action: "Creates" },
  { id: 16, name: "Yellow Warrior", color: "yellow", essence: "Intelligence", power: "Fearlessness", action: "Questions" },
  { id: 17, name: "Red Earth", color: "red", essence: "Navigation", power: "Synchronicity", action: "Evolves" },
  { id: 18, name: "White Mirror", color: "white", essence: "Endlessness", power: "Reflection", action: "Reflects" },
  { id: 19, name: "Blue Storm", color: "blue", essence: "Self-Generation", power: "Self-Generation", action: "Catalyzes" },
  { id: 20, name: "Yellow Sun", color: "yellow", essence: "Universal Fire", power: "Life", action: "Enlightens" }
];

export const GALACTIC_TONES: GalacticTone[] = [
  { id: 1, name: "Magnetic", essence: "Purpose", action: "Unify" },
  { id: 2, name: "Lunar", essence: "Challenge", action: "Polarize" },
  { id: 3, name: "Electric", essence: "Service", action: "Activate" },
  { id: 4, name: "Self-Existing", essence: "Form", action: "Define" },
  { id: 5, name: "Overtone", essence: "Radiance", action: "Empower" },
  { id: 6, name: "Rhythmic", essence: "Equality", action: "Organize" },
  { id: 7, name: "Resonant", essence: "Attunement", action: "Channel" },
  { id: 8, name: "Galactic", essence: "Integrity", action: "Harmonize" },
  { id: 9, name: "Solar", essence: "Intention", action: "Pulse" },
  { id: 10, name: "Planetary", essence: "Manifestation", action: "Perfect" },
  { id: 11, name: "Spectral", essence: "Liberation", action: "Dissolve" },
  { id: 12, name: "Crystal", essence: "Cooperation", action: "Dedicate" },
  { id: 13, name: "Cosmic", essence: "Presence", action: "Endure" }
];

export class DreamspellCalculator {
  private baseDate: Date;
  private baseKin: number;

  constructor() {
    // July 26, 1987 - Dreamspell correlation date
    this.baseDate = new Date(1987, 6, 26);
    this.baseKin = 8; // White Galactic Wizard
  }

  /**
   * Convert Gregorian date to Kin number (1-260)
   */
  gregorianToKin(date: Date): number {
    const daysDiff = Math.floor((date.getTime() - this.baseDate.getTime()) / (1000 * 60 * 60 * 24));
    let kin = (this.baseKin + daysDiff - 1) % 260;
    if (kin <= 0) kin += 260;
    return kin;
  }

  /**
   * Convert Kin number to tone and seal
   */
  kinToToneAndSeal(kin: number): { tone: number; seal: number; kin: number } {
    const tone = ((kin - 1) % 13) + 1;
    const seal = ((kin - 1) % 20) + 1;
    return { tone, seal, kin };
  }

  /**
   * Calculate wavespell number (1-20) from kin
   */
  getWavespell(kin: number): number {
    return Math.floor((kin - 1) / 13) + 1;
  }

  /**
   * Get galactic signature for a given date
   */
  getGalacticSignature(date: Date): GalacticSignature {
    const kin = this.gregorianToKin(date);
    const { tone, seal } = this.kinToToneAndSeal(kin);
    const wavespell = this.getWavespell(kin);
    
    const solarSeal = SOLAR_SEALS[seal - 1];
    const galacticTone = GALACTIC_TONES[tone - 1];
    
    return {
      kin,
      solarSeal,
      galacticTone,
      wavespell,
      color: solarSeal.color
    };
  }

  /**
   * Get current galactic signature
   */
  getCurrentSignature(): GalacticSignature {
    return this.getGalacticSignature(new Date());
  }

  /**
   * Get birth galactic signature
   */
  getBirthSignature(birthDate: Date): GalacticSignature {
    return this.getGalacticSignature(birthDate);
  }
}

export class OracleCalculator {
  private dreamspell: DreamspellCalculator;

  constructor() {
    this.dreamspell = new DreamspellCalculator();
  }

  /**
   * Calculate the complete oracle for a kin
   */
  calculateOracle(kin: number): Oracle {
    return {
      destiny: kin,
      guide: this.calculateGuide(kin),
      analog: this.calculateAnalog(kin),
      antipode: this.calculateAntipode(kin),
      occult: this.calculateOccult(kin)
    };
  }

  /**
   * Calculate guide kin
   */
  private calculateGuide(kin: number): number {
    const { tone, seal } = this.dreamspell.kinToToneAndSeal(kin);
    const color = SOLAR_SEALS[seal - 1].color;
    
    // Guide is same color family, same tone
    const colorSeals = SOLAR_SEALS
      .filter(s => s.color === color)
      .map(s => s.id);
    
    // Find the seal in the same color family based on tone position
    const guidePosition = (tone - 1) % colorSeals.length;
    const guideSeal = colorSeals[guidePosition];
    
    return this.toneAndSealToKin(tone, guideSeal);
  }

  /**
   * Calculate analog kin (support)
   */
  private calculateAnalog(kin: number): number {
    const { tone, seal } = this.dreamspell.kinToToneAndSeal(kin);
    const analogSeal = ((seal + 9) % 20) + 1;
    return this.toneAndSealToKin(tone, analogSeal);
  }

  /**
   * Calculate antipode kin (challenge)
   */
  private calculateAntipode(kin: number): number {
    const { tone, seal } = this.dreamspell.kinToToneAndSeal(kin);
    const antipodeSeal = ((seal + 9) % 20) + 1;
    return this.toneAndSealToKin(tone, antipodeSeal);
  }

  /**
   * Calculate occult kin (hidden power)
   */
  private calculateOccult(kin: number): number {
    const occultKin = 261 - kin;
    return occultKin > 260 ? occultKin - 260 : occultKin;
  }

  /**
   * Convert tone and seal to kin number
   */
  private toneAndSealToKin(tone: number, seal: number): number {
    // This is a simplified calculation - in practice, you'd use the full Dreamspell matrix
    return ((tone - 1) * 20 + (seal - 1)) % 260 + 1;
  }
}

export class DreamspellMatcher {
  private oracle: OracleCalculator;

  constructor() {
    this.oracle = new OracleCalculator();
  }

  /**
   * Find oracle relationships for a user's kin
   */
  findOracleRelationships(userKin: number): Oracle {
    return this.oracle.calculateOracle(userKin);
  }

  /**
   * Find harmonic relationships (every 4 kins)
   */
  findHarmonicRelationships(userKin: number): number[] {
    const harmonicModule = Math.floor((userKin - 1) / 4);
    const harmonics: number[] = [];
    
    for (let i = 0; i < 4; i++) {
      const harmonicKin = (harmonicModule * 4) + i + 1;
      if (harmonicKin <= 260) {
        harmonics.push(harmonicKin);
      }
    }
    
    return harmonics;
  }

  /**
   * Find color family relationships
   */
  findColorFamily(userKin: number): number[] {
    const dreamspell = new DreamspellCalculator();
    const { seal } = dreamspell.kinToToneAndSeal(userKin);
    const color = SOLAR_SEALS[seal - 1].color;
    
    return SOLAR_SEALS
      .filter(s => s.color === color)
      .map(s => s.id);
  }

  /**
   * Find wavespell family (13 kins in same wavespell)
   */
  findWavespellFamily(userKin: number): number[] {
    const dreamspell = new DreamspellCalculator();
    const wavespell = dreamspell.getWavespell(userKin);
    const startKin = (wavespell - 1) * 13 + 1;
    
    const family: number[] = [];
    for (let i = 0; i < 13; i++) {
      family.push(startKin + i);
    }
    
    return family;
  }
}

// Utility functions
export const formatKinSignature = (signature: GalacticSignature): string => {
  return `${signature.galacticTone.name} ${signature.solarSeal.name}`;
};

export const getKinColor = (kin: number): string => {
  const dreamspell = new DreamspellCalculator();
  const { seal } = dreamspell.kinToToneAndSeal(kin);
  return SOLAR_SEALS[seal - 1].color;
};

export const isWavespellStart = (kin: number): boolean => {
  return (kin - 1) % 13 === 0;
};

export const isWavespellEnd = (kin: number): boolean => {
  return kin % 13 === 0;
};