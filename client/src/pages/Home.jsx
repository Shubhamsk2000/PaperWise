import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center pt-24 text-center h-dvh">
      <h1 className="text-7xl font-semibold mt-16  text-shadow-[0_0_50px_#000]">
        Answers That Know <br /> Their <span className="">Source.</span>
      </h1>
      <h3 className="text-xl text-neutral-400 mt-16 max-w-3xl text-shadow-[0_0_30px_#000]">
        Turn scattered documents into a searchable knowledge base. Ask natural questions and get reliable, source-backed answers in seconds.
      </h3>
      <Link to="/me" className='border rounded px-4 py-2 mt-6 bg-(--primary-color) text-black font-semibold hover:opacity-80 transition'>
        Try Paperwise Now
      </Link>
    </div>
  )
}

export default Home
