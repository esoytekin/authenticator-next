import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Navbar from './Navbar';

const mockLogout = jest.fn(async _dispatch => {
    // console.log('called logout');
});

jest.mock('store/app/user.slice', () => ({
    logout: () => mockLogout,
}));

describe('Navbar works as expected', () => {
    test('Add button call onAdd', () => {
        const mockOnAdd = jest.fn();
        const { getByTestId } = render(
            <Provider store={store}>
                <Navbar onAddClick={mockOnAdd} error={null} />
            </Provider>
        );
        const btnAdd = getByTestId('btnAdd');
        expect(btnAdd).toBeInTheDocument();

        fireEvent.click(btnAdd);

        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    test('logout button triggers logout action', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <Navbar onAddClick={jest.fn()} error={null} />
            </Provider>
        );

        const btnLogout = getByTestId('btnLogout');

        expect(btnLogout).toBeInTheDocument();
        fireEvent.click(btnLogout);

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});
