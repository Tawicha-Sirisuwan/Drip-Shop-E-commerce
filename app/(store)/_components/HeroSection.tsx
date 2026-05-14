import React from 'react';

export default function HeroSection() {
  return (
    <section className="bg-[#F2F0F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center pt-10 lg:pt-0">
        
        <div className="w-full lg:w-1/2 py-10 lg:py-24 relative z-10">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-black mb-6 leading-[1.05]">
            FIND CLOTHES<br />
            THAT MATCHES<br />
            YOUR STYLE
          </h1>
          <p className="text-[#666666] text-sm sm:text-base mb-8 max-w-md leading-relaxed">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button className="bg-black text-white px-12 py-4 rounded-full w-full sm:w-auto font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
            Shop Now
          </button>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-12">
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">200+</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">International Brands</p>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">2,000+</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">High-Quality Products</p>
            </div>
            <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
            <div>
              <h3 className="font-display text-3xl sm:text-4xl">30,000+</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[650px] relative mt-8 lg:mt-0">
          <svg className="absolute top-10 right-10 w-16 h-16 sm:w-24 sm:h-24 text-black star-float z-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg className="absolute top-1/2 left-4 w-10 h-10 sm:w-14 sm:h-14 text-black star-float z-20" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>

          <img 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Fashion Models" 
            className="w-full h-full object-cover object-top lg:absolute bottom-0 z-10"
          />
        </div>
      </div>
    </section>
  );
}
