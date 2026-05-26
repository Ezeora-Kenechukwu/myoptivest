import React from 'react'
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';


const QuestAnser = [
        {
            id:1,
            question:" What is Celebrity Hub?",
            answer:"Celebrity Hub is your all-access destination for celebrity news, red carpet coverage, exclusive interviews, fashion updates, and fan-driven content. Whether you're a casual fan or a pop culture enthusiast, we’ve got you covered."
        },
        {
            id:2,
            question:"Are your stories verified?",
            answer:"Yes. While we cover trending rumors and entertainment news, we always aim to fact-check and cite credible sources. Our Rumor Radar section also helps you distinguish speculation from confirmed news."
        },
        {
            id:3,
            question:"Do you have a mobile app?",
            answer:"Not yet — but it’s coming soon! In the meantime, our site is fully mobile-optimized for a smooth experience on any device."
        },
        {
            id:4,
            question:"Can I create an account or join a fan community?",
            answer:"Yes! Creating an account gives you access to full fan experience, as you go on to dive into the culture,"
        },
        {
            id:5,
            question:"Do celebrities manage their own profiles here?",
            answer:"Some do! Some celebrity profiles may be managed by the stars themselves or their official teams. Look for the blue verified checkmark."
        },
        {
            id:6,
            question:"Is Celebrity Hub free to use?",
            answer:"Absolutely! Most of our content is available for free. We only charge you when you are to book your favorite celebrity or items off the celebrity, and ad-free browsing."
        }
];
const FirstLayer = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleAccordion = (index) => {
      setOpenIndex(index === openIndex ? null : index);
    };

  return (
    <section className="w-full dark:text-slate-950 min-h-screen max-w-5xl mx-auto px-5  ">
    <article className="w-full min-h-5xl relative">
    <div className="relative w-full  border-b-2  mt-10 mb-10 border-slate-400 max-w-[400px] min-w-[300px] mx-auto ">
                <h4 className='-top-3 bg-slate-100 dark:text-slate-950 left-[calc(50%-75px)] z-20 absolute text-center min-w-[150px] text-orange-500 font-bold'>FAQ's</h4>
            </div>
            <h4 className='text-center text-xl md:text-2xl lg:text-3xl mb-10'>Frequently Asked <b className='text-orange-500'>Questions</b></h4>
    <div className="w-full min-h-7xl absolute leading-relaxed">
    {QuestAnser.map((QuestAnser, index) => (
        <div
          key={index}
          className={` ${
            openIndex === index ? "bg-gray-100 dark:text-slate-950 text-slate-800" : "bg-gray-100"
          } transition-colors translate  translate-y-1 duration-1000 w-full  md:w1/2 `}
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full text-left flex justify-between  duration-1000 items-center p-4 font-medium focus:outline-none"
          >
            {QuestAnser.question}
            {openIndex === index ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {openIndex === index && QuestAnser.answer && (
            <div className="px-4 pb-4 text-sm text-gray-800 bg-gray-100 transition-colors duration-1000 translate dark:text-slate-950 translate-y-3">
              {QuestAnser.answer}
            </div>
          )}
        </div>
      ))}
    </div>
    </article>
    </section>
  )
}

export default FirstLayer
