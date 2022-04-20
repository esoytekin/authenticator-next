import { render, fireEvent } from '@testing-library/react';
import SecretModel from '../../model/secret.model';
import SecretList from './SecretList';

jest.mock('./SecretItem', () => {
    return ({ countDown, onEdit, onDelete }: any) => (
        <div>
            <div role="contentinfo">{countDown}</div>
            <button onClick={() => onEdit('x')}>EDIT</button>
            <button onClick={() => onDelete('y')}>DELETE</button>
        </div>
    );
});

describe('SecretList works as expected', () => {
    it('should render 0 elements if emtpy', () => {
        const { getByRole } = render(
            <SecretList secrets={[]} onEdit={jest.fn()} onDelete={jest.fn()} />
        );

        const ls = getByRole('list');

        expect(ls).toBeInTheDocument();

        expect(ls.childElementCount).toEqual(0);
    });

    it('should render elements if not empty', () => {
        const secrets: SecretModel[] = [
            {
                key: 'abc',
                site: 'ABC',
                id: 'abc',
            },
        ];
        const { getByRole, debug } = render(
            <SecretList
                secrets={secrets}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );

        const ls = getByRole('list');

        expect(ls).toBeInTheDocument();

        expect(ls.childElementCount).toEqual(secrets.length);

        expect(getByRole('contentinfo')).toHaveTextContent(/\d+/);
    });

    it('should pass onEdit, onDelete actions', () => {
        const secrets: SecretModel[] = [
            {
                key: 'abc',
                site: 'ABC',
                id: 'abc',
            },
        ];
        const mockOnEdit = jest.fn();
        const mockOnDelete = jest.fn();
        const { getByRole } = render(
            <SecretList
                secrets={secrets}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const btnEdit = getByRole('button', { name: 'EDIT' });
        const btnDelete = getByRole('button', { name: 'DELETE' });

        expect(mockOnEdit).toHaveBeenCalledTimes(0);
        expect(mockOnDelete).toHaveBeenCalledTimes(0);

        fireEvent.click(btnEdit);
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnEdit.mock.calls[0][0]).toEqual('x');

        fireEvent.click(btnDelete);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete.mock.calls[0][0]).toEqual('y');
    });
});
