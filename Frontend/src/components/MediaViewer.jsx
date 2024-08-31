import PropTypes from 'prop-types';

function FilePreview({ fileUrl }) {
    const getFileTypeFromUrl = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        let mimeType;

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                mimeType = `image/${extension}`;
                break;
            case 'mp4':
            case 'webm':
            case 'ogg':
                mimeType = `video/${extension}`;
                break;
            case 'mp3':
            case 'wav':
            case 'aac':
                mimeType = `audio/${extension}`;
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'txt':
                mimeType = 'text/plain';
                break;
            default:
                mimeType = 'application/octet-stream'; // Fallback for unknown types
        }
        return mimeType;
    };

    const fileType = getFileTypeFromUrl(fileUrl);

    const handleDownload = () => {
        const filename = fileType.replace('/', '.') + `.${fileUrl.split('.').pop()}`;
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
                <a href={fileUrl} onClick={handleDownload}>Download File</a>
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
                <a href={fileUrl} onClick={handleDownload}>Download File</a>
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
                <a href={fileUrl} onClick={handleDownload}>Download File</a>
            </div>
        );
    } else {
        return (
            <div className='media'>
                <a href={fileUrl} onClick={handleDownload}>Download File</a>
            </div>
        );
    }
}

FilePreview.propTypes = {
    fileUrl: PropTypes.string.isRequired,
};

export default FilePreview;
