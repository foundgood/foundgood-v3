import Document, { Html, Head, Main, NextScript } from 'next/document';
import cc from 'classcat';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head />
                <body
                    className={cc({
                        'debug-screens': process.env.NODE_ENV === 'development',
                    })}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
