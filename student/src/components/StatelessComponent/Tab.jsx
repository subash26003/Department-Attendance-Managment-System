
const Tab = ({tabList , currentTab, setCurrentTab}) => {

  return (
    <div className=" flex justify-center flex-wrap gap-5 my-5  ">
    {tabList.map((item , idx) => (
      <button onClick={() => setCurrentTab(item)} className={`${currentTab.toLowerCase() === item.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-300 '} text-xs md:text-md font-bold tracking-wide px-4 py-2 rounded hover:cursor-pointer`} key={idx}>
        {item.toUpperCase()}
      </button>
    ))}
  </div>
  )
}

export default Tab