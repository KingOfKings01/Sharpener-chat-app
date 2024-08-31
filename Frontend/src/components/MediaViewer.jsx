import PropTypes from 'prop-types';

function FilePreview({ fileUrl, fileType }) {

    const handleDownload = (fileType) => {
        const filename = fileType.replace('/', '.');
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename; // Specify filename here if you want to name the file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (fileType.startsWith('image/')) {
        return (
            <div className='media'>
                <img src={fileUrl} alt="File Preview" height="200" />
                <a href={fileUrl} onClick={()=>handleDownload(fileType)}>Download File</a>
            </div>
        );
    } else if (fileType.startsWith('video/')) {
        return (
            <div className='media'>
                <video height="200" controls>
                    <source src={fileUrl} type={fileType} />
                    <track src="subtitles.vtt" kind="subtitles" srcLang="en" label="English" />
                    Your browser does not support the video tag.
                </video>
                <a href={fileUrl} onClick={()=>handleDownload(fileType)}>Download File</a>
            </div>
        );
    } else if (fileType.startsWith('audio/')) {
        return (
            <div className='media'>
                <audio controls>
                    <source src={fileUrl} type={fileType} />
                    <track src="captions.vtt" kind="captions" srcLang="en" label="English" />
                    Your browser does not support the audio element.
                </audio>
                <a href={fileUrl} onClick={()=>handleDownload(fileType)}>Download File</a>
            </div>
        );
    } else {
        return (
            <div className='media'>
                <a href={fileUrl} onClick={()=>handleDownload(fileType)}>Download File</a>
            </div>
        );
    }
}

FilePreview.propTypes = {
    fileType: PropTypes.string.isRequired,
    fileUrl: PropTypes.string.isRequired,
};

export default FilePreview;
