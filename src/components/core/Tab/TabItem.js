export default function TabItem(props) {
    return (
        <div
            className={
                props.selected
                    ? "flex justify-center items-center content-center rounded-[20px] whitespace-nowrap px-5 py-1 bg-indigo-500 text-white hover:cursor-pointer transition"
                    : "flex  justify-center items-center content-center rounded-[20px] whitespace-nowrap px-5 py-1 bg-gray-100 hover:cursor-pointer transition"
            }
            onClick={() => props.handleSetTab(props.value)}
        >
            {props.active &&
                <span className="flex mr-1.5 h-3 w-3 relative place-content-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            }

            {props.label}
        </div>
    );
}
