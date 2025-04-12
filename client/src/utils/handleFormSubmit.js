import axios from 'axios';

export const handleFormSubmit = async ({
    endpoint,
    id,
    formData,
    setItems,
    successMessage = 'Operation successful!',
    navigateTo,
    navigate,
}) => {
    const filteredFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
    );

    try {
        let response;
        if (id) {
            // Update existing item
            response = await axios.put(`${endpoint}/${id}`, filteredFormData);
            if (setItems) {
                setItems((prevItems) =>
                    prevItems.map((item) => (item._id === id ? response.data : item))
                );
            }
        } else {
            // Create new item
            response = await axios.post(endpoint, filteredFormData);
            if (setItems) {
                setItems((prevItems) => [...prevItems, response.data]);
            }
        }

        alert(successMessage);
        if (navigateTo && navigate) {
            navigate(navigateTo);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
};