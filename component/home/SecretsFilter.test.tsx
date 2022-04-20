import { render, fireEvent } from '@testing-library/react';
import SecretsFilter from './SecretsFilter';

const ID = 'txtSecretsFilter';

describe('SecretsFilter works as expected', () => {
    it('should render', () => {
        const { getByTestId } = render(
            <SecretsFilter value="" onChange={() => {}} />
        );
        const txtSecretsFilter = getByTestId(ID);

        expect(txtSecretsFilter).toBeInTheDocument();
    });

    it('should send onChangeEvent', () => {
        const mockOnChange = jest.fn();

        const { getByTestId } = render(
            <SecretsFilter value="" onChange={mockOnChange} />
        );
        const txtSecretsFilter = getByTestId(ID);

        const inpSecretsFilter =
            txtSecretsFilter.querySelector('input[type="text"]');

        if (!inpSecretsFilter) {
            throw new Error();
        }

        fireEvent.change(inpSecretsFilter, { target: { value: 'testValue' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);

        const params = mockOnChange.mock.calls[0][0];

        expect(params).toEqual('testValue');
    });
});
