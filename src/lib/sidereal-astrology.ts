/**
 * Sidereal Astrology System Implementation
 * Using Lahiri Ayanamsa for sidereal calculations
 * Integrates with Dreamspell calendar system
 */

export interface BirthData {
  date: Date;
  time: string; // HH:MM in 24-hour format
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
  country?: string;
}

export interface Planet {
  name: string;
  symbol: string;
  longitude: number; // Degrees from 0-360
  sign: ZodiacSign;
  house: number;
  retrograde: boolean;
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  degrees: number; // 0-30 within the sign
}

export interface House {
  number: number;
  sign: ZodiacSign;
  cusp: number; // Degree of zodiac where house begins
  planets: Planet[];
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string; // conjunction, opposition, trine, square, sextile, etc.
  orb: number;
  exact: boolean;
}

export interface SiderealChart {
  ascendant: ZodiacSign;
  midheaven: ZodiacSign;
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  moonPhase: MoonPhase;
  nakshatras: NakshatraInfo;
}

export interface MoonPhase {
  phase: string;
  illumination: number; // 0-100%
  age: number; // Days since new moon
}

export interface NakshatraInfo {
  sun: Nakshatra;
  moon: Nakshatra;
  ascendant: Nakshatra;
}

export interface Nakshatra {
  name: string;
  lord: string;
  symbol: string;
  deity: string;
  gana: 'deva' | 'manushya' | 'rakshasa';
  nature: string;
  pada: number; // 1-4
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈', element: 'fire', quality: 'cardinal', ruler: 'Mars', degrees: 0 },
  { name: 'Taurus', symbol: '♉', element: 'earth', quality: 'fixed', ruler: 'Venus', degrees: 0 },
  { name: 'Gemini', symbol: '♊', element: 'air', quality: 'mutable', ruler: 'Mercury', degrees: 0 },
  { name: 'Cancer', symbol: '♋', element: 'water', quality: 'cardinal', ruler: 'Moon', degrees: 0 },
  { name: 'Leo', symbol: '♌', element: 'fire', quality: 'fixed', ruler: 'Sun', degrees: 0 },
  { name: 'Virgo', symbol: '♍', element: 'earth', quality: 'mutable', ruler: 'Mercury', degrees: 0 },
  { name: 'Libra', symbol: '♎', element: 'air', quality: 'cardinal', ruler: 'Venus', degrees: 0 },
  { name: 'Scorpio', symbol: '♏', element: 'water', quality: 'fixed', ruler: 'Mars', degrees: 0 },
  { name: 'Sagittarius', symbol: '♐', element: 'fire', quality: 'mutable', ruler: 'Jupiter', degrees: 0 },
  { name: 'Capricorn', symbol: '♑', element: 'earth', quality: 'cardinal', ruler: 'Saturn', degrees: 0 },
  { name: 'Aquarius', symbol: '♒', element: 'air', quality: 'fixed', ruler: 'Saturn', degrees: 0 },
  { name: 'Pisces', symbol: '♓', element: 'water', quality: 'mutable', ruler: 'Jupiter', degrees: 0 }
];

export const NAKSHATRAS: Nakshatra[] = [
  { name: 'Ashwini', lord: 'Ketu', symbol: 'Horse Head', deity: 'Ashwini Kumaras', gana: 'deva', nature: 'Light', pada: 1 },
  { name: 'Bharani', lord: 'Venus', symbol: 'Yoni', deity: 'Yama', gana: 'manushya', nature: 'Fierce', pada: 1 },
  { name: 'Krittika', lord: 'Sun', symbol: 'Razor', deity: 'Agni', gana: 'rakshasa', nature: 'Mixed', pada: 1 },
  { name: 'Rohini', lord: 'Moon', symbol: 'Cart', deity: 'Brahma', gana: 'manushya', nature: 'Fixed', pada: 1 },
  { name: 'Mrigashirsha', lord: 'Mars', symbol: 'Deer Head', deity: 'Soma', gana: 'deva', nature: 'Soft', pada: 1 },
  { name: 'Ardra', lord: 'Rahu', symbol: 'Teardrop', deity: 'Rudra', gana: 'manushya', nature: 'Sharp', pada: 1 },
  { name: 'Punarvasu', lord: 'Jupiter', symbol: 'Bow', deity: 'Aditi', gana: 'deva', nature: 'Movable', pada: 1 },
  { name: 'Pushya', lord: 'Saturn', symbol: 'Flower', deity: 'Brihaspati', gana: 'deva', nature: 'Light', pada: 1 },
  { name: 'Ashlesha', lord: 'Mercury', symbol: 'Serpent', deity: 'Nagas', gana: 'rakshasa', nature: 'Sharp', pada: 1 },
  { name: 'Magha', lord: 'Ketu', symbol: 'Throne', deity: 'Pitrs', gana: 'rakshasa', nature: 'Fierce', pada: 1 },
  { name: 'Purva Phalguni', lord: 'Venus', symbol: 'Hammock', deity: 'Bhaga', gana: 'manushya', nature: 'Fierce', pada: 1 },
  { name: 'Uttara Phalguni', lord: 'Sun', symbol: 'Bed', deity: 'Aryaman', gana: 'manushya', nature: 'Fixed', pada: 1 },
  { name: 'Hasta', lord: 'Moon', symbol: 'Hand', deity: 'Savitar', gana: 'deva', nature: 'Light', pada: 1 },
  { name: 'Chitra', lord: 'Mars', symbol: 'Pearl', deity: 'Vishvakarma', gana: 'rakshasa', nature: 'Soft', pada: 1 },
  { name: 'Swati', lord: 'Rahu', symbol: 'Sword', deity: 'Vayu', gana: 'deva', nature: 'Movable', pada: 1 },
  { name: 'Vishakha', lord: 'Jupiter', symbol: 'Archway', deity: 'Indra-Agni', gana: 'rakshasa', nature: 'Mixed', pada: 1 },
  { name: 'Anuradha', lord: 'Saturn', symbol: 'Lotus', deity: 'Mitra', gana: 'deva', nature: 'Soft', pada: 1 },
  { name: 'Jyeshtha', lord: 'Mercury', symbol: 'Earring', deity: 'Indra', gana: 'rakshasa', nature: 'Sharp', pada: 1 },
  { name: 'Mula', lord: 'Ketu', symbol: 'Root', deity: 'Nirriti', gana: 'rakshasa', nature: 'Sharp', pada: 1 },
  { name: 'Purva Ashadha', lord: 'Venus', symbol: 'Fan', deity: 'Apas', gana: 'manushya', nature: 'Fierce', pada: 1 },
  { name: 'Uttara Ashadha', lord: 'Sun', symbol: 'Elephant Tusk', deity: 'Vishva Devas', gana: 'manushya', nature: 'Fixed', pada: 1 },
  { name: 'Shravana', lord: 'Moon', symbol: 'Ear', deity: 'Vishnu', gana: 'deva', nature: 'Movable', pada: 1 },
  { name: 'Dhanishtha', lord: 'Mars', symbol: 'Drum', deity: 'Vasus', gana: 'rakshasa', nature: 'Movable', pada: 1 },
  { name: 'Shatabhisha', lord: 'Rahu', symbol: 'Circle', deity: 'Varuna', gana: 'rakshasa', nature: 'Movable', pada: 1 },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', symbol: 'Sword', deity: 'Aja Ekapada', gana: 'manushya', nature: 'Fierce', pada: 1 },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', symbol: 'Serpent', deity: 'Ahir Budhnya', gana: 'manushya', nature: 'Fixed', pada: 1 },
  { name: 'Revati', lord: 'Mercury', symbol: 'Fish', deity: 'Pushan', gana: 'deva', nature: 'Soft', pada: 1 }
];

export class SiderealCalculator {
  private static readonly LAHIRI_AYANAMSA_1900 = 22.46; // degrees
  private static readonly AYANAMSA_ANNUAL_RATE = 0.0136; // degrees per year

  /**
   * Calculate Lahiri Ayanamsa for a given date
   */
  private calculateAyanamsa(date: Date): number {
    const year = date.getFullYear();
    const yearsSince1900 = year - 1900;
    return SiderealCalculator.LAHIRI_AYANAMSA_1900 + (yearsSince1900 * SiderealCalculator.AYANAMSA_ANNUAL_RATE);
  }

  /**
   * Convert tropical longitude to sidereal longitude
   */
  private tropicalToSidereal(tropicalLongitude: number, date: Date): number {
    const ayanamsa = this.calculateAyanamsa(date);
    let siderealLongitude = tropicalLongitude - ayanamsa;
    
    // Ensure longitude is within 0-360 range
    while (siderealLongitude < 0) siderealLongitude += 360;
    while (siderealLongitude >= 360) siderealLongitude -= 360;
    
    return siderealLongitude;
  }

  /**
   * Get zodiac sign from longitude
   */
  private getZodiacSign(longitude: number): ZodiacSign {
    const signIndex = Math.floor(longitude / 30);
    const degrees = longitude % 30;
    const sign = { ...ZODIAC_SIGNS[signIndex] };
    sign.degrees = degrees;
    return sign;
  }

  /**
   * Get nakshatra from longitude
   */
  private getNakshatra(longitude: number): Nakshatra {
    const nakshatraIndex = Math.floor(longitude / 13.333333); // 360/27
    const pada = Math.floor((longitude % 13.333333) / 3.333333) + 1;
    const nakshatra = { ...NAKSHATRAS[nakshatraIndex] };
    nakshatra.pada = pada;
    return nakshatra;
  }

  /**
   * Calculate simplified planet positions (placeholder for full ephemeris)
   * In production, this would use Swiss Ephemeris or similar
   */
  private calculatePlanetPositions(birthData: BirthData): Planet[] {
    // This is a simplified calculation for demonstration
    // In production, you would use Swiss Ephemeris or astronomical libraries
    const jd = this.dateToJulianDay(birthData.date);
    
    return [
      this.calculateSun(jd, birthData.date),
      this.calculateMoon(jd, birthData.date),
      this.calculateMercury(jd, birthData.date),
      this.calculateVenus(jd, birthData.date),
      this.calculateMars(jd, birthData.date),
      this.calculateJupiter(jd, birthData.date),
      this.calculateSaturn(jd, birthData.date),
      this.calculateRahu(jd, birthData.date),
      this.calculateKetu(jd, birthData.date)
    ];
  }

  /**
   * Convert date to Julian Day Number
   */
  private dateToJulianDay(date: Date): number {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;
    
    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  /**
   * Simplified planetary calculations (placeholders)
   */
  private calculateSun(jd: number, date: Date): Planet {
    // Simplified Sun calculation - in production use Swiss Ephemeris
    const meanLongitude = (280.460 + 0.9856474 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Sun',
      symbol: '☉',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1, // Simplified
      retrograde: false
    };
  }

  private calculateMoon(jd: number, date: Date): Planet {
    // Simplified Moon calculation
    const meanLongitude = (218.316 + 13.176396 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Moon',
      symbol: '☽',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1, // Simplified
      retrograde: false
    };
  }

  private calculateMercury(jd: number, date: Date): Planet {
    const meanLongitude = (252.251 + 1.3833 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Mercury',
      symbol: '☿',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: Math.random() > 0.8 // Simplified retrograde calculation
    };
  }

  private calculateVenus(jd: number, date: Date): Planet {
    const meanLongitude = (181.979 + 0.6151 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Venus',
      symbol: '♀',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: Math.random() > 0.9
    };
  }

  private calculateMars(jd: number, date: Date): Planet {
    const meanLongitude = (355.433 + 0.524 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Mars',
      symbol: '♂',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: Math.random() > 0.85
    };
  }

  private calculateJupiter(jd: number, date: Date): Planet {
    const meanLongitude = (34.351 + 0.083 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Jupiter',
      symbol: '♃',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: Math.random() > 0.8
    };
  }

  private calculateSaturn(jd: number, date: Date): Planet {
    const meanLongitude = (50.077 + 0.034 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Saturn',
      symbol: '♄',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: Math.random() > 0.7
    };
  }

  private calculateRahu(jd: number, date: Date): Planet {
    // Rahu (North Node) moves backwards
    const meanLongitude = (125.044 - 0.053 * (jd - 2451545.0)) % 360;
    const siderealLongitude = this.tropicalToSidereal(meanLongitude, date);
    
    return {
      name: 'Rahu',
      symbol: '☊',
      longitude: siderealLongitude,
      sign: this.getZodiacSign(siderealLongitude),
      house: 1,
      retrograde: true // Always retrograde
    };
  }

  private calculateKetu(jd: number, date: Date): Planet {
    // Ketu is opposite to Rahu
    const rahu = this.calculateRahu(jd, date);
    const ketuLongitude = (rahu.longitude + 180) % 360;
    
    return {
      name: 'Ketu',
      symbol: '☋',
      longitude: ketuLongitude,
      sign: this.getZodiacSign(ketuLongitude),
      house: 1,
      retrograde: true // Always retrograde
    };
  }

  /**
   * Generate complete sidereal chart
   */
  generateSiderealChart(birthData: BirthData): SiderealChart {
    const planets = this.calculatePlanetPositions(birthData);
    const ascendant = this.calculateAscendant(birthData);
    const houses = this.calculateHouses(ascendant, planets);
    const aspects = this.calculateAspects(planets);
    const moonPhase = this.calculateMoonPhase(birthData.date);
    const nakshatras = this.calculateNakshatras(planets);

    return {
      ascendant,
      midheaven: this.getZodiacSign((ascendant.degrees * 30 + 90) % 360),
      planets,
      houses,
      aspects,
      moonPhase,
      nakshatras
    };
  }

  private calculateAscendant(birthData: BirthData): ZodiacSign {
    // Simplified ascendant calculation
    // In production, use local sidereal time and latitude
    const baseAscendant = 30; // Simplified
    return this.getZodiacSign(baseAscendant);
  }

  private calculateHouses(ascendant: ZodiacSign, planets: Planet[]): House[] {
    const houses: House[] = [];
    
    for (let i = 0; i < 12; i++) {
      const houseCusp = (ascendant.degrees * 30 + i * 30) % 360;
      const houseSign = this.getZodiacSign(houseCusp);
      const housePlanets = planets.filter(p => 
        Math.floor(p.longitude / 30) === Math.floor(houseCusp / 30)
      );
      
      houses.push({
        number: i + 1,
        sign: houseSign,
        cusp: houseCusp,
        planets: housePlanets
      });
    }
    
    return houses;
  }

  private calculateAspects(planets: Planet[]): Aspect[] {
    const aspects: Aspect[] = [];
    const aspectOrbs = {
      conjunction: 8,
      opposition: 8,
      trine: 6,
      square: 6,
      sextile: 4
    };

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        let orb = Math.abs(planet1.longitude - planet2.longitude);
        
        // Ensure we use the smaller arc
        if (orb > 180) orb = 360 - orb;
        
        // Check for major aspects
        if (orb <= aspectOrbs.conjunction) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: 'conjunction',
            orb,
            exact: orb <= 1
          });
        } else if (Math.abs(orb - 180) <= aspectOrbs.opposition) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: 'opposition',
            orb: Math.abs(orb - 180),
            exact: Math.abs(orb - 180) <= 1
          });
        } else if (Math.abs(orb - 120) <= aspectOrbs.trine) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: 'trine',
            orb: Math.abs(orb - 120),
            exact: Math.abs(orb - 120) <= 1
          });
        } else if (Math.abs(orb - 90) <= aspectOrbs.square) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: 'square',
            orb: Math.abs(orb - 90),
            exact: Math.abs(orb - 90) <= 1
          });
        } else if (Math.abs(orb - 60) <= aspectOrbs.sextile) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: 'sextile',
            orb: Math.abs(orb - 60),
            exact: Math.abs(orb - 60) <= 1
          });
        }
      }
    }
    
    return aspects;
  }

  private calculateMoonPhase(date: Date): MoonPhase {
    // Simplified moon phase calculation
    const jd = this.dateToJulianDay(date);
    const newMoonJD = 2451550.1; // Reference new moon
    const lunarCycle = 29.530588853; // Days in lunar cycle
    
    const cyclesSinceReference = (jd - newMoonJD) / lunarCycle;
    const currentCyclePosition = cyclesSinceReference - Math.floor(cyclesSinceReference);
    const ageInDays = currentCyclePosition * lunarCycle;
    
    let phase: string;
    let illumination: number;
    
    if (ageInDays < 1) {
      phase = 'New Moon';
      illumination = 0;
    } else if (ageInDays < 7) {
      phase = 'Waxing Crescent';
      illumination = ageInDays * 14.3;
    } else if (ageInDays < 8) {
      phase = 'First Quarter';
      illumination = 50;
    } else if (ageInDays < 14) {
      phase = 'Waxing Gibbous';
      illumination = 50 + (ageInDays - 7) * 7.1;
    } else if (ageInDays < 15) {
      phase = 'Full Moon';
      illumination = 100;
    } else if (ageInDays < 22) {
      phase = 'Waning Gibbous';
      illumination = 100 - (ageInDays - 14) * 7.1;
    } else if (ageInDays < 23) {
      phase = 'Last Quarter';
      illumination = 50;
    } else {
      phase = 'Waning Crescent';
      illumination = 50 - (ageInDays - 22) * 7.1;
    }
    
    return {
      phase,
      illumination: Math.max(0, Math.min(100, illumination)),
      age: ageInDays
    };
  }

  private calculateNakshatras(planets: Planet[]): NakshatraInfo {
    const sun = planets.find(p => p.name === 'Sun')!;
    const moon = planets.find(p => p.name === 'Moon')!;
    
    return {
      sun: this.getNakshatra(sun.longitude),
      moon: this.getNakshatra(moon.longitude),
      ascendant: this.getNakshatra(0) // Simplified - would use actual ascendant
    };
  }
}

// Utility functions
export const formatDegrees = (longitude: number): string => {
  const degrees = Math.floor(longitude);
  const minutes = Math.floor((longitude - degrees) * 60);
  const seconds = Math.floor(((longitude - degrees) * 60 - minutes) * 60);
  return `${degrees}°${minutes}'${seconds}"`;
};

export const getElementColor = (element: string): string => {
  switch (element) {
    case 'fire': return 'text-red-600';
    case 'earth': return 'text-green-600';
    case 'air': return 'text-blue-600';
    case 'water': return 'text-indigo-600';
    default: return 'text-gray-600';
  }
};

export const getAspectColor = (aspectType: string): string => {
  switch (aspectType) {
    case 'conjunction': return 'text-purple-600';
    case 'opposition': return 'text-red-600';
    case 'trine': return 'text-green-600';
    case 'square': return 'text-orange-600';
    case 'sextile': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};