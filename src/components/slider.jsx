import { useState, useEffect } from "react";
import naturepic from "../assets/naturepic.jpg";
import ab from "../assets/mysnappic.jpeg";

function Slider() {
  // it is a kind of a array of all the places which i want to show in the slider
  const slides = [
    {
      id: 1,
      image: naturepic,
      title: "Modern City Living",
      description:
        "Find your dream home in the heart of the city with easy access to everything.",
    },
    {
      id: 2,
      image: ab,
      title: "World-Class Amenities",
      description:
        "Premium gyms, swimming pools, and clubhouses right at your doorstep.",
    },
    {
      id: 3,
      image: naturepic,
      title: "Breathtaking Views",
      description:
        "Wake up to serene nature and beautiful landscapes every morning.",
    },
    {
      id: 4, 
      image: naturepic,
      title: "Breathtaking Views",
      description:
        "Wake up to serene nature and beautiful landscapes every morning.",
    },
    {
      id: 5, 
      image: naturepic,
      title: "Breathtaking Views",
      description:
        "Wake up to serene nature and beautiful landscapes every morning.",
    },
    {
      id: 6,
      image: naturepic,
      title: "Breathtaking Views",
      description:
        "Wake up to serene nature and beautiful landscapes every morning.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); //it is a pointer for moving in a array of slider

  //If I am at the end, go to start and else, go +1
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  //if I am at the start, go to end else, go -1
  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex]);//iska use automatically slide krne ka hai hrr 3 sec baad

  return (
    <div className="w-full h-screen group relative">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
        className="w-full h-full bg-center bg-cover duration-500 ease-in-out"
      >
        <div className="w-full h-full bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg transition-all duration-700 transform translate-y-0">
              {slides[currentIndex].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
              {slides[currentIndex].description}
            </p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Explore Properties
            </button>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition">
        <button onClick={prevSlide}>❮</button>
      </div>

      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition">
        <button onClick={nextSlide}>❯</button>
      </div>

      {/* Dots (Indicators) */}
      <div className="absolute bottom-10 w-full flex justify-center gap-3">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`text-2xl cursor-pointer transition-all duration-300 ${
              currentIndex === slideIndex
                ? "text-sky-500 scale-125"
                : "text-white/60"
            }`}
          >
            •
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
