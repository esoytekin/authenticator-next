import type { NextPage, NextPageContext } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { setUser } from '../store/app/user.slice';
import { useAppDispatch, useAppSelector } from '../store/hook';
import styles from '../styles/Home.module.css';
import {
    deleteSecret,
    getSecrets,
    saveSecret,
    selectAllSecrets,
} from '../store/app/secret.slice';
import DialogAddSecret from '../component/addSecret.dialog';
import SecretModel from '../model/secret.model';
import clsx from 'clsx';
import Navbar from '../component/Navbar';
import SecretsFilter from '../component/home/SecretsFilter';
import SecretList from '../component/home/SecretList';

type KeyItem = {
    id: string;
    site: string;
    key: string;
};

type HomePageProps = {
    keys: KeyItem[];
};

const Home: NextPage<HomePageProps> = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.app.user);
    const secrets = useAppSelector(selectAllSecrets);

    const { loading, error } = useAppSelector(state => state.app.secret);

    const [addSecretDialogOpen, setAddSecretDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SecretModel | undefined>(
        undefined
    );

    const [filterValue, setFilterValue] = useState('');

    const { data: session } = useSession();

    useEffect(() => {
        dispatch(getSecrets());
    }, [dispatch]);

    useEffect(() => {
        if (session) {
            const { user: sessionUser } = session;
            if (sessionUser?.email && !user.email) {
                dispatch(setUser({ email: sessionUser.email }));
            }
        }
    }, [session, dispatch, user]);

    const handleDeleteClick = (id: string | undefined) => {
        if (!!id) {
            dispatch(deleteSecret(id));
        }
    };

    const handleEditClick = (secret: SecretModel) => {
        setSelectedItem(secret);
        setAddSecretDialogOpen(true);
    };

    const handleSecretSave = (secret: SecretModel) => {
        setAddSecretDialogOpen(false);
        dispatch(saveSecret(secret));
    };

    const filteredSecrets = useMemo(() => {
        if (!filterValue.trim().length) {
            return secrets;
        }

        return secrets.filter(
            x => x.site.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        );
    }, [secrets, filterValue]);

    return (
        <div className={styles.container}>
            <Head>
                <title>Authentication App</title>
                <meta name="description" content="Authentication App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar
                onAddClick={() => {
                    setAddSecretDialogOpen(true);
                }}
                error={error}
            />

            <main className={clsx(styles.main, 'w-full md:w-1/2 lg:w-1/4 ')}>
                {loading && <h3>Loading</h3>}
                <SecretsFilter
                    value={filterValue}
                    onChange={f => {
                        setFilterValue(f);
                    }}
                />
                <SecretList
                    secrets={secrets}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            </main>
            <DialogAddSecret
                open={addSecretDialogOpen}
                onClose={() => {
                    setAddSecretDialogOpen(false);
                    setSelectedItem(undefined);
                }}
                onSave={handleSecretSave}
                selected={selectedItem}
            />
        </div>
    );
};

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}

export default Home;
