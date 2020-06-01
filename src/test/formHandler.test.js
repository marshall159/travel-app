import { handleSubmit } from '../client/js/formHandler';

it('handleSubmit prevents default behaviour on submit', () => {
    const mockEvent = {
        preventDefault: jest.fn()
    };

    try {
        handleSubmit(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    } catch (error) {
        throw new Error('Test failed');
    }

});