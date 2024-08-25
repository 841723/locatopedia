export function Button({ children, onClick }) {
    return (
        <button
            className='text-sm border border-gray-900 px-2 py-1 rounded-md transition hover:bg-gray-200'
            onClick={onClick}
        >
            {children}
        </button>
    );
}