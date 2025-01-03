export class TopInfoDisplay {
    constructor() {
        this.base_html = `
            <div id='top-info-display' className='fixed z-50 w-full h-8'>
                <div
                    className='my-auto h-1 bg-green-400 origin-left animate-fill w-full rounded-full will-change-transform'
                    style={{ transform: "translateX(-100%)" }}
                />
                <div className='w-full h-8 bg-green-100'>
                    <div className='flex justify-between max-w-screen-lg mx-auto text-lg font-bold text-green-500 items-center'>
                        <span id='loader-text' className=''>
                            Article created suscessfully
                        </span>

                        <button onClick={() => {}}>&times;</button>
                    </div>
                </div>
            </div>

            <div className='h-8 w-full' />
        `;
        
        this.infoDisplay = document.createElement('div');
        this.infoDisplay.style.display = 'none';
    }

    showProgressBar() {
        
}
