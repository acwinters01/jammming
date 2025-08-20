import '../../styles/App.css'

const Loading = ({ isLoading = true }) => {
    if(!isLoading) return null;
    return (

        <div className='modal-loading'>
            <div className='modal-overlay'>
                <div className='modal-content'>
                     <p>Loading...</p>
                    
                </div>
            </div>
        </div>     
    );
};

export default Loading;