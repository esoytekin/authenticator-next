import { render, fireEvent } from '@testing-library/react';
import SecretModel from '../model/secret.model';
import DialogAddSecret from './addSecret.dialog';

describe('AddSecretDialog works as expected', () => {
    test('Add New is rendered on init', () => {
        const { getByRole } = render(
            <DialogAddSecret
                open
                selected={undefined}
                onSave={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const heading = getByRole('heading', { name: 'Add New Secret' });
        expect(heading).toBeInTheDocument();
    });

    test('Edit is rendered on init', () => {
        const mockSecret: SecretModel = {
            id: 'abcd',
            site: 'abcd',
            key: 'abcd',
        };
        const { getByRole } = render(
            <DialogAddSecret
                open
                selected={mockSecret}
                onSave={jest.fn()}
                onClose={jest.fn()}
            />
        );

        const heading = getByRole('heading', { name: 'Edit abcd' });
        expect(heading).toBeInTheDocument();
    });

    test('cancel calls onClose', () => {
        const mockOnClose = jest.fn();
        const { getByRole } = render(
            <DialogAddSecret
                open
                selected={undefined}
                onSave={jest.fn()}
                onClose={mockOnClose}
            />
        );

        const btnOnClose = getByRole('button', { name: 'Cancel' });
        fireEvent.click(btnOnClose);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('save button calls with correct params', () => {
        const mockOnSave = jest.fn();

        const { getByRole } = render(
            <DialogAddSecret
                open
                selected={undefined}
                onSave={mockOnSave}
                onClose={jest.fn()}
            />
        );

        const heading = getByRole('heading', { name: 'Add New Secret' });
        expect(heading).toBeInTheDocument();

        const inpSecret = getByRole('textbox', { name: 'Secret' });
        const inpSiteName = getByRole('textbox', { name: 'Site Name' });

        fireEvent.change(inpSiteName, { target: { value: 'site-name' } });
        fireEvent.change(inpSecret, { target: { value: 'secret-item' } });

        const btnOnSave = getByRole('button', { name: 'Save' });
        fireEvent.click(btnOnSave);

        expect(mockOnSave).toHaveBeenCalledTimes(1);
        const params = mockOnSave.mock.calls[0][0];

        expect(params).toEqual({
            site: 'site-name',
            key: 'secret-item',
        });
    });
});
