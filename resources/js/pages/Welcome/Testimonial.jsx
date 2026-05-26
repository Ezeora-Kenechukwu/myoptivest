import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';



const reviews = [
    {
        id:1,
        img:"/CelebImg/Men1.jpeg",
        msg:"This hub is a paradise for celebrity lovers. From the latest red carpet looks to behind-the-scenes gossip, it's all here!",
        name:"Kelvin Williams"
    },
    {
        id:2,
        img:"/CelebImg/Woman1.jpeg",
        msg:"If you're addicted to celeb drama and trend updates, this is your one-stop-shop. The content is always fresh and engaging.",
        name:"Lilly Ann"
    },
    {
        id:3,
        img:"/CelebImg/Men2.jpeg",
        msg:`I love how exclusive the updates feel. Its like getting VIP access to Hollywoods private world.`,
        name:"Charlse Corfield"
    },
    {
        id:4,
        img:"/CelebImg/Woman2.jpeg",
        msg:"While the layout is clean and easy to use, some profiles and news stories feel a bit surface-level. Hoping for more in-depth features soon.",
        name:"Grace Harmsworth"
    },
    {
        id:5,
        img:"/CelebImg/Men3.jpeg",
        msg:"Most of the focus is on mainstream Hollywood celebs. Would love to see more representation from global stars and underrepresented groups.",
        name:"Cole Scorfield"
    },
    {
        id:6,
        img:"/CelebImg/Woman3.jpeg",
        msg:`Whether its a scandal, a new romance, or a movie release — they are always the first to post. Love the speed and style. They even cover rising stars and influencers not just mainstream celebs. I love the mix`,
        name:"Camella Smith"
    },
]
const Testimonial = () => {
  return (
    <div className="testimonial block place-items-center mt-20 px-4">
        <h4 className='text-xl font-bold font-amarante sm:text-2xl lg:text-6xl'>Testimonials</h4>
        <p className="font-roboto text-md sm:text-2xl lg:text-3xl"><strong>What Our Clients Say!</strong></p>
        {/* <Carousel autoPlay={true} autoFocus={true} infiniteLoop={true} emulateTouch={true} showArrows={false} showIndicators={false} showThumbs={false} stopOnHover={true} swipeable={true} useKeyboardArrows={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-4">
    {reviews.map(({ id, img, msg, name }) => (
      <article
        className="min-w-[200px] max-w-[400px] sm:min-w-[250px] lg:min-w-[300px] pt-20 bg-white shadow-md shadow-gray-700 rounded-lg h-full"
        key={id}
      >
        <section className="relative rounded-t-xl rounded-b-lg bg-orange-500 h-full">
          <img
            src={img}
            alt="An Image"
            className="w-20 h-20 rounded-full absolute -top-15 left-[calc(50%-40px)] border-2 border-white"
          />
          <div className="words p-4">
            <p className="text-white mt-10 max-w-[70%] mx-auto">
              <p className="font-sans font-bold text-6xl rotate-180 w-fit">''</p>
              <blockquote className="text-center">{msg}</blockquote>
              <p className="font-sans font-bold text-6xl w-fit ml-auto">''</p>
            </p>
            <h5 className="text-xl text-center text-white">
              <b>{name}</b>
            </h5>
          </div>
        </section>
      </article>
    ))}
  </div>
        </Carousel> */}



     <div className="tesImg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-x-4 gap-y-10 mb-8">
     {
        reviews.map(({id, img, msg, name}) => {
            return(
             <article className=" min-w-[200px] max-w-[400px] sm:min-w-[250px] lg:min-w-[300px] pt-20 bg-white shadow-md shadow-gray-700 rounded-lg h-full" key={id}>
             <section className="relative rounded-t-xl rounded-b-lg bg-orange-500 h-full">

                <img src={img} alt="An Image" className='w-20 h-20 rounded-full absolute -top-15 left-[calc(50%-40px)] border-2 border-white' />

             <div className="words p-4">
             <p className=' text-white mt-10 max-w-[70%] mx-auto'>
                <p className="font-sans font-bold text-6xl space-y-0 rotate-180 w-fit">''</p>
                <blockquote className='text-center '>{msg}</blockquote>
                <p className="font-sans font-bold text-6xl space-y-0  w-fit mr-0 ml-auto">''</p>
                </p>
             <h5 className='text-xl text-center  text-white'><b>{name}</b></h5>
             </div>
             </section>
             </article>
            )
        })
     }
     </div>
    </div>
  )
}

export default Testimonial;
