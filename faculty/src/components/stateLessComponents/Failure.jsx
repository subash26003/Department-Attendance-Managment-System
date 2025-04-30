import NOT_FOUND_IMAGE from "../../assets/Not_Found_image.webp"

const Failure = ({ message }) => {
    return (
      <div className="flex flex-col items-center justify-center  text-center min-h-full">
        <img 
          src={NOT_FOUND_IMAGE}
          alt="Error" 
          className="w-40 md:w-92 mb-4"
        />
        <p className="text-red-600 font-bold text-lg">{message}</p>
      </div>
    );
  };
  
  export default Failure;
  