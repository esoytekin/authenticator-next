import { Add, LogoutOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { logout } from '../store/app/user.slice';
import { useAppDispatch } from '../store/hook';

type NavbarProps = {
    onAddClick(): void;
    error: any;
};

const Navbar = ({ onAddClick, error }: NavbarProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <div className=" flex w-full h-36 bg-black fixed top-0 left-0 p-5 gap-8">
            <h2 className="text-18 min-w-224 text-white">
                Two Factor Authentication
            </h2>
            <div className="flex-grow-1 w-full text-white">{error}</div>
            <Button color="primary" variant="contained" onClick={onAddClick}>
                <Add />
            </Button>
            <Button
                color="primary"
                variant="contained"
                onClick={async () => {
                    await dispatch(logout());
                    router.replace('/login');
                }}
            >
                <LogoutOutlined />
            </Button>
        </div>
    );
};

export default memo(Navbar);
