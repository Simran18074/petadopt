import heroImg from "../assets/hero-pet.png";

const Hero = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Give <span className="text-rose-500">Love</span>,
          <br /> Adopt a Pet Today 🐾
        </h2>
        <p className="text-lg text-gray-600">
          Our Pet Adoption System connects caring families with loving pets.
          Every adoption saves a life and gives a new best friend.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition">
            Adopt Now
          </button>
          <button className="px-6 py-3 bg-gray-200 font-semibold rounded-xl hover:bg-gray-300 transition">
            Learn More
          </button>
        </div>
      </div>

      <div className="md:w-1/2 mb-8 md:mb-0">
        <img src={heroImg} alt="Adopt Pet" className="w-full drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;
