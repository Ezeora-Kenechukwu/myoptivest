import signup from '../../components/images/Signup.png';
export default function CallToAction() {
  return (
    <section className="bg-white text-center px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-6 grid md:grid-cols-2 gap-10 items-center justify-between">
        <div className="flex flex-col justify-start">
            <p className="text-base sm:text-lg max-w-2xl text-start ">
          DOWNLOAD NOW!
        </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-start">
          Start Investing Your Money  Today
        </h2>
         <p className="text-base sm:text-lg max-w-2xl text-start ">
          lorem ispum lorem ispum lorem ispum lorem ispum  orem ispum lorem ispum  lorem ispum lorem ispum lorem ispum lorem ispum  orem ispum lorem ispum
        </p>

        <button className="mt-4 px-8 py-3 bg-[#4B44DC] text-white font-semibold text-sm rounded-full hover:text-[#4B44DC] hover:bg-white transition w-fit">
          Register
        </button>
        </div>
        <div className="flex justify-center">
            <img
            src={signup}
            alt="SignUp form"
            className="w-full max-w-4xl object-contain "
            />
        </div>
      </div>
    </section>
  );
}
