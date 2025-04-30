
const Tab = ({tabList , currentTab, setCurrentTab}) => {

  return (
    <div className="flex justify-center gap-2 my-2 md:gap-5 md:my-5 flex-wrap">
    {tabList.map((item , idx) => (
      <button onClick={() => setCurrentTab(item)} className={`${currentTab.toLowerCase() === item.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-300 '} text-xs md:text-md font-bold tracking-wide px-4 py-2 rounded hover:cursor-pointer truncate w-25 md:w-45` } key={idx}>
        {item.toUpperCase()}
      </button>
    ))}
  </div>
  )
}

export default Tab