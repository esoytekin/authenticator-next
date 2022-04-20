import { List } from '@mui/material';
import { memo } from 'react';
import useCountdownTimer from '../../hooks/countDownTimer.hook';
import SecretModel from '../../model/secret.model';
import SecretItem from './SecretItem';

type SecretListProps = {
    secrets: SecretModel[];
    onEdit(x: SecretModel): void;
    onDelete(id: string): void;
};

const SecretList = ({ secrets, onEdit, onDelete }: SecretListProps) => {
    const countDown = useCountdownTimer();
    return (
        <List className="flex flex-col w-full" data-testid="lstSecretList">
            {secrets.map(k => (
                <SecretItem
                    key={k.key}
                    k={k}
                    countDown={countDown}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </List>
    );
};

export default memo(SecretList);
