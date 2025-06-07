import { useState, useRef, useEffect } from 'react';
import { ImageUploader } from '@components/body_shape/ImageUploader';
import { NavigationBar } from '@components/body_shape/NavigationBar';
import { ShapeSection } from '@components/body_shape/ShapeSection';
import { BODY_SHAPES } from '@src/types/BodyType';

export default function BodyShapePage() {
  const [selectedType, setSelectedType] = useState(BODY_SHAPES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const sectionPositions = useRef<{ [id: string]: number }>({});

  // Cập nhật vị trí các section khi resize
  useEffect(() => {
    const updateSectionPositions = () => {
      BODY_SHAPES.forEach(shape => {
        const element = document.getElementById(shape.id);
        if (element) {
          sectionPositions.current[shape.id] = element.offsetTop - 100;
        }
      });
    };

    updateSectionPositions();
    window.addEventListener('resize', updateSectionPositions);
    return () => window.removeEventListener('resize', updateSectionPositions);
  }, []);

  const handleSelect = (id: string) => {
    isProgrammaticScroll.current = true;
    setSelectedType(id);

    const targetPosition = sectionPositions.current[id];
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const scrollPosition = window.scrollY + 100;
      const sections = BODY_SHAPES.map(shape => ({
        id: shape.id,
        position: sectionPositions.current[shape.id]
      })).sort((a, b) => a.position - b.position);

      let activeId = sections[0].id;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].position) {
          activeId = sections[i].id;
          break;
        }
      }

      setSelectedType(activeId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen ">
      <div className="relative w-[75vw] h-[250px] md:h-[300px] lg:h-[500px] overflow-hidden mx-auto">
        <img
          src="./src/public/assets/images/body-shape-banner.jpg"
          alt="Body Shape Banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold">Discover Your Body Shape</h1>
          <p className="text-white text-sm md:text-lg mt-4 max-w-2xl">
            Get style tips tailored to your unique body type. Upload a photo to analyze your body shape and explore personalized fashion advice.
          </p>
        </div>
      </div>
      <NavigationBar
        shapes={BODY_SHAPES}
        selected={selectedType}
        onSelect={handleSelect}
      />

      <ImageUploader
        onUpload={handleAnalyze}
        // isLoading={isAnalyzing}
      />

      <div className="space-y-20 pb-20">
        {BODY_SHAPES.map(shape => (
          <section
            key={shape.id}
            id={shape.id}
            className="scroll-mt-24"
          >
            <ShapeSection
              shape={shape}
              isActive={selectedType === shape.id}
            />
          </section>
        ))}
      </div>
    </div>
  );
}