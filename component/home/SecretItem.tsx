import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { memo } from 'react';
import TOTP from '../../lib/totp';
import SecretModel from '../../model/secret.model';

type SecretItemProps = {
    k: SecretModel;
    countDown: number;
    onEdit(x: SecretModel): void;
    onDelete(id: string): void;
};

const SecretItem = ({ k, countDown, onEdit, onDelete }: SecretItemProps) => {
    return (
        <ListItem key={k.site} className="border-1">
            <ListItemIcon>
                <span>{countDown}</span>
            </ListItemIcon>
            <ListItemText>
                <div className="flex grid grid-cols-3 gap-8">
                    <span>{k.site}</span>
                    <span>{TOTP.getOTP(k.key)}</span>
                    <div className="flex gap-8">
                        <EditOutlined
                            className="hover:text-lime-400 cursor-pointer"
                            onClick={() => onEdit(k)}
                        />
                        <DeleteOutlined
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => k.id && onDelete(k.id)}
                        />
                    </div>
                </div>
            </ListItemText>
        </ListItem>
    );
};

export default memo(SecretItem);
