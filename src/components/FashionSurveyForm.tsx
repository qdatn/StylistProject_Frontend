// src/components/FashionSurveyForm.tsx
import React, { useState } from 'react';

type PersonalInfo = {
  gender?: string;
  age?: number;
  occupation?: string;
  location?: string;
  height?: number;
  weight?: number;
  bodyShape?: string;
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
  fitPreference?: 'tight' | 'fit' | 'loose';
  avoidedStyles?: string;
};

type ShoppingHabits = {
  shoppingPlaces: string[];
  frequency?: 'monthly' | 'seasonal' | 'as_needed';
  shoppingMethod?: 'online' | 'store' | 'both';
  priorities: string[];
};

type InteractionChannels = {
  platforms: string[];
  consentForAdvice: boolean;
};

const FashionSurveyForm = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
  const [fashionStyle, setFashionStyle] = useState<FashionStyle>({
    favoriteStyles: [],
    outfitsByOccasion: {},
    favoriteColors: [],
    avoidedColors: [],
    favoritePatterns: []
  });
  const [sizePreference, setSizePreference] = useState<SizePreference>({});
  const [shoppingHabits, setShoppingHabits] = useState<ShoppingHabits>({
    shoppingPlaces: [],
    priorities: []
  });
  const [interactionChannels, setInteractionChannels] = useState<InteractionChannels>({
    platforms: [],
    consentForAdvice: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      personalInfo,
      fashionStyle,
      sizePreference,
      shoppingHabits,
      interactionChannels
    };
    console.log('Form Data:', formData);
    alert('Thank you for completing the survey!');
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: any) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const handleFashionStyleChange = (field: keyof FashionStyle, value: any) => {
    setFashionStyle({ ...fashionStyle, [field]: value });
  };

  const handleOccasionChange = (occasion: string, value: string) => {
    setFashionStyle({
      ...fashionStyle,
      outfitsByOccasion: {
        ...fashionStyle.outfitsByOccasion,
        [occasion]: value
      }
    });
  };

  // Updated options in English
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-8 text-pink-600">
        FASHION PREFERENCE SURVEY
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 🧍 Personal Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🧍</span> Personal Information (Optional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Gender</label>
              <select 
                value={personalInfo.gender || ''}
                onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Age</label>
              <input
                type="number"
                value={personalInfo.age || ''}
                onChange={(e) => handlePersonalInfoChange('age', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Occupation</label>
              <input
                type="text"
                value={personalInfo.occupation || ''}
                onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                value={personalInfo.location || ''}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="City/Province"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Height (cm)</label>
              <input
                type="number"
                value={personalInfo.height || ''}
                onChange={(e) => handlePersonalInfoChange('height', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Weight (kg)</label>
              <input
                type="number"
                value={personalInfo.weight || ''}
                onChange={(e) => handlePersonalInfoChange('weight', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Body Shape</label>
              <select 
                value={personalInfo.bodyShape || ''}
                onChange={(e) => handlePersonalInfoChange('bodyShape', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select body shape</option>
                <option value="hourglass">Hourglass</option>
                <option value="rectangle">Rectangle</option>
                <option value="triangle">Triangle</option>
                <option value="inverted_triangle">Inverted Triangle</option>
                <option value="round">Round</option>
              </select>
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
                      checked={fashionStyle.favoriteStyles.includes(style)}
                      onChange={(e) => {
                        const newStyles = e.target.checked
                          ? [...fashionStyle.favoriteStyles, style]
                          : fashionStyle.favoriteStyles.filter(s => s !== style);
                        handleFashionStyleChange('favoriteStyles', newStyles);
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
                    value={fashionStyle.outfitsByOccasion[occasion] || ''}
                    onChange={(e) => handleOccasionChange(occasion, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`e.g., Shirt + pants...`}
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
                      checked={fashionStyle.followTrends === option}
                      onChange={() => handleFashionStyleChange('followTrends', option)}
                      className="mr-2"
                    />
                    {option === 'yes' && 'Yes'}
                    {option === 'no' && 'No'}
                    {option === 'sometimes' && 'Sometimes'}
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
                      checked={fashionStyle.favoriteColors.includes(color)}
                      onChange={(e) => {
                        const newColors = e.target.checked
                          ? [...fashionStyle.favoriteColors, color]
                          : fashionStyle.favoriteColors.filter(c => c !== color);
                        handleFashionStyleChange('favoriteColors', newColors);
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
                value={fashionStyle.avoidedColors.join(', ') || ''}
                onChange={(e) => handleFashionStyleChange('avoidedColors', e.target.value.split(',').map(c => c.trim()))}
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
                      checked={fashionStyle.favoritePatterns.includes(pattern)}
                      onChange={(e) => {
                        const newPatterns = e.target.checked
                          ? [...fashionStyle.favoritePatterns, pattern]
                          : fashionStyle.favoritePatterns.filter(p => p !== pattern);
                        handleFashionStyleChange('favoritePatterns', newPatterns);
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
                value={sizePreference.topSize || ''}
                onChange={(e) => setSizePreference({...sizePreference, topSize: e.target.value})}
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
                value={sizePreference.bottomSize || ''}
                onChange={(e) => setSizePreference({...sizePreference, bottomSize: e.target.value})}
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
                value={sizePreference.shoeSize || ''}
                onChange={(e) => setSizePreference({...sizePreference, shoeSize: e.target.value})}
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
                {(['tight', 'fit', 'loose'] as const).map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={sizePreference.fitPreference === option}
                      onChange={() => setSizePreference({...sizePreference, fitPreference: option})}
                      className="mr-2"
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3">
              <label className="block mb-2 font-medium">Any clothing styles you avoid?</label>
              <input
                type="text"
                value={sizePreference.avoidedStyles || ''}
                onChange={(e) => setSizePreference({...sizePreference, avoidedStyles: e.target.value})}
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
                value={shoppingHabits.shoppingPlaces.join(', ') || ''}
                onChange={(e) => setShoppingHabits({
                  ...shoppingHabits, 
                  shoppingPlaces: e.target.value.split(',').map(s => s.trim())
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Zara, Uniqlo, Local markets..."
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Shopping frequency?</label>
              <div className="flex space-x-4">
                {(['monthly', 'seasonal', 'as_needed'] as const).map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={shoppingHabits.frequency === option}
                      onChange={() => setShoppingHabits({...shoppingHabits, frequency: option})}
                      className="mr-2"
                    />
                    {option === 'monthly' && 'Monthly'}
                    {option === 'seasonal' && 'Seasonally'}
                    {option === 'as_needed' && 'As needed'}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Shopping method?</label>
              <div className="flex space-x-4">
                {(['online', 'store', 'both'] as const).map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      checked={shoppingHabits.shoppingMethod === option}
                      onChange={() => setShoppingHabits({...shoppingHabits, shoppingMethod: option})}
                      className="mr-2"
                    />
                    {option === 'online' && 'Online'}
                    {option === 'store' && 'In-store'}
                    {option === 'both' && 'Both'}
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
                      checked={shoppingHabits.priorities.includes(priority)}
                      onChange={(e) => {
                        const newPriorities = e.target.checked
                          ? [...shoppingHabits.priorities, priority]
                          : shoppingHabits.priorities.filter(p => p !== priority);
                        setShoppingHabits({...shoppingHabits, priorities: newPriorities});
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
                      checked={interactionChannels.platforms.includes(platform)}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked
                          ? [...interactionChannels.platforms, platform]
                          : interactionChannels.platforms.filter(p => p !== platform);
                        setInteractionChannels({...interactionChannels, platforms: newPlatforms});
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
                  checked={interactionChannels.consentForAdvice}
                  onChange={(e) => setInteractionChannels({
                    ...interactionChannels, 
                    consentForAdvice: e.target.checked
                  })}
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
            className="bg-pink-600 text-white py-3 px-8 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default FashionSurveyForm;