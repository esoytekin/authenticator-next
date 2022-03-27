import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';
import SecretModel from '../model/secret.model';

type DialogAddSecretProps = {
    open: boolean;
    onClose(): void;
    onSave(secret: SecretModel): void;
    selected?: SecretModel;
};

const initialValue: SecretModel = {
    key: '',
    site: '',
};

const DialogAddSecret = ({
    open,
    onClose,
    onSave,
    selected,
}: DialogAddSecretProps) => {
    const [val, setVal] = useState(initialValue);

    useEffect(() => {
        if (open && selected) {
            setVal(selected);
        }
    }, [selected, open]);

    const handleSave = () => {
        onSave(val);
        setVal(initialValue);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {val.id ? `Edit ${selected?.site}` : 'Add New Secret'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    type="text"
                    fullWidth
                    margin="normal"
                    label="Site Name"
                    placeholder="enter site name"
                    required
                    value={val.site}
                    onChange={e => {
                        setVal(prev => ({ ...prev, site: e.target.value }));
                    }}
                />
                <TextField
                    type="text"
                    fullWidth
                    margin="normal"
                    label="Secret"
                    placeholder="enter secret"
                    required
                    value={val.key}
                    onChange={e => {
                        setVal(prev => ({ ...prev, key: e.target.value }));
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(DialogAddSecret);
