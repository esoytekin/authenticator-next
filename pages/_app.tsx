import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import createEmotionCache from '../utility/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import lightTheme from '../styles/theme/light.theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../apollo-client';

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <CacheProvider value={clientSideEmotionCache}>
                    <ThemeProvider theme={lightTheme}>
                        <CssBaseline />
                        <ApolloProvider client={apolloClient}>
                            <Component {...pageProps} />
                        </ApolloProvider>
                    </ThemeProvider>
                </CacheProvider>
            </SessionProvider>
        </Provider>
    );
}

export default MyApp;
