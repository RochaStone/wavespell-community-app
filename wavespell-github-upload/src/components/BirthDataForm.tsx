'use client';

import React, { useState } from 'react';
import { BirthData } from '@/lib/sidereal-astrology';
import { CosmicContainer, CosmicCard, CosmicButton, CosmicText, StarField, GlowingOrb } from './ui/CosmicTheme';

interface BirthDataFormProps {
  onSubmit: (birthData: BirthData) => void;
  initialData?: Partial<BirthData>;
}

export default function BirthDataForm({ onSubmit, initialData }: BirthDataFormProps) {
  const [formData, setFormData] = useState<Partial<BirthData>>({
    date: initialData?.date || new Date(),
    time: initialData?.time || '12:00',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    timezone: initialData?.timezone || 'UTC',
    city: initialData?.city || '',
    country: initialData?.country || ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleInputChange = (field: keyof BirthData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    handleInputChange('date', date);
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city/country (simplified)
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const locationData = await response.json();
        
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          city: locationData.city || locationData.locality || '',
          country: locationData.countryName || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }));
      } catch (geocodeError) {
        // If geocoding fails, still use coordinates
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }));
      }
    } catch (error) {
      setLocationError('Unable to get your location. Please enter manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || formData.latitude === undefined || formData.longitude === undefined) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(formData as BirthData);
  };

  const isFormValid = () => {
    return formData.date && 
           formData.time && 
           formData.latitude !== undefined && 
           formData.longitude !== undefined &&
           formData.timezone;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Cosmic background effects */}
      <StarField density={100} animated={true} />
      <GlowingOrb size={300} color="rgba(147, 51, 234, 0.3)" className="top-10 left-10" />
      <GlowingOrb size={200} color="rgba(59, 130, 246, 0.2)" className="bottom-20 right-20" />
      <GlowingOrb size={150} color="rgba(236, 72, 153, 0.2)" className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <CosmicText variant="primary" size="2xl">
              ✨ Birth Data Portal ✨
            </CosmicText>
            <p className="text-purple-200 mt-4 text-lg">
              Enter your birth information to unlock your cosmic signature and sidereal chart
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <CosmicContainer variant="primary" className="p-8">
              {/* Date and Time Section */}
              <CosmicCard title="🌟 Birth Date & Time" className="mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={formData.date?.toISOString().split('T')[0] || ''}
                      onChange={handleDateChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={formData.time || '12:00'}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone || 'UTC'}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                    required
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Kolkata">India</option>
                    <option value="Australia/Sydney">Sydney</option>
                  </select>
                </div>
              </CosmicCard>

              {/* Location Section */}
              <CosmicCard title="🌍 Birth Location" className="mb-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CosmicButton
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                      variant="secondary"
                      className="flex-1"
                    >
                      {isLocating ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Locating...
                        </>
                      ) : (
                        <>📍 Use Current Location</>
                      )}
                    </CosmicButton>
                  </div>

                  {locationError && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                      {locationError}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter birth city"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Enter birth country"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.latitude || ''}
                        onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                        placeholder="e.g., 40.7128"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.longitude || ''}
                        onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                        placeholder="e.g., -74.0060"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CosmicCard>

              {/* Submit Button */}
              <div className="text-center">
                <CosmicButton
                  type="submit"
                  disabled={!isFormValid()}
                  size="lg"
                  variant="primary"
                  className="min-w-48"
                >
                  ✨ Generate My Cosmic Profile ✨
                </CosmicButton>
              </div>
            </CosmicContainer>
          </form>

          {/* Information Section */}
          <CosmicContainer variant="ethereal" className="mt-12 p-6">
            <div className="text-center">
              <CosmicText variant="ethereal" size="lg">
                🌟 Your Privacy Matters 🌟
              </CosmicText>
              <p className="text-purple-100 mt-3 text-sm leading-relaxed">
                Your birth data is used only to calculate your cosmic signature and astrological charts. 
                We respect your privacy and handle your information with the utmost care.
              </p>
            </div>
          </CosmicContainer>
        </div>
      </div>
    </div>
  );
}