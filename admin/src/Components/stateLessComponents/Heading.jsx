
const Heading = ({title}) => {
  return (
    <div className="flex justify-center items-center mt-2">
        <h1 className="text-center text-2xl text-gray-800 font-bold">{title.toUpperCase()}</h1>
    </div>
    
  )
}

export default Heading