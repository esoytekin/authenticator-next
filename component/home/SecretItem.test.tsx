import { render, within, cleanup, fireEvent } from '@testing-library/react';
import SecretModel from '../../model/secret.model';
import SecretItem from './SecretItem';

describe('SecretItem works as expected', () => {
    it('should render', () => {
        const model: SecretModel = {
            key: 'testsite',
            site: 'TEST_SITE',
        };
        const { getByRole, debug } = render(
            <SecretItem
                k={model}
                countDown={1}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );
        const li = getByRole('listitem');
        expect(li).toBeInTheDocument();

        expect(within(li).getByText(/TEST_SITE/)).toBeInTheDocument;
    });
    test('onEdit calls with correct params', () => {
        const mockOnEdit = jest.fn();
        const model: SecretModel = {
            key: 'testsite',
            site: 'TEST_SITE',
        };
        const { getByRole, debug } = render(
            <SecretItem
                k={model}
                countDown={1}
                onEdit={mockOnEdit}
                onDelete={jest.fn()}
            />
        );
        const li = getByRole('listitem');
        const iconEdit = within(li).getByTestId('EditOutlinedIcon');

        fireEvent.click(iconEdit);

        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        const params = mockOnEdit.mock.calls[0][0];

        expect(params).toEqual(model);
    });

    test('onDelete called with correct params', () => {
        const mockOnDelete = jest.fn();
        const model: SecretModel = {
            key: 'testsite',
            site: 'TEST_SITE',
            id: 'abcd',
        };
        const { getByRole, debug } = render(
            <SecretItem
                k={model}
                countDown={1}
                onEdit={jest.fn()}
                onDelete={mockOnDelete}
            />
        );
        const li = getByRole('listitem');
        const iconDelete = within(li).getByTestId('DeleteOutlinedIcon');

        fireEvent.click(iconDelete);

        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        const params = mockOnDelete.mock.calls[0][0];

        expect(params).toEqual(model.id);
    });
});
