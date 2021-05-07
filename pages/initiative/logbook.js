// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities
import { useMetadata, useAuth } from 'utilities/hooks';

// Components
import Button from 'components/button';
import TextCard from 'components/_logbook/textCard';
import ImageCard from 'components/_logbook/imageCard';
import VideoCard from 'components/_logbook/videoCard';
import FileCard from 'components/_logbook/fileCard';

const LogbookComponent = ({ pageProps }) => {
    // Hook: Verify logged in
    const { verifyLoggedIn } = useAuth();
    verifyLoggedIn();

    // Hook: Metadata
    const { labelTodo, label, valueSet, log } = useMetadata();

    return (
        <>
            <div className="flex justify-between mr-48 md:mr-0">
                <h1 className="t-h1">Logbook</h1>
                <Button variant="secondary" theme="teal">
                    {labelTodo('Update')}
                </Button>
            </div>
            <FileCard
                hasBackground={true}
                summary="Download my file"
                body="This is an example of someone attaching some sort of document to their update"
                date="26/06/2019 at 13:03"
                fileName="My-great-name.pdf"
                filePath="/files/fg-pdf-test.pdf"
            />
            <TextCard
                hasBackground={true}
                body="Project field officers and national office emergency coordinator have periodically monitored the progress of the project and provided constructive feedback to the government level supervisors and to the artesian."
                date="26/06/2019 at 13:03"
            />
            <TextCard
                hasBackground={true}
                summary="Develop new water points by constructing 5 hand dug wells and 5 shallow well"
                body="Project field officers and national office emergency coordinator have periodically monitored the progress of the project and provided constructive feedback to the government level supervisors and to the artesian."
                date="26/06/2019 at 13:03"
            />
            <TextCard
                hasBackground={true}
                summary="Develop new water points by constructing 5 hand dug wells and 5 shallow well"
                body="This is what a link https://imgur.com/r/Otters/2H8HCxc looks like"
                date="26/06/2019 at 13:03"
            />

            <ImageCard
                hasBackground={true}
                summary="Image test 1"
                body="lorem ipsum"
                date="26/06/2019 at 13:03"
                image="/images/fg-portrait-1.jpg"
            />
            <ImageCard
                hasBackground={true}
                summary="Image test 2"
                date="26/06/2019 at 13:03"
                image="/images/fg-landscape-1.jpg"
            />
            <VideoCard
                hasBackground={true}
                summary="Video test 1"
                body="Landscape - This is an example of a video which has been uploaded"
                date="26/06/2019 at 13:03"
                video="/videos/video-landscape-1.mp4"
            />
            <VideoCard
                hasBackground={true}
                summary="Develop new water points by constructing 5 hand dug wells and 5 shallow well"
                body="Portrait - This is an example of a video which has been uploaded"
                date="26/06/2019 at 13:03"
                video="/videos/video-portrait-1.mp4"
            />
        </>
    );
};

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    };
}

LogbookComponent.propTypes = {
    pageProps: t.object,
};

LogbookComponent.defaultProps = {
    pageProps: {},
};

LogbookComponent.layout = 'initiative';

export default LogbookComponent;
