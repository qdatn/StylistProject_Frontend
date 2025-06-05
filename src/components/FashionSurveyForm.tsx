import React, { useState, useEffect } from 'react';
import { StylePreference } from '@src/types/StylePreferences';

// Define types for form data
type PersonalInfo = {
  occupation?: string;
  location?: string;
  height?: number;
  weight?: number;
};

type FashionStyle = {
  favoriteStyles: string[];
  outfitsByOccasion: Record<string, string>;
  followTrends?: 'yes' | 'no' | 'sometimes';
  favoriteColors: string[];
  avoidedColors: string[];
  favoritePatterns: string[];
};

type SizePreference = {
  topSize?: string;
  bottomSize?: string;
  shoeSize?: string;
  fitPreference?: string;
  avoidedStyles?: string;
};

type ShoppingHabits = {
  shoppingPlaces: string[];
  frequency?: string;
  shoppingMethod?: string;
  priorities: string[];
};

type InteractionChannels = {
  platforms: string[];
  consentForAdvice: boolean;
};

type FormData = {
  personalInfo: PersonalInfo;
  fashionStyle: FashionStyle;
  sizePreference: SizePreference;
  shoppingHabits: ShoppingHabits;
  interactionChannels: InteractionChannels;
};

type FashionSurveyFormProps = {
  initialData?: FormData;
  onSubmit: (data: Partial<StylePreference>) => void;
  isSubmitting: boolean;
};

const FashionSurveyForm: React.FC<FashionSurveyFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  // Initialize form states with default values
  const defaultFormData: FormData = {
    personalInfo: {},
    fashionStyle: {
      favoriteStyles: [],
      outfitsByOccasion: {},
      favoriteColors: [],
      avoidedColors: [],
      favoritePatterns: []
    },
    sizePreference: {},
    shoppingHabits: {
      shoppingPlaces: [],
      priorities: []
    },
    interactionChannels: {
      platforms: [],
      consentForAdvice: false
    }
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Update form if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData: Partial<StylePreference> = {
      occupation: formData.personalInfo.occupation,
      location: formData.personalInfo.location,
      height: formData.personalInfo.height,
      weight: formData.personalInfo.weight,
      favoriteStyles: formData.fashionStyle.favoriteStyles,
      outfitsByOccasion: new Map(Object.entries(formData.fashionStyle.outfitsByOccasion)),
      followTrends: formData.fashionStyle.followTrends,
      favoriteColors: formData.fashionStyle.favoriteColors,
      avoidedColors: formData.fashionStyle.avoidedColors,
      favoritePatterns: formData.fashionStyle.favoritePatterns,
      topSize: formData.sizePreference.topSize,
      bottomSize: formData.sizePreference.bottomSize,
      shoeSize: formData.sizePreference.shoeSize,
      fitPreference: formData.sizePreference.fitPreference,
      avoidedStyles: formData.sizePreference.avoidedStyles,
      shoppingPlaces: formData.shoppingHabits.shoppingPlaces,
      shoppingFrequency: formData.shoppingHabits.frequency,
      shoppingMethod: formData.shoppingHabits.shoppingMethod,
      priorities: formData.shoppingHabits.priorities,
      platforms: formData.interactionChannels.platforms,
      consentForAdvice: formData.interactionChannels.consentForAdvice
    };

    onSubmit(submissionData);
  };

  // Update form fields
  const updatePersonalInfo = (field: keyof PersonalInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateFashionStyle = (field: keyof FashionStyle, value: any) => {
    setFormData(prev => ({
      ...prev,
      fashionStyle: {
        ...prev.fashionStyle,
        [field]: value
      }
    }));
  };

  const updateSizePreference = (field: keyof SizePreference, value: any) => {
    setFormData(prev => ({
      ...prev,
      sizePreference: {
        ...prev.sizePreference,
        [field]: value
      }
    }));
  };

  const updateShoppingHabits = (field: keyof ShoppingHabits, value: any) => {
    setFormData(prev => ({
      ...prev,
      shoppingHabits: {
        ...prev.shoppingHabits,
        [field]: value
      }
    }));
  };

  const updateInteractionChannels = (field: keyof InteractionChannels, value: any) => {
    setFormData(prev => ({
      ...prev,
      interactionChannels: {
        ...prev.interactionChannels,
        [field]: value
      }
    }));
  };

  // Handle occasion outfit changes
  const handleOccasionChange = (occasion: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fashionStyle: {
        ...prev.fashionStyle,
        outfitsByOccasion: {
          ...prev.fashionStyle.outfitsByOccasion,
          [occasion]: value
        }
      }
    }));
  };

  // Form options
  const fashionStyles = [
    'Active/Sporty', 'Elegant', 'Edgy', 'Classic',
    'Minimalist', 'Sexy', 'Streetwear', 'Vintage', 'Y2K'
  ];

  const colorOptions = [
    'Black', 'White', 'Gray', 'Blue', 'Green',
    'Red', 'Pink', 'Purple', 'Yellow', 'Orange', 'Brown', 'Pastel'
  ];

  const patternOptions = ['Solid', 'Striped', 'Floral', 'Polka Dot', 'Geometric', 'Animal Print'];
  const platforms = ['Instagram', 'TikTok', 'Facebook', 'Shopee', 'TikTok Shop', 'Zalo', 'YouTube'];
  const priorities = ['Price', 'Material', 'Brand', 'Style', 'Versatility', 'Sustainability'];
  const occasions = ['Work', 'School', 'Going Out', 'Party'];
  const shoppingFrequencies = ['Weekly', 'Monthly', 'Seasonally', 'As Needed'];
  const shoppingMethods = ['Online', 'In-store', 'Both'];
  const fitOptions = ['Tight', 'Fit', 'Loose'];

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 🧍 Personal Information */}
        <section>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Occupation</label>
              <input
                type="text"
                value={formData.personalInfo.occupation || ''}
                onChange={(e) => updatePersonalInfo('occupation', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                value={formData.personalInfo.location || ''}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="City/Province"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Height (cm)</label>
              <input
                type="number"
                value={formData.personalInfo.height || ''}
                onChange={(e) => updatePersonalInfo('height', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Weight (kg)</label>
              <input
                type="number"
                value={formData.personalInfo.weight || ''}
                onChange={(e) => updatePersonalInfo('weight', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
          </div>
        </section>

        {/* 🎨 Fashion Style Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎨</span> Fashion Style Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Which styles do you prefer? (Multiple choices)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fashionStyles.map(style => (
                  <label key={style} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.fashionStyle.favoriteStyles.includes(style)}
                      onChange={(e) => {
                        const newStyles = e.target.checked
                          ? [...formData.fashionStyle.favoriteStyles, style]
                          : formData.fashionStyle.favoriteStyles.filter(s => s !== style);
                        updateFashionStyle('favoriteStyles', newStyles);
                      }}
                      className="mr-2"
                    />
                    {style}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {occasions.map(occasion => (
                <div key={occasion}>
                  <label className="block mb-2 font-medium">What do you usually wear for {occasion.toLowerCase()}?</label>
                  <input
                    type="text"
                    value={formData.fashionStyle.outfitsByOccasion[occasion] || ''}
                    onChange={(e) => handleOccasionChange(occasion, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Shirt + pants..."
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block mb-2 font-medium">Do you follow fashion trends?</label>
              <div className="flex space-x-4">
                {(['yes', 'no', 'sometimes'] as const).map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.fashionStyle.followTrends === option}
                      onChange={() => updateFashionStyle('followTrends', option)}
                      className="mr-2"
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Favorite colors? (Multiple choices)</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {colorOptions.map(color => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.fashionStyle.favoriteColors.includes(color)}
                      onChange={(e) => {
                        const newColors = e.target.checked
                          ? [...formData.fashionStyle.favoriteColors, color]
                          : formData.fashionStyle.favoriteColors.filter(c => c !== color);
                        updateFashionStyle('favoriteColors', newColors);
                      }}
                      className="mr-2"
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Any colors you avoid?</label>
              <input
                type="text"
                value={formData.fashionStyle.avoidedColors.join(', ') || ''}
                onChange={(e) => updateFashionStyle('avoidedColors', e.target.value.split(',').map(c => c.trim()))}
                className="w-full p-2 border rounded"
                placeholder="e.g., Orange, Green..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Preferred patterns? (Multiple choices)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {patternOptions.map(pattern => (
                  <label key={pattern} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.fashionStyle.favoritePatterns.includes(pattern)}
                      onChange={(e) => {
                        const newPatterns = e.target.checked
                          ? [...formData.fashionStyle.favoritePatterns, pattern]
                          : formData.fashionStyle.favoritePatterns.filter(p => p !== pattern);
                        updateFashionStyle('favoritePatterns', newPatterns);
                      }}
                      className="mr-2"
                    />
                    {pattern}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 🩳 Size & Fit Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🩳</span> Size & Fit Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium">Top Size</label>
              <select
                value={formData.sizePreference.topSize || ''}
                onChange={(e) => updateSizePreference('topSize', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select size</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Bottom Size</label>
              <select
                value={formData.sizePreference.bottomSize || ''}
                onChange={(e) => updateSizePreference('bottomSize', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select size</option>
                {['28', '30', '32', '34', '36', '38'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Shoe Size</label>
              <select
                value={formData.sizePreference.shoeSize || ''}
                onChange={(e) => updateSizePreference('shoeSize', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select size</option>
                {['36', '37', '38', '39', '40', '41', '42', '43'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block mb-2 font-medium">Fit Preference</label>
              <div className="flex space-x-4">
                {fitOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.sizePreference.fitPreference === option.toLowerCase()}
                      onChange={() => updateSizePreference('fitPreference', option.toLowerCase())}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block mb-2 font-medium">Any clothing styles you avoid?</label>
              <input
                type="text"
                value={formData.sizePreference.avoidedStyles || ''}
                onChange={(e) => updateSizePreference('avoidedStyles', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., Crop tops, Skinny jeans..."
              />
            </div>
          </div>
        </section>

        {/* 🛍️ Shopping Habits */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🛍️</span> Shopping Habits
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Where do you usually shop? (Multiple choices)</label>
              <input
                type="text"
                value={formData.shoppingHabits.shoppingPlaces.join(', ') || ''}
                onChange={(e) => updateShoppingHabits('shoppingPlaces', e.target.value.split(',').map(s => s.trim()))}
                className="w-full p-2 border rounded"
                placeholder="e.g., Zara, Uniqlo, Local markets..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Shopping frequency?</label>
              <div className="flex space-x-4">
                {shoppingFrequencies.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.shoppingHabits.frequency === option.toLowerCase()}
                      onChange={() => updateShoppingHabits('frequency', option.toLowerCase())}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Shopping method?</label>
              <div className="flex space-x-4">
                {shoppingMethods.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.shoppingHabits.shoppingMethod === option.toLowerCase()}
                      onChange={() => updateShoppingHabits('shoppingMethod', option.toLowerCase())}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Priorities when choosing clothing? (Multiple choices)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {priorities.map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.shoppingHabits.priorities.includes(priority)}
                      onChange={(e) => {
                        const newPriorities = e.target.checked
                          ? [...formData.shoppingHabits.priorities, priority]
                          : formData.shoppingHabits.priorities.filter(p => p !== priority);
                        updateShoppingHabits('priorities', newPriorities);
                      }}
                      className="mr-2"
                    />
                    {priority}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 📱 Interaction Channels */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📱</span> Interaction Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Where do you follow fashion content? (Multiple choices)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map(platform => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.interactionChannels.platforms.includes(platform)}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked
                          ? [...formData.interactionChannels.platforms, platform]
                          : formData.interactionChannels.platforms.filter(p => p !== platform);
                        updateInteractionChannels('platforms', newPlatforms);
                      }}
                      className="mr-2"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.interactionChannels.consentForAdvice}
                  onChange={(e) => updateInteractionChannels('consentForAdvice', e.target.checked)}
                  className="mr-2"
                />
                I'm willing to receive personalized fashion advice via email/Zalo
              </label>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-pink-600 text-white py-3 px-8 rounded-lg transition-colors ${isSubmitting ? 'bg-pink-400 cursor-not-allowed' : 'hover:bg-pink-700'}`}
          >
            {isSubmitting ? 'Saving...' : 'Update Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FashionSurveyForm;