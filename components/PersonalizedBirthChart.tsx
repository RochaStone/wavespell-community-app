'use client';

import React, { useState, useEffect } from 'react';
import { BirthData, SiderealChart, SiderealCalculator, formatDegrees, getElementColor, getAspectColor } from '@/lib/sidereal-astrology';
import { DreamspellCalculator, GalacticSignature, formatKinSignature } from '@/lib/dreamspell';
import { CosmicContainer, CosmicCard, CosmicText, StarField, GlowingOrb, FloatingElement, CosmicButton } from './ui/CosmicTheme';

interface PersonalizedBirthChartProps {
  birthData: BirthData;
  isPaidTier?: boolean;
}

interface ChartView {
  id: string;
  name: string;
  icon: string;
  isPremium?: boolean;
}

const chartViews: ChartView[] = [
  { id: 'overview', name: 'Cosmic Overview', icon: '🌟' },
  { id: 'dreamspell', name: 'Dreamspell Signature', icon: '🌀' },
  { id: 'planets', name: 'Planetary Positions', icon: '🪐' },
  { id: 'houses', name: 'House System', icon: '🏛️', isPremium: true },
  { id: 'aspects', name: 'Sacred Aspects', icon: '🔮', isPremium: true },
  { id: 'nakshatras', name: 'Vedic Stars', icon: '⭐', isPremium: true },
  { id: 'transits', name: 'Current Transits', icon: '🌊', isPremium: true }
];

export default function PersonalizedBirthChart({ birthData, isPaidTier = false }: PersonalizedBirthChartProps) {
  const [activeView, setActiveView] = useState('overview');
  const [siderealChart, setSiderealChart] = useState<SiderealChart | null>(null);
  const [dreamspellSignature, setDreamspellSignature] = useState<GalacticSignature | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateCharts = async () => {
      setIsLoading(true);
      
      try {
        // Generate sidereal chart
        const calculator = new SiderealCalculator();
        const chart = calculator.generateSiderealChart(birthData);
        setSiderealChart(chart);

        // Generate Dreamspell signature
        const dreamspell = new DreamspellCalculator();
        const signature = dreamspell.getBirthSignature(birthData.date);
        setDreamspellSignature(signature);
      } catch (error) {
        console.error('Error generating charts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateCharts();
  }, [birthData]);

  const handleViewChange = (viewId: string) => {
    const view = chartViews.find(v => v.id === viewId);
    if (view?.isPremium && !isPaidTier) {
      // Show upgrade prompt
      alert('This feature requires a premium subscription. Upgrade to unlock advanced chart analysis!');
      return;
    }
    setActiveView(viewId);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Cosmic Header */}
      <div className="text-center">
        <CosmicText variant="primary" size="2xl">
          Your Cosmic Blueprint
        </CosmicText>
        <p className="text-purple-200 mt-2">
          Born {birthData.date.toLocaleDateString()} at {birthData.time} in {birthData.city}, {birthData.country}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Dreamspell Signature */}
        {dreamspellSignature && (
          <CosmicCard title="🌀 Galactic Signature" glowing={true}>
            <div className="text-center space-y-4">
              <div className={`
                inline-block px-6 py-4 rounded-xl text-white font-bold text-lg
                ${dreamspellSignature.color === 'red' ? 'bg-red-500' : ''}
                ${dreamspellSignature.color === 'white' ? 'bg-gray-100 text-gray-900' : ''}
                ${dreamspellSignature.color === 'blue' ? 'bg-blue-500' : ''}
                ${dreamspellSignature.color === 'yellow' ? 'bg-yellow-400 text-gray-900' : ''}
              `}>
                Kin {dreamspellSignature.kin}
              </div>
              <div className="space-y-2">
                <CosmicText variant="accent" size="lg">
                  {formatKinSignature(dreamspellSignature)}
                </CosmicText>
                <p className="text-purple-200 text-sm">
                  Wavespell {dreamspellSignature.wavespell} • {dreamspellSignature.color.charAt(0).toUpperCase() + dreamspellSignature.color.slice(1)} Family
                </p>
              </div>
            </div>
          </CosmicCard>
        )}

        {/* Sun & Moon Signs */}
        {siderealChart && (
          <CosmicCard title="☉ Luminaries" glowing={true}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">☉</span>
                  <div>
                    <div className="font-semibold text-white">Sun</div>
                    <div className="text-sm text-purple-200">Soul Purpose</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {siderealChart.planets.find(p => p.name === 'Sun')?.sign.name}
                  </div>
                  <div className="text-sm text-purple-200">
                    {formatDegrees(siderealChart.planets.find(p => p.name === 'Sun')?.longitude || 0)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">☽</span>
                  <div>
                    <div className="font-semibold text-white">Moon</div>
                    <div className="text-sm text-purple-200">Emotional Nature</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {siderealChart.planets.find(p => p.name === 'Moon')?.sign.name}
                  </div>
                  <div className="text-sm text-purple-200">
                    {formatDegrees(siderealChart.planets.find(p => p.name === 'Moon')?.longitude || 0)}
                  </div>
                </div>
              </div>
            </div>
          </CosmicCard>
        )}
      </div>

      {/* Moon Phase */}
      {siderealChart && (
        <CosmicCard title="🌙 Birth Moon Phase">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-white">
                {siderealChart.moonPhase.phase}
              </div>
              <div className="text-purple-200">
                {Math.round(siderealChart.moonPhase.illumination)}% illuminated
              </div>
            </div>
            <div className="text-4xl">
              {siderealChart.moonPhase.phase.includes('New') ? '🌑' :
               siderealChart.moonPhase.phase.includes('Waxing Crescent') ? '🌒' :
               siderealChart.moonPhase.phase.includes('First Quarter') ? '🌓' :
               siderealChart.moonPhase.phase.includes('Waxing Gibbous') ? '🌔' :
               siderealChart.moonPhase.phase.includes('Full') ? '🌕' :
               siderealChart.moonPhase.phase.includes('Waning Gibbous') ? '🌖' :
               siderealChart.moonPhase.phase.includes('Last Quarter') ? '🌗' : '🌘'}
            </div>
          </div>
        </CosmicCard>
      )}
    </div>
  );

  const renderDreamspell = () => {
    if (!dreamspellSignature) return null;

    return (
      <div className="space-y-8">
        <CosmicCard title="🌀 Complete Dreamspell Profile">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-purple-300">Galactic Tone</label>
                <div className="text-xl font-semibold text-white">
                  {dreamspellSignature.galacticTone.name}
                </div>
                <div className="text-purple-200 text-sm">
                  {dreamspellSignature.galacticTone.essence} • {dreamspellSignature.galacticTone.action}
                </div>
              </div>

              <div>
                <label className="text-sm text-purple-300">Solar Seal</label>
                <div className="text-xl font-semibold text-white">
                  {dreamspellSignature.solarSeal.name}
                </div>
                <div className="text-purple-200 text-sm">
                  {dreamspellSignature.solarSeal.essence} • {dreamspellSignature.solarSeal.power}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-purple-300">Wavespell</label>
                <div className="text-xl font-semibold text-white">
                  {dreamspellSignature.wavespell} of 20
                </div>
                <div className="text-purple-200 text-sm">
                  Your 13-day creation cycle
                </div>
              </div>

              <div>
                <label className="text-sm text-purple-300">Color Family</label>
                <div className="text-xl font-semibold text-white capitalize">
                  {dreamspellSignature.color}
                </div>
                <div className="text-purple-200 text-sm">
                  Cosmic energy resonance
                </div>
              </div>
            </div>
          </div>
        </CosmicCard>
      </div>
    );
  };

  const renderPlanets = () => {
    if (!siderealChart) return null;

    return (
      <div className="space-y-6">
        <CosmicCard title="🪐 Planetary Positions">
          <div className="grid gap-4">
            {siderealChart.planets.map((planet) => (
              <div key={planet.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{planet.symbol}</span>
                  <div>
                    <div className="font-semibold text-white">{planet.name}</div>
                    <div className={`text-sm ${getElementColor(planet.sign.element)}`}>
                      {planet.sign.element} • {planet.sign.quality}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {planet.sign.name} {planet.retrograde && '℞'}
                  </div>
                  <div className="text-sm text-purple-200">
                    {formatDegrees(planet.longitude)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CosmicCard>
      </div>
    );
  };

  const renderPremiumPlaceholder = (title: string, description: string) => (
    <CosmicCard title={title}>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <CosmicText variant="accent" size="lg">Premium Feature</CosmicText>
        <p className="text-purple-200 mt-2 mb-6">{description}</p>
        <CosmicButton variant="primary" onClick={() => alert('Upgrade to Premium!')}>
          Unlock Premium Features
        </CosmicButton>
      </div>
    </CosmicCard>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <CosmicText variant="ethereal">Calculating cosmic patterns...</CosmicText>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview': return renderOverview();
      case 'dreamspell': return renderDreamspell();
      case 'planets': return renderPlanets();
      case 'houses': 
        return isPaidTier ? 
          <div>House system content here</div> : 
          renderPremiumPlaceholder('🏛️ House System', 'Explore how planetary energies manifest in different life areas');
      case 'aspects': 
        return isPaidTier ? 
          <div>Aspects content here</div> : 
          renderPremiumPlaceholder('🔮 Sacred Aspects', 'Discover the geometric relationships between your planets');
      case 'nakshatras': 
        return isPaidTier ? 
          <div>Nakshatras content here</div> : 
          renderPremiumPlaceholder('⭐ Vedic Stars', 'Uncover your connection to the ancient star wisdom');
      case 'transits': 
        return isPaidTier ? 
          <div>Transits content here</div> : 
          renderPremiumPlaceholder('🌊 Current Transits', 'See how current planetary movements affect your chart');
      default: return renderOverview();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Cosmic background effects */}
      <StarField density={80} animated={true} />
      <GlowingOrb size={400} color="rgba(147, 51, 234, 0.2)" className="top-0 right-0" />
      <GlowingOrb size={250} color="rgba(59, 130, 246, 0.15)" className="bottom-0 left-0" />

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Navigation */}
        <CosmicContainer variant="secondary" className="mb-8 p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {chartViews.map((view) => (
              <FloatingElement key={view.id}>
                <button
                  onClick={() => handleViewChange(view.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300
                    flex items-center space-x-2
                    ${activeView === view.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }
                    ${view.isPremium && !isPaidTier ? 'opacity-60' : ''}
                  `}
                >
                  <span>{view.icon}</span>
                  <span>{view.name}</span>
                  {view.isPremium && !isPaidTier && <span className="text-xs">🔒</span>}
                </button>
              </FloatingElement>
            ))}
          </div>
        </CosmicContainer>

        {/* Main Content */}
        <CosmicContainer variant="primary" className="p-8">
          {renderContent()}
        </CosmicContainer>
      </div>
    </div>
  );
}