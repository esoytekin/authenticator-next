import { TextField } from '@mui/material';
import { memo } from 'react';

type SecretsFilterProps = {
    value: string;
    onChange(x: string): void;
};

const SecretsFilter = ({ value, onChange }: SecretsFilterProps) => {
    return (
        <TextField
            data-testid="txtSecretsFilter"
            placeholder="Type to filter..."
            label="Filter"
            fullWidth
            margin="normal"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
};

export default memo(SecretsFilter);
