

const UniversalInputWidget = ({ leftAbsoluteChildren, inputProps, rightAbsoluteChildren, ...divProps }) => {

    return <div className={`relative h-full w-full ${divProps.className}`} {...divProps}>
        {leftAbsoluteChildren && (
            <>{leftAbsoluteChildren}</>
        )}
        <input {...inputProps} />
        {rightAbsoluteChildren && (
            <>{rightAbsoluteChildren}</>
        )}
    </div>

}
    
export {
    UniversalInputWidget
}