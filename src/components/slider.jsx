import { useState, useEffect } from "react";
import naturepic from "../assets/naturepic.jpg";
import ab from "../assets/mysnappic.jpeg";
import city1 from "../assets/city1.png";
import city2 from "../assets/city2.png";
import city3 from "../assets/city3.png";
import city4 from "../assets/city4.png";
import city5 from "../assets/city5.png";
import { useNavigate } from "react-router-dom";


function Slider({isLoggedIn}) {
  // it is a kind of a array of all the places which i want to show in the slider
  const slides = [
    {
      id: 1,
      image: city5,
      title: "Modern City Living",
      description:
        "Don't just move to a new city; move to the right part of it.",
    },
    {
      id: 2,
      image: city4,
      title: "World-Class Amenities",
      description:
        "Tell us your needs (schools, gyms, hospitals). We visualize your optimal regions.",
    },
    {
      id: 3,
      image: city2,
      title: "Breathtaking Views",
      description:
        "Discover vibrant neighborhoods where everything you need is a peaceful 20-minute walk away.",
    },
    {
      id: 4, 
      image: city3,
      title: "Breathtaking Views",
      description:
        "Search with confidence. Move directly to the home you will love.",
    },
    {
      id: 5, 
      image: naturepic,
      title: "Breathtaking Views",
      description:
        "Wake up to serene nature and beautiful landscapes every morning.",
    },
  ];

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0); //it is a pointer for moving in a array of slider


  //if I am at the start, go to end else, go -1
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  //If I am at the end, go to start and else, go +1
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

  //this is added event listener for keyboard navigation, 
  //it will listen for arrow keys and change the slide accordingly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-screen group relative">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
        className="w-full h-full bg-center bg-cover duration-500 ease-in-out"
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 100%)' }}
        >
          <div className="text-center text-white px-4 max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              ✦ Smart Relocation Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-5 drop-shadow-lg tracking-tight leading-tight">
              {slides[currentIndex].title}
            </h1>
            <p className="text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {slides[currentIndex].description}
            </p>
            <button
              onClick={() =>
                navigate(isLoggedIn ? "/map" : "/login", {
                  state: { from: "/map" },
                })
              }
              className="font-semibold py-3.5 px-10 rounded-xl transition-all hover:scale-105 text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 28px rgba(99,102,241,0.45)' }}
            >
              Explore Your City
            </button>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-5 w-11 h-11 items-center justify-center rounded-full text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 right-5 w-11 h-11 items-center justify-center rounded-full text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
      >
        ❯
      </button>

      {/* Dots (Indicators) */}
      <div className="absolute bottom-8 w-full flex justify-center items-center gap-2">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`cursor-pointer transition-all duration-300 rounded-full ${
              currentIndex === slideIndex
                ? "w-7 h-2 bg-white"
                : "w-2 h-2 hover:bg-white/70"
            }`}
            style={currentIndex !== slideIndex ? { background: 'rgba(255,255,255,0.4)' } : {}}
          />
        ))}
      </div>
    </div>
  );
}
export default Slider;
