'use client';

import React, { useState, useEffect } from 'react';
import { DreamspellCalculator, GalacticSignature, GALACTIC_TONES } from '@/lib/dreamspell';

interface WavespellVisualizationProps {
  currentDate?: Date;
}

export default function WavespellVisualization({ currentDate = new Date() }: WavespellVisualizationProps) {
  const [currentSignature, setCurrentSignature] = useState<GalacticSignature | null>(null);
  const [wavespellKins, setWavespellKins] = useState<GalacticSignature[]>([]);

  useEffect(() => {
    const calculator = new DreamspellCalculator();
    const signature = calculator.getGalacticSignature(currentDate);
    setCurrentSignature(signature);

    // Calculate all 13 kins in the current wavespell
    const wavespellStart = (signature.wavespell - 1) * 13 + 1;
    const kins: GalacticSignature[] = [];
    
    for (let i = 0; i < 13; i++) {
      const kinNumber = wavespellStart + i;
      const kinDate = new Date(currentDate);
      kinDate.setDate(currentDate.getDate() + (kinNumber - signature.kin));
      kins.push(calculator.getGalacticSignature(kinDate));
    }
    
    setWavespellKins(kins);
  }, [currentDate]);

  if (!currentSignature) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 text-white';
      case 'white': return 'bg-gray-100 text-gray-900 border border-gray-300';
      case 'blue': return 'bg-blue-500 text-white';
      case 'yellow': return 'bg-yellow-400 text-gray-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const getCurrentKinIndex = () => {
    return wavespellKins.findIndex(kin => kin.kin === currentSignature.kin);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Current Wavespell
        </h1>
        <div className={`inline-block px-6 py-3 rounded-lg ${getColorClass(currentSignature.color)}`}>
          <span className="text-lg font-semibold">
            Kin {currentSignature.kin} - {currentSignature.galacticTone.name} {currentSignature.solarSeal.name}
          </span>
        </div>
        <p className="text-gray-600 mt-2">
          Wavespell {currentSignature.wavespell} of 20
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-13 gap-2 mb-8">
        {wavespellKins.map((kin, index) => {
          const isCurrentKin = kin.kin === currentSignature.kin;
          const isPast = index < getCurrentKinIndex();
          const isFuture = index > getCurrentKinIndex();
          
          return (
            <div
              key={kin.kin}
              className={`
                p-3 rounded-lg text-center transition-all duration-200 hover:scale-105
                ${getColorClass(kin.color)}
                ${isCurrentKin ? 'ring-4 ring-purple-500 ring-opacity-50' : ''}
                ${isPast ? 'opacity-60' : ''}
                ${isFuture ? 'opacity-80' : ''}
              `}
            >
              <div className="text-sm font-bold">
                Tone {kin.galacticTone.id}
              </div>
              <div className="text-xs">
                {kin.galacticTone.name}
              </div>
              <div className="text-xs mt-1">
                Kin {kin.kin}
              </div>
              <div className="text-xs">
                {kin.solarSeal.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Current Energy</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Tone:</span> {currentSignature.galacticTone.name}
            </div>
            <div>
              <span className="font-medium">Essence:</span> {currentSignature.galacticTone.essence}
            </div>
            <div>
              <span className="font-medium">Action:</span> {currentSignature.galacticTone.action}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Solar Seal</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Seal:</span> {currentSignature.solarSeal.name}
            </div>
            <div>
              <span className="font-medium">Power:</span> {currentSignature.solarSeal.power}
            </div>
            <div>
              <span className="font-medium">Action:</span> {currentSignature.solarSeal.action}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Wavespell Info</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Wavespell:</span> {currentSignature.wavespell}/20
            </div>
            <div>
              <span className="font-medium">Color:</span> {currentSignature.color}
            </div>
            <div>
              <span className="font-medium">Day:</span> {getCurrentKinIndex() + 1}/13
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          13 Galactic Tones of Creation
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {GALACTIC_TONES.map((tone, index) => (
            <div
              key={tone.id}
              className={`
                p-2 rounded text-center text-xs
                ${index < getCurrentKinIndex() ? 'bg-green-100 text-green-800' : ''}
                ${index === getCurrentKinIndex() ? 'bg-purple-200 text-purple-800 font-bold' : ''}
                ${index > getCurrentKinIndex() ? 'bg-gray-100 text-gray-600' : ''}
              `}
            >
              <div className="font-semibold">{tone.id}</div>
              <div>{tone.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}