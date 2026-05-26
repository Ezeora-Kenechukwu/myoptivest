import React from 'react';
import vision_img from '../../components/images/professional/vision_img_landscape.jpeg';
import mission_img from '../../components/images/professional/mission_image_landscape.jpeg';

const MissionVisionValues = () => {
  return (
    <section className="bg-white text-gray-800 md:pt-12  md:pb-8 rounded-2xl shadow-lg ">
      <div className="max-w-7xl mx-auto space-y-4 relative  px-2">
        <div className="">
            <h2 className="text-3xl text-[#4E40D9] font-black border-b-2 rounded-2xl p-2 shadow-lg border-gray-700 pb-2 w-fit">
            Our Mission
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 pt-4 mt-2">
            {/* Mission */}

        <div className="">
            <img src={mission_img} alt="" className='rounded-2xl'/>
        </div>
         <div className="space-y-4">

          <p className="text-lg text-gray-800 leading-relaxed">
            To empower individuals and businesses with accessible investment and loan opportunities
            that drive financial growth, stability, and prosperity. We strive to simplify wealth-building
            and provide reliable funding through innovative, secure, and transparent financial solutions.
          </p>
        </div>

        </div>
        </div>
       <div className="">
         <h2 className="text-3xl font-black text-[#4E40D9] border-b-2 rounded-2xl p-2 pt-10 shadow-lg border-gray-700 pb-2 w-fit">
            Our Vision
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 pt-4 mt-2">
            <div className="">
            <img src={vision_img} alt="" className='rounded-2xl'/>
        </div>
        {/* Vision */}
        <div className="space-y-4">

          <p className="text-lg text-gray-800 leading-relaxed">
            To be Africa’s most trusted digital platform for inclusive investing and responsible lending,
            fostering a financially empowered generation through smart, ethical, and innovative financial services.
          </p>
        </div>

        </div>
       </div>
        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-[#4E40D9] border-b-2 rounded-2xl p-2 pt-10 shadow-lg border-gray-700 pb-2 w-fit">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Integrity',
                desc: 'We uphold transparency and honesty in all our dealings with customers and partners.',
              },
              {
                title: 'Innovation',
                desc: 'We continuously improve our services to deliver smarter financial solutions.',
              },
              {
                title: 'Empowerment',
                desc: 'We provide tools and resources that put financial power in your hands.',
              },
              {
                title: 'Customer-Centricity',
                desc: 'We put our clients at the heart of every service we offer.',
              },
              {
                title: 'Security',
                desc: 'We ensure all investments and loans are handled with top-tier data and transaction security.',
              },
              {
                title: 'Accountability',
                desc: 'We take full responsibility for our promises and performance.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-[#4E40D9] to-[#6E21C5A1] p-6 rounded-xl hover:shadow-lg transition-all border border-gray-800"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-100 text-base leading-snug">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionValues;
