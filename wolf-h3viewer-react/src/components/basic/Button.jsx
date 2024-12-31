export function Button(props) {
    const { children, className, ...rest } = props;
    return (
        <button
            className={`w-fit bg-[var(--color-button)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-button-hover)] self-end transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}